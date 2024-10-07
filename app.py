import numpy as np
import pandas as pd
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for
import plotly.graph_objects as go
import plotly.offline as pyo
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import zipfile
import os
import tempfile
from scipy import signal
from obspy.signal.trigger import recursive_sta_lta, trigger_onset

app = Flask(__name__)

current_index = 0
data_files = []
catalog_file = None
corpus = ''

# Function to read the ZIP file and return the paths of the CSV files
def read_zip(zip_path):
    catalog_files = []
    data_files_local = []

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # List the files in the ZIP
        for file_info in zip_ref.infolist():
            if file_info.filename.startswith('catalogs/') and file_info.filename.endswith('.csv'):
                catalog_files.append(file_info.filename)
            elif file_info.filename.startswith('data/') and file_info.filename.endswith('.csv'):
                data_files_local.append(file_info.filename)

        # Extract the files to the current directory
        zip_ref.extractall()

    return catalog_files, data_files_local

# Function to read catalog and data files locally
def read_local_files(corpus):
    catalog_files = []
    data_files_local = []

    if corpus == 'moon':
        cat_directory = './corpus/data/lunar/catalogs'
        data_directory = './corpus/data/lunar/data'
        catalog_files.append(os.path.join(cat_directory, 'apollo12_catalog_GradeA_final.csv'))
        data_files_local = [os.path.join(data_directory, f) for f in os.listdir(data_directory) if f.endswith('.csv')]
    elif corpus == 'mars':
        cat_directory = './corpus/data/mars/catalogs/'
        data_directory = './corpus/data/mars/data/'
        catalog_files.append(os.path.join(cat_directory, 'Mars_InSight_training_catalog_final.csv'))
        data_files_local = [os.path.join(data_directory, f) for f in os.listdir(data_directory) if f.endswith('.csv')]

    return catalog_files, data_files_local


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_zip/<string:corpus_param>', methods=['POST'])
def process_zip(corpus_param):
    global current_index, data_files, catalog_file, corpus

    # Use the corpus_param from the URL
    corpus = corpus_param

    if corpus not in ['moon', 'mars']:
        return "Invalid corpus.", 404
        
    zip_file = request.files['zip_file']
    
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_path = os.path.join(temp_dir, zip_file.filename)
        zip_file.save(zip_path)

        # Receive read_zip arrays and insert into global arrays
        catalog_files, data_files = read_zip(zip_path)

        if not catalog_files:
            return "CSV files not found in 'catalog'.", 404
        if not data_files:
            return "CSV files not found in 'data'.", 404

        catalog_file = catalog_files[0]  # Select first catalog
        current_index = 0  # Reset index

        return process_files(catalog_file, data_files[current_index], corpus)


@app.route('/process_local/<string:corpus_param>', methods=['POST'])
def process_local(corpus_param):
    global current_index, data_files, catalog_file, corpus

    # Set the global corpus from the URL parameter
    corpus = corpus_param

    if corpus not in ['moon', 'mars']:
        return "Invalid corpus.", 404

    catalog_files, data_files = read_local_files(corpus)

    if not catalog_files or not data_files:
        return "CSV File not found.", 404

    catalog_file = catalog_files[0]  # Select first catalog
    current_index = 0  # Reset index

    return process_files(catalog_file, data_files[current_index], corpus)


@app.route('/next')
def next_file():
    global current_index, corpus
    current_index += 1
    if current_index >= len(data_files):
        current_index = len(data_files) - 1  # Stay on last archive
    return redirect(url_for('process_files_view', corpus=corpus))

@app.route('/previous')
def previous_file():
    global current_index, corpus
    current_index -= 1
    if current_index < 0:
        current_index = 0  # Stay on the first file
    return redirect(url_for('process_files_view', corpus=corpus))


@app.route('/process_files_view')
def process_files_view():
    global current_index, corpus
    if not data_files:
        return "CSV file not found.", 404

    if current_index >= len(data_files):
        return "Files index out of range.", 404

    return process_files(catalog_file, data_files[current_index], corpus)


