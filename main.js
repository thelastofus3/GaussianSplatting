import { LumaSplatsThree } from '@lumaai/luma-web';
import {initializeMouseControl, updateCameraPositionWithCollision} from "./controls.js";
import {camera, renderer, scene} from "./sceneSetup.js";
import * as THREE from 'three';


const rotation = { targetX: 0, targetY: 0 };
initializeMouseControl(rotation);

const splat = new LumaSplatsThree({
    source: "https://lumalabs.ai/capture/6f490703-e4cf-4d41-af75-33f1f162da21"
});
scene.add(splat);

// Размеры невидимой стены
const wallWidth = 20;
const wallHeight = 20;
const wallDepth = 0.5;

function createInvisibleWall(x, y, z) {
    const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
    const wallMaterial = new THREE.MeshBasicMaterial({
        visible: false
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y, z);
    scene.add(wall);
    return wall;
}

const wall1 = createInvisibleWall(1, 3, 3);
wall1.rotation.y = Math.PI / 5.8;
const wall2 = createInvisibleWall(1, -3.5, -3.5);
wall2.rotation.y = Math.PI / 5;
const wall3 = createInvisibleWall(1, 6.5, 6.5);
wall3.rotation.y = -Math.PI / 4;
const wall4 = createInvisibleWall(1, -3, -3);
wall4.rotation.y = -Math.PI / 3.5;

function animate() {
    updateCameraPositionWithCollision();
    camera.rotation.y = rotation.targetY;
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();