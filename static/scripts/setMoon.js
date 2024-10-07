const sceneMars = new THREE.Scene();
const cameraMars = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const rendererMars = new THREE.WebGLRenderer({ alpha: true });
rendererMars.setSize(350, 350);
document.querySelector('.mars-representation').appendChild(rendererMars.domElement);

const geometryMars = new THREE.SphereGeometry(1, 45, 45);
const marsTextureLoader = new THREE.TextureLoader();
const marsTexture = marsTextureLoader.load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9b7029c3-9717-4658-9066-11c30aa24029/dcsauye-ba810e63-20e3-4ae9-a73c-9201ed87e67d.png/v1/fill/w_1280,h_640,q_80,strp/mars_texture_map__rare_version__by_oleg_pluton_dcsauye-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWI3MDI5YzMtOTcxNy00NjU4LTkwNjYtMTFjMzBhYTI0MDI5XC9kY3NhdXllLWJhODEwZTYzLTIwZTMtNGFlOS1hNzNjLTkyMDFlZDg3ZTY3ZC5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.bVzQQe3M_FRJKATXUZN-hTsjTNL7-eucoxqWhgYKkvA"); 
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(geometryMars, marsMaterial);
sceneMars.add(mars);

cameraMars.position.z = 2;

const sceneMoon = new THREE.Scene();
const cameraMoon = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const rendererMoon = new THREE.WebGLRenderer({ alpha: true });
rendererMoon.setSize(350, 350);
document.querySelector('.corpus-representation').appendChild(rendererMoon.domElement);

const geometryMoon = new THREE.SphereGeometry(1, 32, 32);
const moonTextureLoader = new THREE.TextureLoader();
const moonTexture = moonTextureLoader.load('https://mattloftus.github.io/images/moon_texture.jpg');
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(geometryMoon, moonMaterial);
sceneMoon.add(moon);

cameraMoon.position.z = 2;

let isDraggingMars = false;
let previousMouseXMars = 0;
let previousMouseYMars = 0;

let isDraggingMoon = false;
let previousMouseXMoon = 0;
let previousMouseYMoon = 0;


function startDrag(event, isMoon) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    if (isMoon) {
        isDraggingMoon = true;
        previousMouseXMoon = clientX;
        previousMouseYMoon = clientY;
    } else {
        isDraggingMars = true;
        previousMouseXMars = clientX;
        previousMouseYMars = clientY;
    }
}

function endDrag(isMoon) {
    if (isMoon) {
        isDraggingMoon = false;
    } else {
        isDraggingMars = false;
    }
}

function moveObject(event, isMoon) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    if (isMoon && isDraggingMoon) {
        const deltaX = clientX - previousMouseXMoon;
        const deltaY = clientY - previousMouseYMoon;

        moon.rotation.y += deltaX * 0.01;
        moon.rotation.x += deltaY * 0.01;

        previousMouseXMoon = clientX;
        previousMouseYMoon = clientY;
    } else if (!isMoon && isDraggingMars) {
        const deltaX = clientX - previousMouseXMars;
        const deltaY = clientY - previousMouseYMars;

        mars.rotation.y += deltaX * 0.01;
        mars.rotation.x += deltaY * 0.01;

        previousMouseXMars = clientX;
        previousMouseYMars = clientY;
    }
}

document.addEventListener('mousedown', (event) => startDrag(event, false));
document.addEventListener('mouseup', () => endDrag(false));
document.addEventListener('mousemove', (event) => moveObject(event, false));
document.addEventListener('touchstart', (event) => startDrag(event, false));
document.addEventListener('touchend', () => endDrag(false));
document.addEventListener('touchmove', (event) => moveObject(event, false));

document.addEventListener('mousedown', (event) => startDrag(event, true));
document.addEventListener('mouseup', () => endDrag(true));
document.addEventListener('mousemove', (event) => moveObject(event, true));
document.addEventListener('touchstart', (event) => startDrag(event, true));
document.addEventListener('touchend', () => endDrag(true));
document.addEventListener('touchmove', (event) => moveObject(event, true));


function animate() {
    requestAnimationFrame(animate);
    rendererMars.render(sceneMars, cameraMars);
    rendererMoon.render(sceneMoon, cameraMoon);
}

animate();
