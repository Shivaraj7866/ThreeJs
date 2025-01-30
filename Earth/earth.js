import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import getStars from "./earth_02/stars";


// Set up scene
const scene = new THREE.Scene();

let s = {
    w: window.innerWidth,
    h: window.innerHeight
}
// Set up camera
const camera = new THREE.PerspectiveCamera(75, s.w / s.h, 0.1, 1000);
camera.position.z = 5;

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(s.w, s.h);
document.body.appendChild(renderer.domElement);

//OrbitControls
new OrbitControls(camera, renderer.domElement)

const earthGroup = new THREE.Group()
scene.add(earthGroup)

export let loader = new THREE.TextureLoader()

// Create cube geometry and material
const geometry = new THREE.IcosahedronGeometry(1, 12);

const material = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    // flatShading:true ,
    map: loader.load("textures/earthmap1k.jpg"),
    // blending: THREE.AdditiveBlending
});
material.depthWrite = false;
const earthMesh = new THREE.Mesh(geometry, material);
// earthGroup.add(earthMesh);

const lightMat = new THREE.MeshStandardMaterial({
    // color:0xffffff,
    map: loader.load("textures/earthlights1k.jpg"),
    // blending: THREE.AdditiveBlending
})
const lightMesh = new THREE.Mesh(geometry, lightMat)

earthGroup.add(lightMesh);

lightMesh.renderOrder = 25
earthGroup.renderOrder = 25


let Stars = getStars(2000);
Stars.renderOrder = 10;
console.log(Stars.renderOrder, earthGroup.renderOrder)
scene.add(Stars)

//hemilight
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
sunLight.position.set(-2, 0.5, 1.5)
scene.add(sunLight)

window.addEventListener("resize", () => {

    s.w = window.innerWidth
    s.h = window.innerHeight

    camera.aspect = s.w / s.h
    camera.updateProjectionMatrix();

    renderer.setSize(s.w, s.h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // earthMesh.rotation.y += 0.002;
    // lightMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

console.log("hello")