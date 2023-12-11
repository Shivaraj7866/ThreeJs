import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'
import GUI from 'lil-gui'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'

let gui=new GUI()

const canvas=document.querySelector('canvas.webgl')

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z=3;

let controls=new OrbitControls(camera,canvas)
controls.enableDamping=true;

////////////////////////////////////////////////////

//Textures
    // let texture=new THREE.TextureLoader()

    // let beachTexture=texture.load('./Images/beach.webp')
    // let butterflyTexture=texture.load('./Images/butterfly.webp')
    // let deerTexture=texture.load('./Images/deer.webp')
    // let flowersTexture=texture.load('./Images/flowers.webp')

    // beachTexture.colorSpace=THREE.SRGBColorSpace

//MeshBasicMaterial
    // let material=new THREE.MeshBasicMaterial({map: beachTexture})
    // let material=new THREE.MeshBasicMaterial({})
    // material.map=beachTexture
    // material.wireframe=true;
    // material.color=new THREE.Color('#ab1200')
    // material.transparent=true;
    // material.opacity=0.3
    // material.side=THREE.DoubleSide

//MeshNormalMatrial
    // let material=new THREE.MeshNormalMaterial({})
    // material.flatShading=true;
    
//MeshMatMatrial
    // let material=new THREE.MeshMatcapMaterial({})
    // material.flatShading=true;
    // material.matcap=beachTexture

//MeshStandardMaterial
    let material=new THREE.MeshStandardMaterial()
    material.roughness=0.2;
    // material.toughness=0.7;

gui.add(material,'roughness').min(0).max(1).step(0.0001)
gui.add(material,'metalness').min(0).max(1).step(0.0001)
console.log(material);
gui.add(scene,'backgroundIntensity').min(0).max(10).step(0.0001)

//Lights
    const ambientLight=new THREE.AmbientLight(0xfffffff,1)
    scene.add(ambientLight)

    const spottLight=new THREE.SpotLight(0xffffff,1)
    spottLight.position.x=2
    spottLight.position.y=3
    spottLight.position.z=4
    scene.add(spottLight)

//environment map
    const rgbeLoader=new RGBELoader()
    rgbeLoader.load('./Images/hochsal_field_4k.hdr',(environmentMap)=>{
        
        environmentMap.mapping=THREE.EquirectangularReflectionMapping
console.log("first")
        scene.background=environmentMap
        scene.environment=environmentMap
    })


let sphere=new THREE.Mesh(
    new THREE.SphereGeometry(0.5,12,12),
    material
)
sphere.position.x=-1.5

let plane=new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    material
)

let torus=new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,16,32),
    material
)
torus.position.x=1.5


scene.add(sphere,plane,torus)

////////////////////////////////////////////////////////
const renderer=new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(new THREE.Color(0x000000))
window.addEventListener('resize',()=>{

    camera.aspect=window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})
renderer.render(scene,camera)

let clock=new THREE.Clock()

function animate(){

    let elapsTime=clock.getElapsedTime()
//update Objects
    sphere.rotation.y=0.1 * elapsTime
    plane.rotation.y=0.1 * elapsTime
    torus.rotation.y=0.1 * elapsTime

    sphere.rotation.x=-0.15 * elapsTime
    plane.rotation.x=-0.15 * elapsTime
    torus.rotation.x=-0.15 * elapsTime

//update Controls
    controls.update()
    renderer.render(scene,camera)

    window.requestAnimationFrame(()=>animate())
}
console.log("Working");
animate()