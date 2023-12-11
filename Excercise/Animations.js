// import * as THREE from 'three'

// const canvas=document.querySelector('canvas.webgl')
// const scene=new THREE.Scene()
// const size={
//     width:800,
//     height:600
// }
// const camera=new THREE.OrthographicCamera(-2,2,-3,2,0.1,1000)
// camera.position.z=3

// const renderer=new THREE.WebGLRenderer({canvas:canvas})
// renderer.setSize(size.width,size.height)

// let cube1=new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color:0xff0000})
// )
// scene.add(cube1)

// const clock=new THREE.Clock()
// let tick=()=>{

//     //clock
//     const elapsTime=clock.getElapsedTime()
//     console.log(elapsTime)

//     //update object
//     camera.position.y = Math.sin(elapsTime)
//     camera.position.x = Math.cos(elapsTime)

//     camera.lookAt(cube1.position)

//     // cube1.rotation.y =Math.sin(elapsTime)
//     // cube1.rotation.x =Math.cos(elapsTime)
    
//     // camera.scale.y =Math.sin(elapsTime)
//     // camera.scale.x =Math.cos(elapsTime)

//     renderer.render(scene,camera)
//     window.requestAnimationFrame(tick)

// }
// tick()

//////////////////////////////////////////////////////////////////////
import * as THREE from 'three'
import "./style.css"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const canvas=document.querySelector('canvas.webgl')

const scene=new THREE.Scene()

let size={
    width:window.innerWidth,
    height:window.innerHeight
}

const renderer=new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(size.width,size.height)

let mesh=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
)
scene.add(mesh)

const camera=new THREE.PerspectiveCamera(75,size.width/size.height,0.1,1000)
camera.position.z=4
// camera.lookAt(mesh.position)
scene.add(camera)

//resize
    window.addEventListener('resize',()=>{
        //update sizes
            size.width=window.innerWidth
            size.height=window.innerHeight

        //update camera
            camera.aspect=size.width/size.height
            camera.updateProjectionMatrix()

        //updater renderer
            renderer.setSize(size.width,size.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    })

//controls
    let controls=new OrbitControls(camera,canvas)
    controls.enableDamping=true;
    // controls.enabled=false;
    // controls.target.y=-2
    // controls.update()

let cursor={
    x:0,
    y:0
}

window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX / size.width-0.5
    cursor.y = -(event.clientY / size.height-0.5)
    console.log(cursor.y)
})

function animate(){

//update camera
    // camera.position.x = Math.sin(cursor.x*Math.PI*2)*4
    // camera.position.z = Math.cos(cursor.x*Math.PI*2)*4
    // camera.position.y=cursor.y*6
    // camera.lookAt(mesh.position)
    
//update controls
    controls.update()

    window.requestAnimationFrame(animate)
    renderer.render(scene,camera)
}
animate()