def process_files(cat_file, data_cat_file, corpus):
    global current_index

    print(f"Processing {corpus} files")

    if cat_file is None:
        return "Catalog file not found.", 400 


    data_cat = pd.read_csv(data_cat_file)

    # Read the time steps and velocities
    if corpus == 'moon':
        csv_times = np.array(data_cat['time_rel(sec)'].tolist())
        csv_data = np.array(data_cat['velocity(m/s)'].tolist())
        csv_time_abs = pd.to_datetime(data_cat['time_abs(%Y-%m-%dT%H:%M:%S.%f)'])

    elif corpus == 'mars':
        csv_times = np.array(data_cat['rel_time(sec)'].tolist())
        csv_data = np.array(data_cat['velocity(c/s)'].tolist())
        csv_time_abs = pd.to_datetime(data_cat['time(%Y-%m-%dT%H:%M:%S.%f)'])


    first_date = csv_time_abs.iloc[current_index]

    # Date and file name just to display
    formatted_date = first_date.strftime('%Y-%m-%d')
    file_name = os.path.basename(data_cat_file)


    if len(csv_times) == 0 or len(csv_data) == 0:
        return "Time or velocity data is empty.", 400


    df = pd.DataFrame({'time': csv_times, 'velocity': csv_data})

    # Interpolation of data using linear method to avoid blank data
    df.interpolate(method='linear', inplace=True)

    # updating arrays
    csv_times = df['time'].to_numpy()
    csv_data = df['velocity'].to_numpy()

    # Calculate the average frequency of the waves
    dt = np.mean(np.diff(csv_times))
    sampling_rate = 1 / dt  # sampling rate in Hz
    
    # Improved data filtering
    nyquist = 0.5 * sampling_rate
    low = 0.1 / nyquist
    high = 10 / nyquist
    if low >= 1 or high >= 1:
        # If frequencies are too high, adjust them
        low = min(low, 0.99)
        high = min(high, 0.99)

    # Data filtering
    b, a = signal.butter(4, [low, high], btype='band')
    csv_data_filt = signal.filtfilt(b, a, csv_data)

    # Improved STA/LTA detection
    nsta = int(1 * sampling_rate)  # Short-term window
    nlta = int(5 * sampling_rate)    # Long-term window
    sta_lta = recursive_sta_lta(csv_data_filt, nsta, nlta)
    
    # Define a threshold for event detection
    if corpus == 'moon':
        trigger_level = 2.5
    
    elif corpus == 'mars':
        trigger_level = 3

    detections = trigger_onset(sta_lta, trigger_level, trigger_level * 0.5)

    detected_times =  csv_times[detections[:, 0]] if len(detections) > 0 else []

    # Filter out very close events
    filtered_times = []

    last_time = -0.05 * (csv_times[-1] - csv_times[0])  # 5% of total time

    for t in detected_times:
        if t - last_time >= 0.05 * (csv_times[-1] - csv_times[0]):
            filtered_times.append(t)
            last_time = t

    # Additional filtering based on maintenance threshold period
    maintenance_window = int(1 / dt)  # maintenance window
    times_to_remove = []

    for t in filtered_times:
        start_index = np.searchsorted(csv_times, t)
        end_index = start_index + maintenance_window

        if np.all(sta_lta[start_index:end_index - 2] > trigger_level):
            times_to_remove.append(t)

    for t in times_to_remove:
        filtered_times.remove(t)


    # Criterion to remove points with large y and small x
    y_threshold_ratio = 10 #y threshould limit
    mask = np.abs(csv_data_filt / csv_times) < y_threshold_ratio

    # Apply the mask to filter the data
    filtered_csv_times = csv_times[mask]
    filtered_csv_data_filt = csv_data_filt[mask]


     # Quantify STA's
    num_stas = len(filtered_times)
    num_removed = len(times_to_remove)

    # Set STA's and removed data texts
    sta_info = f"{num_stas} STAs were detected. Times of each: <br><p class='sta-data-values'>{'<br>'.join(map(str, filtered_times))}</p>"
    bugs_or_noises = f"{num_removed} glitches or noises were detected. Times of each: <br><p class='removed-data-values'>{'<br>'.join(map(str, times_to_remove))}</p>"
    file_info = f"Analyzed file: <p>{file_name}</p>"
    date_info = f"Date: <p>{formatted_date}</p>"

    # Create the filtered data plot
    time_series_fig = go.Figure()
    time_series_fig.add_trace(go.Scatter(x=filtered_csv_times, y=filtered_csv_data_filt, mode='lines', name='Filtered Velocity Data', line=dict(color='blue')))
    for t in filtered_times:
        time_series_fig.add_vline(x=t, line=dict(color='cyan', width=1, dash='dash'), name='STA Detection')
    for t in times_to_remove:
        time_series_fig.add_vline(x=t, line=dict(color='red', width=1, dash='dash'), name='Noise/Glitch Detection')
    time_series_fig.update_layout(
        title='Filtered Velocity Data Over Time',
        xaxis_title='Time (s)',
        yaxis_title='Velocity (m/s)',
        plot_bgcolor='#202020',
        paper_bgcolor='#121212',
        font_color='white',
        width=None,
        height=400,
        margin=dict(l=50, r=50, t=50, b=50),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )

    # Create the STA plot
    sta_fig = go.Figure()
    sta_fig.add_trace(go.Scatter(x=csv_times, y=sta_lta, mode='lines', name='STA/LTA Ratio', line=dict(color='green')))
    sta_fig.add_hline(y=trigger_level, line=dict(color='red', dash='dash'), name='STA Threshold')
    sta_fig.update_layout(
        title='Short-Term Average (STA) Detection',
        xaxis_title='Time (s)',
        yaxis_title='STA Value',
        plot_bgcolor='#202020',
        paper_bgcolor='#121212',
        font_color='white',
        width=None,
        margin=dict(l=50, r=50, t=50, b=50),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )
    
    tr_data_filt = filtered_csv_data_filt  # filtered data  
    arrival = filtered_times[0] if filtered_times else 0
    
    if len(tr_data_filt) > 0 and len(csv_times) > 0:
        f, t, sxx = signal.spectrogram(tr_data_filt, fs=sampling_rate)  # fs: show rate

        sxx_normalized = (sxx - np.min(sxx)) / (np.max(sxx) - np.min(sxx))

        # change interger multiplication to control sensibility
        z = 1 * np.log10(sxx_normalized + 1e-10)
        # Create the spectrogram plot
        spectrogram_fig = go.Figure(data=go.Heatmap(
                x=t,
                y=f,
                z=z,  # spectogram potency in db and avoiding log(0)
                colorscale='Jet',
                colorbar=dict(title="Power (dB)", orientation='h'),
            ))

        spectrogram_fig.add_hline(y=trigger_level, line=dict(color='red', dash='dash'), name='STA Threshold')
        spectrogram_fig.update_layout(
            title='Spectrogram',
            xaxis_title='Time (s)',
            yaxis_title='Frequency (Hz)',
            plot_bgcolor='#202020',
            paper_bgcolor='#121212',
            font_color='white',
            width=None,
            height=400,
        )
    else:
        spectrogram_fig = go.Figure()

    plot_names = {
        'moon': 'moon_time_series_plot',
        'mars': 'mars_time_series_plot'
    }

    sta_names = {
        'moon': 'moon_sta_plot',
        'mars': 'mars_sta_plot'
    }

    spec_names = {
        'moon': 'moon_spectrogram_plot',
        'mars': 'mars_spectrogram_plot'
    }

    # Generate the plots as HTML
    time_series_plot = pyo.plot(time_series_fig, include_plotlyjs=False, output_type='div')
    sta_plot = pyo.plot(sta_fig, include_plotlyjs=False, output_type='div')
    spectrogram_plot = pyo.plot(spectrogram_fig, include_plotlyjs=False, output_type='div')

    # Setting var names by corpus
    time_series_plot_name = plot_names.get(corpus, 'default_time_series_plot')
    sta_plot_name = sta_names.get(corpus, 'default_sta_plot')
    spectrogram_plot_name = spec_names.get(corpus, 'default_sta_plot')

    # Add classes to the plots
    time_series_plot = time_series_plot.replace('<div ', '<div class="time-series-plot plot" ')
    sta_plot = sta_plot.replace('<div ', '<div class="sta-plot plot" ')
    spectrogram_plot = spectrogram_plot.replace('<div ', '<div class="spectrogram-plot plot" ')



    # Render the plots in the template
    return render_template('index.html', 
                           **{
                              'file_info': file_info,
                              'date_info': date_info,
                              time_series_plot_name: time_series_plot,
                              sta_plot_name: sta_plot,
                              spectrogram_plot_name: spectrogram_plot,
                              'sta_info': sta_info,
                              'bugs_or_noises': bugs_or_noises,
                              })


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
