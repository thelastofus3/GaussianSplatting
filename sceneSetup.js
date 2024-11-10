import * as THREE from 'three';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0.4, 0);

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Рендерер
let canvas = document.querySelector('canvas');

export const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
