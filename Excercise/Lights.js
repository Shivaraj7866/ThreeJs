import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from "lil-gui"
import "./style.css"

const canvas = document.querySelector("canvas.webgl")
let size = window.innerWidth / innerHeight
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, size, 0.1, 1000)
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

let gui = new GUI()
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

//----------------//----------------------//

let material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide,});
material.roughness=0.4
material.metalness=0.2

gui.add(material, 'metalness').min(0.2).max(1).step(0.0001)
gui.add(material, "roughness").min(0.4).max(1).step(0.001)
console.log(gui)

let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 15), material)
sphere.position.x = -1.5

let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)

let torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 20, 40, Math.PI * 2),material)
torus.position.x = 1.5

let plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6, 20, 20),material)
plane.rotation.x = Math.PI * 0.5
plane.position.y = -0.95

scene.add(sphere, box, torus, plane)

let ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

let directionalLight=new THREE.DirectionalLight(0x000fff,1)
directionalLight.position.set(1, 0.25, 0)
// scene.add(directionalLight)

let hemiSphereLight=new THREE.HemisphereLight(0xff0000,0x0000ff,1.2)
// scene.add(hemiSphereLight)

let pointLight=new THREE.PointLight(0x00ff00,2.5)
pointLight.position.set(1,1,0)
// scene.add(pointLight)

let rectAreaLight=new THREE.RectAreaLight(0x5f9f6f,2,1,1)
rectAreaLight.position.set(1.5,0,-1.5)
// scene.add(rectAreaLight)

let spottLight=new THREE.SpotLight(0xff00ff,2)
let axesHelper=new THREE.AxesHelper(spottLight)
// scene.add(spottLight,axesHelper)

//-------------/----------------//////
window.addEventListener("resize", () => {
    camera.aspect = size
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
})

let clock = new THREE.Clock()
function animate() {

    let elapsTime = clock.getElapsedTime()

    sphere.rotation.set(0.1*elapsTime,-0.15*elapsTime,0)
    box.rotation.set(0.1*elapsTime,-0.15*elapsTime,0)
    torus.rotation.set(0.1*elapsTime,-0.15*elapsTime,0)

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(() => animate())
}
animate()