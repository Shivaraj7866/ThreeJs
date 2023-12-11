import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'
import GUI from 'lil-gui'
import gsap from 'gsap'

const gui=new GUI({
    width:250,
    title:'Nice UI',
    closeFolders:false
});

window.addEventListener('keydown',(event)=>{
    if(event.key === 'h'){
        gui.show(gui._hidden)
    }
})

const cubeTweak=gui.addFolder('Folder')
cubeTweak.close()

const canvas=document.querySelector('canvas.webgl')
const scene=new THREE.Scene()

//change Color using local storage
let debugColor={}
if(localStorage.getItem('color')){
    debugColor.color = localStorage.getItem('color')
}
else
debugColor.color="#f276f4";

let geometry=new THREE.BoxGeometry(1,1,1,2,2,2)
let material=new THREE.MeshBasicMaterial({color:debugColor.color,wireframe:true})
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

let renderer=new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(size.width,size.height)

//object
cubeTweak
.add(mesh.position,'y')
.min(-3)
.max(3)
.step(0.01)
.name('PositionY')

//hiding
cubeTweak
.add(mesh,'visible')

//material
cubeTweak
.add(material,'wireframe')

//material Color
cubeTweak
.addColor(debugColor,'color')
.onChange(()=>{
    material.color.set(debugColor.color)
    localStorage.setItem('color',debugColor.color)
})

//spinning cube
    debugColor.spin=()=>{
        gsap.to(mesh.rotation,{delay:4,duration:10,y:mesh.rotation.y + Math.PI*10})
    }
    cubeTweak.add(debugColor,'spin')

//Handling Triangles per frame
debugColor.subdivision=2;
cubeTweak
    .add(debugColor,'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(()=>{
        mesh.geometry.dispose()
        mesh.geometry=new THREE.BoxGeometry(
            1,1,1,
            debugColor.subdivision,debugColor.subdivision,debugColor.subdivision
        )
    })

//camera
cubeTweak
.add(camera.position,'z',1,5,0.01)

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