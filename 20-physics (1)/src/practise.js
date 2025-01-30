import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import dat from "dat-gui";
import * as CANNON from "cannon-es";

const gui = new dat.GUI();

let debugObj = {};

debugObj.createSpheres = () => {
  createSphere(Math.random(), {
    x: Math.random() * 2,
    y: 3,
    z: Math.random() * 2,
  });
};

debugObj.createBoxes = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: Math.random() * 2,
    y: 3,
    z: Math.random() * 2,
  });
};

gui.add(debugObj, "createSpheres");
gui.add(debugObj, "createBoxes");

const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h, 0.1, 1000);
camera.position.set(-3, 3, 5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.w, sizes.h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let textureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = textureLoader.load([
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/nz.png",
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/pz.png",
]);

//******************************************Physics************************************************* */

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.allowSleep = true;
world.broadphase = new CANNON.SAPBroadphase(world);

const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    restitution: 0.5,
    friction: 0.3,
  }
);
world.addContactMaterial(defaultContactMaterial);
// world.defaultContactMaterial = defaultContactMaterial;

let objectsToUpdate = [];

const sphereGeo = new THREE.SphereGeometry(1, 50, 50);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.4,
  roughness: 0.3,
  envMap: environmentMapTexture,
});

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.4,
  roughness: 0.3,
  envMap: environmentMapTexture,
});

let createSphere = (radius, position) => {
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;
  sphere.scale.set(radius, radius, radius);
  sphere.position.copy(position);
  scene.add(sphere);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    shape: shape,
    mass: 1,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);

  objectsToUpdate.push({
    sphere,
    body,
  });
};

let createBox = (width, height, depth, position) => {
  const sphere = new THREE.Mesh(boxGeo, boxMat);
  sphere.castShadow = true;
  sphere.scale.set(width, height, depth);
  sphere.position.copy(position);
  scene.add(sphere);

  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    shape: shape,
    mass: 1,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);

  objectsToUpdate.push({
    sphere,
    body,
  });
};

createSphere(0.5, { x: 0, y: 4, z: 0 });

console.log(objectsToUpdate);
//******************************************************************************************* */

//physics plane
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body();
planeBody.addShape(planeShape);
planeBody.mass = 0;
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(planeBody);

//threejs plane
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3,
  metalness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;
scene.add(plane);

//******************************************************************************************* */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const dLight = new THREE.DirectionalLight(0xffffff, 0.6);
dLight.position.set(5, 5, 5);
dLight.castShadow = true;
dLight.shadow.mapSize.set(1024, 1024);
dLight.shadow.camera.far = 15;
dLight.shadow.camera.left = -7;
dLight.shadow.camera.top = 7;
dLight.shadow.camera.right = 7;
dLight.shadow.camera.bottom = -7;
scene.add(dLight);

let clock = new THREE.Clock();
let oldElapsedTime = 0;

function animate() {
  requestAnimationFrame(animate);

  let elapsedTime = clock.getElapsedTime();
  let deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //update physics world
  world.step(1 / 60, deltaTime, 3);

  for (let object of objectsToUpdate) {
    object.sphere.position.copy(object.body.position);
    object.sphere.quaternion.copy(object.body.quaternion);
  }

  renderer.render(scene, camera);
  controls.update();
}

window.addEventListener("resize", () => {
  sizes.w = window.innerWidth;
  sizes.h = window.innerHeight;

  camera.aspect = sizes.w / sizes.h;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.w, sizes.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
