import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from "lil-gui"
import "./style.css"


const canvas = document.querySelector("canvas.webgl")
let gui = new GUI();
// Scene, Camera, Renderer
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 5)
// camera.lookAt(0, 0, 0)
scene.add(camera)

/**
 * shadow through Texture
 */
let simpleShadow=new THREE.TextureLoader()
.load("/Images/BakedShadows.png")


console.log(simpleShadow)

// Controls
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

let material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0xffffff)
material.wireframe = false;
material.side = THREE.DoubleSide
material.roughness = 0.1;
gui.add(material, "roughness").min(0).max(1).step(0.001)
gui.add(material, "metalness").min(0).max(1).step(0.001)

let plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 20, 20), material)
plane.rotateX(-Math.PI / 2);
plane.position.y = -0.5
plane.receiveShadow = true;
scene.add(plane)

let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), material)
// sphere.position.x=3
sphere.castShadow = true;
scene.add(sphere)

let sphereShadow=new THREE.Mesh(
    new THREE.PlaneGeometry(1.5,1.5),
    new THREE.MeshBasicMaterial(
        {
            color:0xffffff,
            transparent: true,
            alphaMap : simpleShadow
        }
    )
)
sphereShadow.rotation.x=Math.PI*0.5
sphereShadow.position.y=plane.position.y + 0.01
scene.add(sphereShadow)


let Dlight = new THREE.DirectionalLight(0xffffff)
Dlight.intensity = 2
Dlight.position.set(1, 0.5, 0)
Dlight.castShadow = true;
scene.add(Dlight)
gui.add(Dlight, "intensity").min(0).max(4).step(0.001)

Dlight.shadow.mapSize.width = 1024
Dlight.shadow.mapSize.height = 1024
Dlight.shadow.camera.top = 2
Dlight.shadow.camera.right = 2
Dlight.shadow.camera.bottom = -2
Dlight.shadow.camera.left = -2
Dlight.shadow.camera.near = 1
Dlight.shadow.camera.far = 4
Dlight.shadow.radius = 10

let DlightCameraHelper = new THREE.CameraHelper(Dlight.shadow.camera)
DlightCameraHelper.visible = false
scene.add(DlightCameraHelper)

let spotLight = new THREE.SpotLight(0xffffff, 4, 18, Math.PI * 0.3)
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

let SlightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
SlightHelper.visible = false
scene.add(SlightHelper)

let pointLight = new THREE.PointLight(0xffffff, 4)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 6

pointLight.position.set(-1, 2, -2)
scene.add(pointLight)

let pLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pLightHelper.visible = false
scene.add(pLightHelper)

let AxesHelper = new THREE.AxesHelper(5)
// scene.add(AxesHelper)

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//reSize
window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.render(scene, camera)
})

function animate() {

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(() => { animate() })

}
animate()

// import * as THREE from "three"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
// import GUI from "lil-gui"

// let canvas=document.querySelector("canvas.webgl")

// let scene=new THREE.Scene()

// let camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500)
// camera.position.z=4;
// scene.add(camera)

// let renderer=new THREE.WebGLRenderer({canvas})
// renderer.setSize(window.innerWidth,window.innerHeight)

// let controls= new OrbitControls(camera,canvas)
// controls.enableDamping=true;

// let material=new THREE.MeshBasicMaterial()
// material.color=new THREE.co




// //resize

// window.addEventListener("resize",()=>{
//     camera.aspect=window.innerWidth/window.innerHeight
//     camera.updateProjectionMatrix()

//     renderer.setSize(window.innerWidth,window.innerHeight)
//     renderer.setPixelRatio(Math.min(devicePixelRatio,2))
// })

// function animate(){


//     requestAnimationFrame(()=> animate())
//     renderer.render(scene,camera)
// }
// animate()