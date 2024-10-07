## Project Manguesol

This project aims to collect and analyze seismic data from the Moon and Mars, utilizing advanced algorithms to filter noise and glitches. Using Python and specific libraries, we implemented a fourth-order Butterworth filter to optimize seismic data analysis, allowing for a deeper exploration of the seismic activities of these celestial bodies.
## Overview

The project consists of a web application developed with Flask that enables the collection of seismic data from ZIP files or local directories. The data is processed to identify seismic events, calculate their duration, and visualize the results in interactive graphs. The application also provides a website to facilitate the presentation of Short-Term Average (STA) and velocity graphs, as well as to quantify the occurrence of STAs and identify potential noise and glitches.
## Features

- Collection and analysis of seismic data from the Moon and Mars.
- Application of Butterworth filter for noise removal.
- Interactive graphs of filtered data and STA.
- Intuitive navigation to explore multiple data files.
- Quantification of STAs and identification of glitches.
- User-friendly and responsive interface (desktop).
## Technologies Used

- **Backend:** Flask
- **Data Processing:** Python, NumPy, Pandas
- **Data Visualization:** Plotly
- **Signal Processing:** SciPy
- **HTML/CSS/JavaScript** for the web interface

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- Python 3.x
- pip (Python package manager)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/brennoaf/nasa-space-apps-challenge.git
   cd nasa-space-apps-challenge

2. Install the necessary dependencies:

    ```bash
    pip install -r requirements.txt

3. Run the application:

    ```bash
    python app.py

### The application will start at http://127.0.0.1:5000/.
## Usage

1. Access the application through your browser.
2. Upload ZIP files containing the seismic data or use local data from the appropriate directory.

### Your data file needs to be structured as follows:
#### For Zipped Moon Data:

- Catalog Directory:
    - Path: ./lunar/catalogs/
    - Example: catalog.csv

- Data Directory:
    - Path: ./lunar/data/
    - Example: datas1.csv


    1. Example Catalog Format for datas1.csv:

        ```bash
            filename,time_abs(%Y-%m-%dT%H:%M:%S.%f),time_rel(sec),evid
            XB.ELYSE.02.BHV.2022-02-03HR08_evid0005.csv,2022-02-03T08:08:27.000000,507.0,evid0005
            XB.ELYSE.02.BHV.2022-01-02HR04_evid0006.csv,2022-01-02T04:35:30.000000,2130.0,evid0006
    

    2. Example Data Format for datas1.csv:
    
        ```bash
        time_abs(%Y-%m-%dT%H:%M:%S.%f),time_rel(sec),velocity(m/s)
        1969-12-16T00:00:00.178000,0.0,0.0
        1969-12-16T00:00:00.328943,0.1509433962264151,-5.57693957027173e-15
        1969-12-16T00:00:00.479887,0.3018867924528302,-1.115387914054346e-14


#### For Mars Data:

- Catalog Directory:
    - Path: ./mars/catalogs/
    - Example: Mars_InSight_training_catalog_final.csv

- Data Directory:
    - Path: ./mars/data/
    - Example: mars_data1.csv


    1. Example Catalog Format for Mars_InSight_training_catalog_final.csv:

        ```bash
        filename,time_abs(%Y-%m-%dT%H:%M:%S.%f),time_rel(sec),evid
        XB.ELYSE.02.BHV.2022-02-03HR08_evid0005.csv,2022-02-03T08:08:27.000000,507.0,evid0005
        XB.ELYSE.02.BHV.2022-01-02HR04_evid0006.csv,2022-01-02T04:35:30.000000,2130.0,evid0006


    2. Example Data Format for mars_data1.csv (attention to velocity in c/s and rel_time name):

        ```bash
        time(%Y-%m-%dT%H:%M:%S.%f),rel_time(sec),velocity(c/s)
        2019-05-23T02:00:00.032000,0.0,-0.0
        2019-05-23T02:00:00.082000,0.05,0.00019864462531553602
        2019-05-23T02:00:00.132000,0.1,-0.0016299490582643063

3. Navigate through the options to view velocity and STA graphs.
4. Analyze the seismic events and the provided information about glitches and STAs.
## Additional Information

- The application provides options for processing ZIP files or reading from local directories.
- Ensure your CSV files conform to the specified formats to avoid errors during data processing.
- You can explore the output graphs to understand the seismic activity in greater detail and identify potential events of interest.