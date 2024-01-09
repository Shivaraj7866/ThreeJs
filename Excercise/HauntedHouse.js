import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

const canvas=document.querySelector("canvas.webgl")

let sizes={
    width:window.innerWidth,
    height:window.innerHeight
}

let scene=new THREE.Scene()

let camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,500)
camera.position.set(0,4,6)
scene.add(camera)

let renderer=new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(sizes.width,sizes.height)

let controls=new OrbitControls(camera,canvas)
controls.enableDamping=true

let sphere=new THREE.Mesh(
    new THREE.SphereGeometry(0.5,20,20),
    new THREE.MeshStandardMaterial({color:0xffffff})
)
scene.add(sphere)

let plane=new THREE.Mesh(
    new THREE.PlaneGeometry(10,10,10,10),
    new THREE.MeshStandardMaterial({color:0x00ff00,side:THREE.DoubleSide})
)
plane.rotation.x=Math.PI*0.5
plane.position.y=-1
scene.add(plane)

let ambientLight=new THREE.AmbientLight(0xffffff,1.5)
scene.add(ambientLight)

let DirLight=new THREE.DirectionalLight(0xffffff,1)
DirLight.position.set(-3,2,1)
scene.add(DirLight)

window.addEventListener("resize",()=>{
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.render(scene,camera)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})

function animate(){


    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(()=> animate())

}
animate()