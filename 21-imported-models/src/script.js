// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import GUI from 'lil-gui'

// /**
//  * Base
//  */
// // Debug
// const gui = new GUI()

// // Canvas
// const canvas = document.querySelector('canvas.webgl')

// // Scene
// const scene = new THREE.Scene()

// /**
//  * Floor
//  */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

// /**
//  * Lights
//  */
// const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(2, 2, 2)
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()
// let previousTime = 0

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime

//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
import GUI from "lil-gui"


/**
 * Debug
 */
const gui=new GUI()

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl")

//scene
const scene = new THREE.Scene()

//sizes
const sizes = {
    x: window.innerWidth,
    y: window.innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.x / sizes.y, 0.1, 1000)
camera.position.set(2, 2, 2)
scene.add(camera)

/**
 * floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0,
        roughness: 0.5
    })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

//GLTFLoader
const gltfLoader=new GLTFLoader()
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',
(gltf)=>{
    const ducks=[...gltf.scene.children]
    console.log(ducks)
    for(const duck of ducks) scene.add(duck)
}
)


//renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.x, sizes.y)

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const dLight = new THREE.DirectionalLight(0xffffff, 1.5)
dLight.position.set(5, 5, 5)
dLight.castShadow = true;
dLight.shadow.mapSize.set(1024, 1024)
dLight.shadow.camera.far = 15
dLight.shadow.camera.left = -7
dLight.shadow.camera.right = 7
dLight.shadow.camera.top = 7
dLight.shadow.camera.bottom = -7
scene.add(dLight)

//resize
window.addEventListener("resize", () => {

    //update sizes
    sizes.x = window.innerWidth
    sizes.y = window.innerHeight

    //aspectRatio
    camera.aspect = sizes.x / sizes.y
    camera.updateProjectionMatrix()

    //renderer
    renderer.setSize(sizes.x, sizes.y)
    renderer.render(scene, camera)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//controls
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

let clock = new THREE.Clock()
let previousTime = 0;

function animate() {

    let elapsedTime = clock.getElapsedTime()
    let deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //update controls
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}
animate()