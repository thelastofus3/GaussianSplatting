import {scene, camera, renderer} from "./sceneSetup.js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import {initializeAgora} from "./videoSetup.js";

// const loader = new GLTFLoader();
// let monitor1, monitor2;
//
// loader.load(
//     'assets/tv_gs.gltf',
//     (gltf) => {
//         monitor1 = gltf.scene;
//         scene.add(monitor1);
//
//         monitor1.scale.set(0.8, 0.8, 0.8);
//         monitor1.position.set(2.5, -1.3, -0.75);
//         monitor1.rotation.y = -Math.PI / 3.4;
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% загружено');
//     },
//     (error) => {
//         console.error('Ошибка загрузки модели', error);
//     }
// );
//
// loader.load(
//     'assets/tv_gs.gltf',
//     (gltf) => {
//         monitor2 = gltf.scene;
//         scene.add(monitor2);
//
//         monitor2.scale.set(0.8, 0.8, 0.8);
//         monitor2.position.set(-0.6, -1.3, 1.8);
//         monitor2.rotation.y = -Math.PI / 3.4;
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% загружено');
//     },
//     (error) => {
//         console.error('Ошибка загрузки модели', error);
//     }
// );
//
// export const keys = {};
// const moveSpeed = 0.05;
//
// export const handleMouseMove = (event, rotation) => {
//     const lookSpeed = 0.005;
//     rotation.targetY -= event.movementX * lookSpeed;
//     rotation.targetX -= event.movementY * lookSpeed;
//     rotation.targetX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.targetX));
// };
//
// export const initializeMouseControl = (rotation) => {
//     document.addEventListener("mousemove", (event) =>
//         handleMouseMove(event, rotation)
//     );
// };
//
// const raycaster = new THREE.Raycaster();
// const direction = new THREE.Vector3();
//
// function checkCollisions() {
//     camera.getWorldDirection(direction);
//
//     raycaster.ray.origin.copy(camera.position);
//     raycaster.ray.direction.copy(direction);
//
//     const intersects = raycaster.intersectObjects(scene.children, true);
//
//     if (intersects.length > 0) {
//         const distanceToCollision = intersects[0].distance;
//         if (distanceToCollision < moveSpeed) {
//             return true;
//         }
//     }
//     return false;
// }
//
// export const updateCameraPositionWithCollision = () => {
//     if (!checkCollisions()) {
//         if (keys['w']) {
//             camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
//             camera.position.z -= Math.cos(camera.rotation.y) * moveSpeed;
//         }
//         if (keys['s']) {
//             camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
//             camera.position.z += Math.cos(camera.rotation.y) * moveSpeed;
//         }
//         if (keys['a']) {
//             camera.position.x -= Math.cos(camera.rotation.y) * moveSpeed;
//             camera.position.z += Math.sin(camera.rotation.y) * moveSpeed;
//         }
//         if (keys['d']) {
//             camera.position.x += Math.cos(camera.rotation.y) * moveSpeed;
//             camera.position.z -= Math.sin(camera.rotation.y) * moveSpeed;
//         }
//     }
// };
//
// document.addEventListener("keydown", (event) => {
//     console.log('Key down:', event.key);
//     keys[event.key] = true;
// });
// document.addEventListener("keyup", (event) => {
//     console.log('Key up', event.key);
//     keys[event.key] = false;
// });
//
// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
//
// let localTrack;
//
// // async function startAgora() {
// //     const videoElement = await initializeAgora(
// //         "a7802749b2504f27bcbfdae2448638ee",
// //         "main",
// //         sessionStorage.getItem("uid") || String(Math.floor(Math.random() * 10000))
// //     );
// //
// //
// //
// //     localTrack = await AgoraRTC.createCameraVideoTrack();
// //     localTrack.play("video-container");
// //
// //     client.on("user-published", (user, mediaType) => {
// //         client.subscribe(user, mediaType);
// //     });
// //
// //     client.on("user-joined", (user) => {
// //         console.log("User joined: ", user);
// //     });
// //
// //     client.on("user-published", async (user, mediaType) => {
// //         if (mediaType === "video") {
// //             await client.subscribe(user, mediaType);
// //             const remoteVideoTrack = user.videoTrack;
// //             remoteVideoTrack.play("remote-video-container");
// //         }
// //     });
// //     updateMonitorTexture(videoElement);
// //
// // }
// let rtc = {
//     localAudioTrack: null,
//     localVideoTrack: null,
//     client: null,
// };
// let options = {
//     appId: "a7802749b2504f27bcbfdae2448638ee", // Your app ID
//     channel: "main",      // Channel name
//     token: null, // Temp token
//     uid: sessionStorage.getItem("uid") || String(Math.floor(Math.random() * 10000)),          // User ID
// };
// // Initialize the AgoraRTC client
// function initializeClient() {
//     rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     setupEventListeners();
// }
// // Handle remote user events
// function setupEventListeners() {
//     rtc.client.on("user-published", async (user, mediaType) => {
//         await rtc.client.subscribe(user, mediaType);
//         console.log("subscribe success");
//         if (mediaType === "video") {
//             displayRemoteVideo(user);
//         }
//         if (mediaType === "audio") {
//             user.audioTrack.play();
//         }
//     });
//     rtc.client.on("user-unpublished", (user) => {
//         const remotePlayerContainer = document.getElementById(user.uid);
//         remotePlayerContainer && remotePlayerContainer.remove();
//     });
// }
// // Display remote video
// function displayRemoteVideo(user) {
//     const remoteVideoTrack = user.videoTrack;
//     const remoteVideoElement = document.createElement("video");
//     remoteVideoTrack.play(remoteVideoElement);
//     updateMonitorTexture(remoteVideoElement, monitor2);
// }
// // Join a channel and publish local media
// async function joinChannel() {
//     await rtc.client.join(options.appId, options.channel, options.token, options.uid);
//     await createAndPublishLocalTracks();
//     displayLocalVideo();
//     console.log("Publish success!");
// }
// // Publish local audio and video tracks
// async function createAndPublishLocalTracks() {
//     rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//     rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
//     await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
// }
// // Display local video
// function displayLocalVideo() {
//     const localVideoElement = document.createElement("video");
//     rtc.localVideoTrack.play(localVideoElement);
//
//     // Обновляем текстуру на первом мониторе
//     updateMonitorTexture(localVideoElement, monitor1);
// }
// // Leave the channel and clean up
// // Set up button click handlers
// function setupButtonHandlers() {
//     document.getElementById("video-agora").onclick = joinChannel;
// }
// // Start the basic call
// function startBasicCall() {
//     initializeClient();
//     window.onload = setupButtonHandlers;
//     console.log("call start")
// }
//
// function animate() {
//     updateCameraPositionWithCollision();
//     camera.rotation.y = rotation.targetY;
//     renderer.render(scene, camera);
//
//     requestAnimationFrame(animate);
// }
//
//
// document.getElementById("video-agora").addEventListener("click", () => {
//     startBasicCall();
//     document.getElementById("phone-container").style.display = "none";
// });
//
// document.getElementById("video-regular").addEventListener("click", () => {
//
//     const videoElement = document.createElement('video');
//     videoElement.src = 'assets/defaultVideo.mp4';
//     videoElement.loop = true;
//     videoElement.play();
//
//     updateMonitorTexture(videoElement, monitor1);
//     document.getElementById("phone-container").style.display = "none";
// });
//
// document.getElementById("upload-video-btn").addEventListener("click", () => {
//     document.getElementById("video-upload").click(); // Триггерим загрузку видео
// });
//
// document.getElementById("video-upload").addEventListener("change", (event) => {
//     const file = event.target.files[0];
//     if (file) {
//         const videoElement = document.createElement("video");
//         videoElement.src = URL.createObjectURL(file);
//         videoElement.load();
//         videoElement.play();
//         updateMonitorTexture(videoElement, monitor1);
//     }
//     document.getElementById("phone-container").style.display = "none";
// });
//
// function updateMonitorTexture(videoElement, monitor) {
//     const videoTexture = new THREE.VideoTexture(videoElement);
//     videoTexture.flipY = false;
//
//     monitor.traverse((node) => {
//         if (node.isMesh && node.material.name === 'ScreenOn') {
//             node.material = new THREE.MeshBasicMaterial({ map: videoTexture });
//             node.material.needsUpdate = true;
//         }
//     });
// }
// animate();
//
