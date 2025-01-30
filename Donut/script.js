import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
import {gsap} from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// console.log(GLTFLoader)
gsap.registerPlugin(ScrollTrigger)

/**
 * Base
 */
const canvas=document.querySelector("canvas.webgl")

/**
 * Scene
 */
let scene=new THREE.Scene()

/**
 * Sizes
 */
let sizes={
    width:window.innerWidth,
    height:window.innerHeight
}

/**
 * Camera
 */
let camera=new THREE.PerspectiveCamera(55,sizes.width/sizes.height,0.1,1000)
camera.position.set(0,0,5)
scene.add(camera)

let plane=new THREE.Mesh(
    new THREE.CircleGeometry(2, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

plane.position.set(3.5,-0.5,-0.5)
plane.rotation.set(0,0,0)
scene.add(plane)

let donut=null;
let gltfLoader=new GLTFLoader()
gltfLoader.load(
    "./assets/donut/scene.gltf",(gltf)=>{
        donut=gltf.scene
        console.log(donut)
        donut.name="Donut"
        let radius=8
        donut.scale.set(radius,radius,radius)
        donut.position.x=2.8
        donut.rotation.x=Math.PI*0.2
        donut.rotation.z=Math.PI*0.18
        donut.renderOrder=10
        scene.add(donut)

    }
)

/**
 * Scroll
 */

const transformDonut=[
    {
        rotationZ:0.45,
        positionX:2.8,
    },
    {
        rotationZ:-0.45,
        positionX:-2.8,
    },
    {
        rotationZ:0.0314,
        positionX:0,
    },
]

const transformPlane=[
    {
        pRotation:0,
        pxPosition:3.5
    },
    {
        pRotation:-Math.PI*0.5/2,
        pxPosition:-3.5
    },
    {
        pRotation:-Math.PI*0.4,
        pxPosition:0
    }
]

let scrollY=window.scrollY;
let currentSection=0;
window.addEventListener("scroll",(e)=>{

    scrollY=window.scrollY
    let newSection=Math.round(scrollY/sizes.height)
    console.log(newSection)

    if(newSection != currentSection){
        currentSection = newSection

        if(!!donut){

            gsap.to(donut.rotation,{
                duration:1,
                scrub:true,
                ease:"power2.inOut",
                // x:"+=1",
                // y:"+=1",
                z:transformDonut[currentSection].rotationZ
            })

            gsap.to(donut.position,{
                duration:1,
                ease:"power2.inOut",
                x:transformDonut[currentSection].positionX,
                
            })

            gsap.to(plane.position,{
                duration:1,
                ease:"power2.inOut",
                x:transformPlane[currentSection].pxPosition,
                 
                
            })

            gsap.to(plane.rotation,{
                duration:1,
                ease:"power2.inOut",
                x:transformPlane[currentSection].pRotation,
                
                
            })
        }
    }

})

const ambientLight=new THREE.AmbientLight(0xffffff,2)
scene.add(ambientLight)

let DLight=new THREE.DirectionalLight(0xffffff,2)
DLight.position.set(1,2,0)
scene.add(DLight)

/**
 * renderer
 */
let renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.render(scene,camera)

let clock=new THREE.Clock()
let lastElapsedTime=0
function animate(){

    let elapsedTime=clock.getElapsedTime()
    let deltaTime=elapsedTime-lastElapsedTime
    lastElapsedTime=elapsedTime

    if(!!donut){
        donut.position.y=Math.sin(elapsedTime * 0.5) * 0.2 - 0.1
    }

    renderer.render(scene,camera)

    window.requestAnimationFrame(animate)
}
animate()
