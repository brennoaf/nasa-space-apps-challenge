import { MoonPopup } from "./moonPopupHandler.js"
import { MarsPopup } from "./marsPopupHandler.js"

const page = {
    main: {
        content: document.querySelector('main'),
        sendDataButton: document.querySelectorAll('.send-button'),

        totalGraphsContainer: document.querySelectorAll('.plot'),

    },

    popup: {
        openPopup: document.querySelector('.button-popup'),
        closePopup: document.querySelector('.close-popup'),
        content: document.querySelector('.popup-content')

    },

    moon: {
        content: document.querySelector('.moon'),

        infoBar: document.querySelector('.moon-bar'),
        infoText: document.querySelector('.moon-bar-text'),
        startButton: document.querySelector('.moon-start-button'),

        analysisContent: document.querySelector('.moon-analysis'),
        chooseDataContent: document.querySelector('.choose-moon-data'),
        graphsContainer: document.querySelector('.moon-graphs'),
        zipDataInput: document.querySelector('.moon-zip-file'),
        sendDataButton: document.querySelectorAll('.send-button'),
        exitMoonButton: document.querySelector('.go-mars-content'),

        self: document.querySelector('.moon-representation'),
    },

    mars: {
        content: document.querySelector('.mars'),

        infoBar: document.querySelector('.mars-bar'),
        infoText: document.querySelector('.mars-bar-text'),
        startButton: document.querySelector('.mars-start-button'),

        analysisContent: document.querySelector('.mars-analysis'),
        chooseDataContent: document.querySelector('.choose-mars-data'),
        graphsContainer: document.querySelector('.mars-graphs'),
        zipDataInput: document.querySelector('.mars-zip-file'),
        sendDataButton: document.querySelectorAll('.send-button'),
        exitMarsButton: document.querySelector('.go-moon-content'),

        self: document.querySelector('.mars-representation'),
    }
}

window.addEventListener('load', () => {
    page.main.totalGraphsContainer.forEach(graphContainer =>{
        Plotly.Plots.resize(graphContainer);
    });

    page.popup.closePopup.addEventListener('click', () => {
        page.popup.content.classList.toggle('hidden');
    });

    page.popup.openPopup.addEventListener('click', () => {
        console.log('oi')
        page.popup.content.classList.toggle('hidden');
    });
});

const moonpopup = new MoonPopup(page);
const marspopup = new MarsPopup(page);