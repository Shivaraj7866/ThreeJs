import * as THREE from "three"
import "./style.css"
import GUI from "lil-gui"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

const canvas=document.querySelector("canvas.webgl")

let gui=new GUI({width:300});

let parameter={
    color:"#ffffff"
}

let sizes={
    width:window.innerWidth,
    height:window.innerHeight
}

const scene=new THREE.Scene()

const camera=new THREE.PerspectiveCamera(55,sizes.width/sizes.height,0.1,1000)
camera.position.set(0,4,4)
scene.add(camera)

let controls=new OrbitControls(camera,canvas)
controls.enableDamping=true;

let renderer=new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)

let sphere=new THREE.Mesh(
    new THREE.SphereGeometry(0.5,20,20),
    new THREE.MeshStandardMaterial({color:parameter.color,side:THREE.DoubleSide})
)
sphere.material.roughness=0
sphere.position.set(0,0.25,0)
scene.add(sphere)
gui.add(sphere.material,"roughness").min(0).max(2).step(0.001).name("S_roughness")
gui.add(sphere.material,"metalness").min(0).max(5).step(0.001).name("S_metalness")

let plane=new THREE.Mesh(
    new THREE.PlaneGeometry(5,5,20,20),
    new THREE.MeshStandardMaterial({color:0xffffff})
)
plane.rotation.x=-Math.PI/2
scene.add(plane)

let Dlight=new THREE.SpotLight(0xffffff,1.5)
console.log(Dlight)
Dlight.position.set(2,4,0)
scene.add(Dlight)

gui.add(Dlight,"intensity").min(1.5).max(5).step(0.001).name("D_intensity")


window.addEventListener("resize",()=>{
    // Update sizes
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    //update camera
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.render(scene,camera)
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})

function animate(){

    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(()=> animate())
}
animate()


