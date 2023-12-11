import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'

const canvas=document.querySelector('canvas.webgl')

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z=3;

let controls=new OrbitControls(camera,canvas)
controls.enableDamping=true;

////////////////////////////////////////////////////
let textLoader=new FontLoader()
let font;
textLoader.load('./Fonts/helvetiker_regular.typeface.json',(loadedFont)=>{
    font=loadedFont ;
    let textGeometry=new TextGeometry(
        "Hello three js",
        {
            font:font,
            size:0.5,
            height:0.5,
            curveSegments:5,
            bevelEnabled:true,
            bevelThickness:0.03,
            bevelSize:0.02,
            bevelOffset:0,
            bevelSegments:4
        }
    ) ;

//To know the text position along x and y and also we can keep it in the center by adjusting the x and y
textGeometry.computeBoundingBox()
textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.03) * 0.5,
    -(textGeometry.boundingBox.max.y - 0.03) * 0.5,
    -(textGeometry.boundingBox.max.z - 0.03) * 0.5
)
console.log(textGeometry.boundingBox)

let Textmaterial=new THREE.MeshBasicMaterial({})
Textmaterial.wireframe=true;
let mesh=new THREE.Mesh(textGeometry,Textmaterial)
scene.add(mesh)


    let axesHelper=new THREE.AxesHelper()
    scene.add(axesHelper)

})

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
    
//update Controls
    controls.update()
    renderer.render(scene,camera)

    window.requestAnimationFrame(()=>animate())
}
console.log("Working");
animate()