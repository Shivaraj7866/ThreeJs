import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { global } from "three/examples/jsm/nodes/Nodes.js";

console.log(global)
const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};

let gui = new GUI();

let gltfLoader = new GLTFLoader();
let rgbeLoader = new RGBELoader();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
// scene.environmentIntensity = 1;

// gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);

const updateAllMaterials = ()=>{
  scene.traverse((child) => {

    if (child.isMesh && child.material.isMeshStandardMaterial) {
  
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/**
 * Environment map
 */
//Global intensity
global.envMapIntensity = 1.551
gui.add(global,"envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterials)

const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h, 0.1, 1000);
camera.position.set(4, 5, 10);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.w, sizes.h);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//ToneMapping : HDR to LDR
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

//HDR envMapping
rgbeLoader.load("/environmentMaps/0/2k.hdr", (rgbe) => {
  rgbe.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = rgbe;
  scene.environment = rgbe;
});

//Models
gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  let model = gltf.scene;
  model.position.y = -1;
  model.scale.set(10,10,10);
  scene.add(model);

  updateAllMaterials()
});

const dLight = new THREE.DirectionalLight(0xffffff, 5);
dLight.position.set(-4, 6.5, 2.4);
dLight.shadow.camera.far = 15;
dLight.shadow.mapSize.set(512, 512); // increases the shadow resolution(detailed shadow) but lower performance
scene.add(dLight);

dLight.castShadow = true;

gui.add(dLight, "intensity").min(0).max(10).step(0.001).name("L_intensity");
gui.add(dLight.position, "x").min(-4).max(10).step(0.001).name("L_xPos");
gui.add(dLight.position, "y").min(0).max(10).step(0.001).name("L_yPos");
gui.add(dLight.position, "z").min(-4).max(10).step(0.001).name("L_zPos");
gui.add(dLight, "castShadow");

// let dLightHelper = new THREE.CameraHelper(dLight.shadow.camera);
// scene.add(dLightHelper);

//target
dLight.target.position.set(0, 3, 0);
dLight.target.updateWorldMatrix();

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

window.addEventListener("resize", () => {
  sizes.w = window.innerWidth;
  sizes.h = window.innerHeight;

  camera.aspect = sizes.w / sizes.h;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.w, sizes.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
