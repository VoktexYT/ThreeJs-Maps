import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Map from './map';


// Create a scene
const scene = new THREE.Scene();

const light = new THREE.PointLight(0xffffff, 2, 9);
light.position.set(0, 3, 0);

const ambiantLight = new THREE.AmbientLight(0x999900, 0.01);

const fog = new THREE.Fog(0x220000, 1, 20)

scene.fog = fog;
scene.add(ambiantLight);
scene.add(light);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 4;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const map = new Map(scene, camera);

let mouseIsDown: boolean = false;
let lastMouseX = 0;
let lastMouseY = 0;
const velocity = 0.01;

window.addEventListener('mousedown', (mouseEvent) => {
	mouseIsDown = true;
	lastMouseX = mouseEvent.clientX;
	lastMouseY = mouseEvent.clientY;
});

window.addEventListener('mousemove', (mouseEvent) => {
	if (mouseIsDown)
	{	
		let diffX = mouseEvent.clientX - lastMouseX;
		let diffY = mouseEvent.clientY - lastMouseY;
		camera.position.x -= diffX * velocity;
		camera.position.z -= diffY * velocity;
		lastMouseX = mouseEvent.clientX;
		lastMouseY = mouseEvent.clientY;
	}
});

window.addEventListener('mouseup', () => {
	mouseIsDown = false;
});

// Animation loop
function animate() {
	requestAnimationFrame(animate);

	light.position.x = camera.position.x;
	light.position.z = camera.position.z - 2;

	map.update();

	renderer.render(scene, camera);
}

animate();
