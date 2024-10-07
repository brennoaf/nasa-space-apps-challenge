export class MoonPopup{
    constructor(page){
        this.page = page;

        this.setupStart();
    }

    setupStart(){
        const { moon } = this.page;

        if (
            window.location.pathname === '/process_local/moon' ||
            window.location.pathname === '/process_zip/moon' ||
            (window.location.pathname === '/process_files_view' && new URLSearchParams(window.location.search).get('corpus') === 'moon')
        ) {
            moon.startButton.style.display = 'none';
            moon.infoText.style.display = 'none';
            moon.analysisContent.classList.remove('hidden');
            moon.chooseDataContent.classList.add('hidden');
            moon.graphsContainer.classList.remove('hidden');
            moon.analysisContent.style.opacity = '1';
            moon.infoBar.style.bottom = '0';
            moon.infoBar.style.height = '450px';

            this.page.moon.exitMoonButton.remove()
            this.page.mars.content.remove();
        }


        moon.startButton.addEventListener('click', () =>{
            moon.self.style.transform = 'scale(2)';
            moon.infoText.style.opacity = '0';
            moon.startButton.style.display = 'none';
            moon.infoBar.style.bottom = '0';

            setTimeout(() =>{
                moon.infoText.style.display = 'none';
                moon.analysisContent.classList.toggle('hidden');
                moon.analysisContent.style.opacity = '1';
            }, 700)
        });

        moon.sendDataButton.forEach(button => {
            button.addEventListener('click', () =>{
                if(moon.zipDataInput.value){
                    moon.analysisContent.style.opacity = '0';

                    setTimeout(() =>{
                        moon.analysisContent.classList.toggle('hidden');
                    }, 700)
                }
            });
        });

        moon.exitMoonButton.addEventListener('click', () =>{
            const moonContent = moon.content;

            moonContent.style.marginLeft = '-100%';
        })
    }
}