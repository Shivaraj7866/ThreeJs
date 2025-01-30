import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector("canvas.webgl")
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// // Cube
// const geometry = new THREE.BoxGeometry(); // Cube geometry
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);



const geometry = new THREE.BufferGeometry()
console.log(geometry)

const vertices = new Float32Array([
    -1, -1, 1,//v1
    1, -0.5, 1.5,//v2
    1, 1, 1,//v3
    -1, 1, 1,//v5
])

const normals = new Float32Array([
    1, 1, 1,//v1
    1, 1, 1,//v2
    1, 1, 1,//v3
    1, 1, 1,//v5
])

const colors = new Float32Array([
    -0.1, -0.9, 1,//v1
    1, -0.1, 1,//v2
    0.1, 1, 1,//v3

    1, 0.1, 0.1,//v4
    -0.1, 1, 0.1,//v5
    -1, -0.1, 0.1//v6
])

const indices = [
    0, 1, 2
    , 2, 3, 0
]

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
geometry.setAttribute('normals', new THREE.BufferAttribute(normals, 3))
geometry.setIndex(indices)

const material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: false })
const Mesh = new THREE.Mesh(geometry, material)
scene.add(Mesh)

//-----------------------------------------------------------------------------


// Create geometry
const geometry1 = new THREE.SphereGeometry(0.2, 64, 64);
const material1 = new THREE.MeshBasicMaterial();

// Create InstancedMesh with 100 instances
const numInstances = 100;
const instancedMesh = new THREE.InstancedMesh(geometry1, material1, numInstances);

// Set position and rotation for each instance
const matrix = new THREE.Matrix4();
console.log(matrix)
for (let i = 0; i < numInstances; i++) {
    matrix.setPosition(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    instancedMesh.setMatrixAt(i, matrix);
    instancedMesh.setColorAt(
        i, 
        new THREE.Color(Math.random() * 10 - 5, 
        Math.random() * 10 - 5, 
        Math.random() * 10 - 5))
}

// Add InstancedMesh to scene
scene.add(instancedMesh);

//-----------------------------------------------------------------------------

let controls = new OrbitControls(camera, renderer.domElement)
scene.add(controls)

// const ALight=new THREE.AmbientLight(0xffffff,1)
// scene.add(ALight)
// const PLight=new THREE.PointLight(0xffffff,1)
// PLight.position.set(-1,2,2)
// scene.add(PLight)

// Animation loop
function animate() {

    // controls.update()

    // Render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
