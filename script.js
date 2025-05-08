import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 13;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1.3));
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

let bee, mixer;
const positions = [
  {id: 'banner', pos: {x:0, y:-1, z:0}, rot: {x:0, y:1.5, z:0}},
  {id: 'intro', pos: {x:1, y:-1, z:-5}, rot: {x:0.5, y:-0.5, z:0}},
  {id: 'description', pos: {x:-1, y:-1, z:-5}, rot: {x:0, y:0.5, z:0}},
  {id: 'inscription', pos: {x:0.8, y:-1, z:0}, rot: {x:0.3, y:-0.5, z:0}}
];

new GLTFLoader().load('/bouncing_soccer_ball.glb', gltf => {
  bee = gltf.scene;
  bee.scale.set(10, 10, 10);
  scene.add(bee);
  mixer = new THREE.AnimationMixer(bee);
  mixer.clipAction(gltf.animations[0]).play();
  moveModel();
});

function moveModel() {
  const current = Array.from(document.querySelectorAll('.section'))
    .filter(s => s.getBoundingClientRect().top <= window.innerHeight / 3).pop();
  const p = positions.find(val => val.id === (current && current.id));
  if (p && bee) {
    gsap.to(bee.position, {...p.pos, duration: 3, ease: 'power1.out'});
    gsap.to(bee.rotation, {...p.rot, duration: 3, ease: 'power1.out'});
  }
}

window.addEventListener('scroll', () => bee && moveModel());
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
})();