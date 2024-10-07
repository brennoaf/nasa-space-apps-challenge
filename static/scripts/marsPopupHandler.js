export class MarsPopup{
    constructor(page){
        this.page = page;

        this.setupStart();
    }

    setupStart(){
        const { mars } = this.page;

        if (
            window.location.pathname === '/process_local/mars' ||
            window.location.pathname === '/process_zip/mars' ||
            (window.location.pathname === '/process_files_view' && new URLSearchParams(window.location.search).get('corpus') === 'mars')
        ) {
            this.page.moon.content.remove();
            mars.exitMarsButton.remove();
        
            mars.startButton.style.display = 'none';
            mars.infoText.style.display = 'none';
            mars.analysisContent.classList.remove('hidden');
            mars.chooseDataContent.classList.add('hidden');
            mars.graphsContainer.classList.remove('hidden');
            mars.analysisContent.style.opacity = '1';
            mars.infoBar.style.bottom = '0';
            mars.infoBar.style.height = '450px';
        }
        

        console.log(mars.self)

        mars.startButton.addEventListener('click', () =>{
            mars.self.style.transform = 'scale(2)';
            mars.infoText.style.opacity = '0';
            mars.startButton.style.display = 'none';
            mars.infoBar.style.bottom = '0';

            setTimeout(() =>{
                mars.infoText.style.display = 'none';
                mars.analysisContent.classList.toggle('hidden');
                mars.analysisContent.style.opacity = '1';
            }, 700)
        });

        mars.sendDataButton.forEach(button => {
            button.addEventListener('click', () =>{
                if(mars.zipDataInput.value){
                    mars.analysisContent.style.opacity = '0';

                    setTimeout(() =>{
                        mars.analysisContent.classList.toggle('hidden');
                    }, 700)
                }
            });
        });

        mars.exitMarsButton.addEventListener('click', () =>{
            console.log('oi')
            this.page.moon.content.style.marginLeft = '0';

        })
    }
}