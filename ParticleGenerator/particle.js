import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

const canvas = document.querySelector("canvas.webgl")

const scene = new THREE.Scene()

/**
 * sizes
 */
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 5, 3)
scene.add(camera)

let renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
console.log(renderer)

/**
 * Texture
 */
let textureLoader = new THREE.TextureLoader()
let particleTexture = textureLoader.load("/textures/particles/2.png")
console.log(particleTexture)

/**
 * Controls
 */
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//cube
let cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
)
scene.add(cube)


/**
 * Particle
 */

//Geometry
let particleGeometry = new THREE.SphereGeometry(0.5, 32, 32)
let count = 5000;

let positions = new Float32Array(count * 3)
let colors = new Float32Array(count * 3)
console.log(colors)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
console.log(positions)
particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
)

particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
)

console.log(particleGeometry.setAttribute)
console.log(particleGeometry.setAttribute)

//Material
let particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.1
particleMaterial.sizeAttenuation = true
// particleMaterial.color = new THREE.Color(0xff00ff)
particleMaterial.transparent = true
particleMaterial.alphaMap = particleTexture
// particleMaterial.alphaTest=0.01
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.vertexColors = true


let particle = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particle)

let gui = new GUI()

let ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)
gui.add(ambientLight, "intensity").min(1.5).max(5).step(0.001)

window.addEventListener("resize", () => {

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

})

let clock = new THREE.Clock()

function animate() {

    let elapsedTime = clock.getElapsedTime()
    console.log(elapsedTime)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particleGeometry.attributes.position.array[i3]
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        // particleGeometry.attributes.position.array[i3 + 1]=Math.cos(elapsedTime+x)  
    }

    particleGeometry.attributes.position.needsUpdate = true
    console.log(particleGeometry.attributes.position.needsUpdate)
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(() => animate())
}
animate()