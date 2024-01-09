import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

const canvas=document.querySelector('canvas.webgl')
const scene=new THREE.Scene()

let geometry=new THREE.BufferGeometry()

let count=500;
const positionArray=new Float32Array(count*3*3)
for(let i=0 ; i<count*3*3 ; i++){
    positionArray[i]=(Math.random()-0.5)*2
}
const positionAttritube=new THREE.BufferAttribute(positionArray,3)
geometry.setAttribute('position',positionAttritube)

let material=new THREE.MeshBasicMaterial({color:0xff00ff,wireframe:true})
let mesh=new THREE.Mesh(geometry,material)
scene.add(mesh)

let size={
    width:window.innerWidth,
    height:window.innerHeight
}
let camera=new THREE.PerspectiveCamera(75,size.width/size.height,0.1,1000)
camera.position.z=3

//controls
    let controls=new OrbitControls(camera,canvas)
    controls.enableDamping=true

let renderer=new THREE.WebGL1Renderer({canvas:canvas})
renderer.setSize(size.width,size.height)

window.addEventListener('resize',()=>{

    size.width=window.innerWidth
    size.height=window.innerHeight

    camera.aspect=size.width/size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width,size.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))

})

function animate(){

    controls.update()

    window.requestAnimationFrame(animate)
    renderer.render(scene,camera)
}
animate()