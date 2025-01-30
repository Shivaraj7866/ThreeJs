import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat-gui";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new dat.GUI();
let deBugObjects = {};

deBugObjects.createSphere = () => {
    createSphears(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    },
    new THREE.Color().setRGB(Math.random(),Math.random(),Math.random())
);
};

deBugObjects.createBox = () => {
    createBoxes(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5, 
        {
        x: (Math.random() - 0.5) * 2,
        y: 3,
        z: (Math.random() - 0.5) * 2,
    },
new THREE.Color().setRGB(Math.random(),Math.random(),Math.random()));
};

deBugObjects.reset = ()=>{
    for(const object of objectToUpdate){
        //Remove body
        object.body.removeEventListener("collide",playSound)
        world.removeBody(object.body)

        //Remove mesh
        scene.remove(object.mesh)
    }
}

gui.add(deBugObjects, "createSphere");
gui.add(deBugObjects, "createBox");
gui.add(deBugObjects, "reset");

/**
 * sounds
 */
const hitSound = new Audio("/sounds/hit.mp3")

const playSound =(collision)=>{

    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5){

        hitSound.currentTime = 0;
        hitSound.volume = Math.random()
        hitSound.play()
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.png",
    "/textures/environmentMaps/0/nx.png",
    "/textures/environmentMaps/0/py.png",
    "/textures/environmentMaps/0/ny.png",
    "/textures/environmentMaps/0/pz.png",
    "/textures/environmentMaps/0/nz.png",
]);

/**
 * physics
 */
//world
const world = new CANNON.World();
//This uses the Sweep and Prune (SAP) broadphase, which is generally more efficient for environments with many static bodies or where all bodies are roughly aligned along a common axis. It helps optimize collision detection.
world.broadphase = new CANNON.SAPBroadphase(world) 

//When allowSleep is set to true, bodies that are not moving or experiencing any forces after some time are allowed to "sleep." This helps improve performance by excluding inactive bodies from calculations until they are disturbed again.Sleeping bodies do not consume CPU resources
world.allowSleep = true;

world.gravity.set(0, -9.82, 0);

//contactMaterial
let defaultMaterial = new CANNON.Material("default");
let defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        restitution: 0.5,
        friction: 0.3,
    }
);
// world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial;

/**
 * Utils
 */
let objectToUpdate = [];

let sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
let sphereMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.4,
    envMap: environmentMapTexture,
});

let boxGeoMetry = new THREE.BoxGeometry(1, 1, 1);
let boxMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.4,
    envMap: environmentMapTexture,
});

let createSphears = (radius, position,color) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.castShadow = true
    mesh.position.copy(position);
    mesh.scale.set(radius, radius, radius);
    mesh.material.color = color
    scene.add(mesh);

    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        shape,
        material: defaultMaterial,
    });
    body.position.copy(position);
    body.addEventListener("collide", playSound)
    world.addBody(body);

    objectToUpdate.push({ mesh, body });
};

let createBoxes = (w,h,d, boxPos,color) => {
    const mesh = new THREE.Mesh(boxGeoMetry, boxMaterial);
    mesh.castShadow = true
    mesh.position.copy(boxPos);
    mesh.scale.set(w, h, d);
    mesh.material.color = color
    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(w * 0.5, h * 0.5, d * 0.5));
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        material: defaultMaterial,
    });
    body.position.copy(boxPos);
    body.addEventListener("collide", playSound)
    world.addBody(body);

    objectToUpdate.push({
        mesh,
        body,
    });
};

createSphears(0.5,{x:1,y:3,z:0})

console.log(objectToUpdate);
//plane
let planeShape = new CANNON.Plane();
let planeBody = new CANNON.Body();
// planeBody.material = defaultMaterial
planeBody.addShape(planeShape);
planeBody.mass = 0;
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(planeBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(-3, 3, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    let deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    //update physics world
    for (let object of objectToUpdate) {
            object.mesh.position.copy(object.body.position);
            object.mesh.quaternion.copy(object.body.quaternion);
    }

    world.step(1 / 60, deltaTime, 3);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
