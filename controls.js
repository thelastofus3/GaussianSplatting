import { scene, camera } from "./sceneSetup.js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {initializeAgora} from "./videoSetup.js";

const loader = new GLTFLoader();
let monitor;

loader.load(
    'assets/tv_gs.gltf',
    (gltf) => {
        monitor = gltf.scene;
        scene.add(monitor);

        monitor.scale.set(0.8, 0.8, 0.8);
        monitor.position.set(2.5, -1.3, -0.75);
        monitor.rotation.y = -Math.PI / 3.4;
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% загружено');
    },
    (error) => {
        console.error('Ошибка загрузки модели', error);
    }
);

export const keys = {};
const moveSpeed = 0.05;

export const handleMouseMove = (event, rotation) => {
    const lookSpeed = 0.005;
    rotation.targetY -= event.movementX * lookSpeed;
    rotation.targetX -= event.movementY * lookSpeed;
    rotation.targetX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.targetX));
};

export const initializeMouseControl = (rotation) => {
    document.addEventListener("mousemove", (event) =>
        handleMouseMove(event, rotation)
    );
};

const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3();

function checkCollisions() {
    camera.getWorldDirection(direction);

    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.copy(direction);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const distanceToCollision = intersects[0].distance;
        if (distanceToCollision < moveSpeed) {
            return true;
        }
    }
    return false;
}

export const updateCameraPositionWithCollision = () => {
    if (!checkCollisions()) {
        if (keys['w']) {
            camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
            camera.position.z -= Math.cos(camera.rotation.y) * moveSpeed;
        }
        if (keys['s']) {
            camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
            camera.position.z += Math.cos(camera.rotation.y) * moveSpeed;
        }
        if (keys['a']) {
            camera.position.x -= Math.cos(camera.rotation.y) * moveSpeed;
            camera.position.z += Math.sin(camera.rotation.y) * moveSpeed;
        }
        if (keys['d']) {
            camera.position.x += Math.cos(camera.rotation.y) * moveSpeed;
            camera.position.z -= Math.sin(camera.rotation.y) * moveSpeed;
        }
    }
};

document.addEventListener("keydown", (event) => {
    console.log('Key down:', event.key);
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    console.log('Key up', event.key);
    keys[event.key] = false;
});

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });

let localTrack;

async function startAgora() {
    const videoElement = await initializeAgora(
        CONFIG.AGORA_API_KEY,
        "main",
        sessionStorage.getItem("uid") || String(Math.floor(Math.random() * 10000))
    );



    localTrack = await AgoraRTC.createCameraVideoTrack();
    localTrack.play("video-container"); // Привяжите к HTML элементу, где будет видео

    client.on("user-published", (user, mediaType) => {
        client.subscribe(user, mediaType);
    });

    client.on("user-joined", (user) => {
        console.log("User joined: ", user);
    });

    client.on("user-published", async (user, mediaType) => {
        if (mediaType === "video") {
            await client.subscribe(user, mediaType);
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.play("remote-video-container");
        }
    });
    updateMonitorTexture(videoElement);

}

document.getElementById("video-agora").addEventListener("click", () => {
    startAgora();
});

document.getElementById("video-regular").addEventListener("click", () => {

    const videoElement = document.createElement('video');
    videoElement.src = 'assets/defaultVideo.mp4';
    videoElement.loop = true;
    videoElement.play();

    updateMonitorTexture(videoElement);
    document.getElementById("phone-container").style.display = "none";
});

document.getElementById("upload-video-btn").addEventListener("click", () => {
    document.getElementById("video-upload").click(); // Триггерим загрузку видео
});

document.getElementById("video-upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.load();
        videoElement.play();
        updateMonitorTexture(videoElement);
    }
});

function updateMonitorTexture(videoElement) {
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.flipY = false;

    monitor.traverse((node) => {
        if (node.isMesh && node.material.name === 'ScreenOn') {
            node.material = new THREE.MeshBasicMaterial({ map: videoTexture });
            node.material.needsUpdate = true;
        }
    });
}
