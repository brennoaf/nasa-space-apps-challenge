const sceneMars = new THREE.Scene();
const cameraMars = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const rendererMars = new THREE.WebGLRenderer({ alpha: true }); // Canvas transparente
rendererMars.setSize(350, 350);
document.querySelector('.mars-representation').appendChild(rendererMars.domElement);

const geometryMars = new THREE.SphereGeometry(1, 45, 45);
const marsTextureLoader = new THREE.TextureLoader();
const marsTexture = marsTextureLoader.load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9b7029c3-9717-4658-9066-11c30aa24029/dcsauye-ba810e63-20e3-4ae9-a73c-9201ed87e67d.png/v1/fill/w_1280,h_640,q_80,strp/mars_texture_map__rare_version__by_oleg_pluton_dcsauye-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWI3MDI5YzMtOTcxNy00NjU4LTkwNjYtMTFjMzBhYTI0MDI5XC9kY3NhdXllLWJhODEwZTYzLTIwZTMtNGFlOS1hNzNjLTkyMDFlZDg3ZTY3ZC5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.bVzQQe3M_FRJKATXUZN-hTsjTNL7-eucoxqWhgYKkvA"); 
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(geometryMars, marsMaterial);
sceneMars.add(mars);

cameraMars.position.z = 2;

// Configuração da cena para a Lua
const sceneMoon = new THREE.Scene();
const cameraMoon = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const rendererMoon = new THREE.WebGLRenderer({ alpha: true }); // Canvas transparente
rendererMoon.setSize(350, 350);
document.querySelector('.corpus-representation').appendChild(rendererMoon.domElement);

const geometryMoon = new THREE.SphereGeometry(1, 32, 32);
const moonTextureLoader = new THREE.TextureLoader();
const moonTexture = moonTextureLoader.load('https://mattloftus.github.io/images/moon_texture.jpg'); // URL da textura da Lua
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(geometryMoon, moonMaterial);
sceneMoon.add(moon);

cameraMoon.position.z = 2;

// Variáveis para controle de arraste
let isDraggingMars = false;
let previousMouseXMars = 0;
let previousMouseYMars = 0;

let isDraggingMoon = false;
let previousMouseXMoon = 0;
let previousMouseYMoon = 0;

// Eventos para Marte
document.addEventListener('mousedown', (event) => {
    isDraggingMars = true;
    previousMouseXMars = event.clientX;
    previousMouseYMars = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDraggingMars = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDraggingMars) {
        const deltaX = event.clientX - previousMouseXMars;
        const deltaY = event.clientY - previousMouseYMars;

        mars.rotation.y += deltaX * 0.01;
        mars.rotation.x += deltaY * 0.01;

        previousMouseXMars = event.clientX;
        previousMouseYMars = event.clientY;
    }
});

// Eventos para a Lua
document.addEventListener('mousedown', (event) => {
    isDraggingMoon = true;
    previousMouseXMoon = event.clientX;
    previousMouseYMoon = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDraggingMoon = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDraggingMoon) {
        const deltaX = event.clientX - previousMouseXMoon;
        const deltaY = event.clientY - previousMouseYMoon;

        moon.rotation.y += deltaX * 0.01;
        moon.rotation.x += deltaY * 0.01;

        previousMouseXMoon = event.clientX;
        previousMouseYMoon = event.clientY;
    }
});

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    rendererMars.render(sceneMars, cameraMars);
    rendererMoon.render(sceneMoon, cameraMoon);
}

animate();
