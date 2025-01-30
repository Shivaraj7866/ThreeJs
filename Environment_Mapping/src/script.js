import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

scene.backgroundIntensity = 1;
scene.backgroundBlurriness = 0;
scene.environmentIntensity = 1;
// scene.backgroundRotation.x = Math.PI * 0.5
// scene.environmentRotation.x = Math.PI * 0.5

// gui.add(scene, "backgroundIntensity").min(0.1).max(10).step(0.001);
// gui.add(scene, "backgroundBlurriness").min(-0.1).max(0.5).step(0.0001);
// gui.add(scene, "environmentIntensity").min(0.1).max(10).step(0.0001);
// gui
//   .add(scene.backgroundRotation, "y")
//   .min(0)
//   .max(Math.PI * 2)
//   .step(0.0001)
//   .name("backgroundRotationY");
// gui
//   .add(scene.environmentRotation, "y")
//   .min(0)
//   .max(Math.PI * 2)
//   .step(0.0001)
//   .name("environmentRotationY");

/**
 * EnvironmentMapping
 */
// let environmentMap = textureLoader.load([
//   "environmentMaps/0/px.png",
//   "environmentMaps/0/nx.png",
//   "environmentMaps/0/py.png",
//   "environmentMaps/0/ny.png",
//   "environmentMaps/0/pz.png",
//   "environmentMaps/0/nz.png",
// ]);

// scene.environment = environmentMap;
// scene.background = environmentMap;

//HDR (RGB) equirectangular environment mapping
let environmentMap = rgbeLoader.load("environmentMaps/0/2k.hdr",
    (environmentMap)=>{
        environmentMap.mapping =THREE.EquirectangularReflectionMapping
        scene.background = environmentMap
        scene.environment = environmentMap
        console.log(environmentMap)
    }
)

/**
 * Models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.mapping = environmentMap;
  scene.add(gltf.scene);
});

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshBasicMaterial()
);
torusKnot.material.envMap = environmentMap;
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Resize
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
