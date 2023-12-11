import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

let loadingTexture=new THREE.LoadingManager()
let textureLoader=new THREE.TextureLoader(loadingTexture)
    let Deertexture=textureLoader.load('/Images/beach.webp')
    let Beachtexture=textureLoader.load('/Images/beach.webp')
    let Butterflytexture=textureLoader.load('/Images/butterfly.webp')
    let Flowertexture=textureLoader.load('/Images/flowers.webp')
    let Roadtexture=textureLoader.load('/Images/road.webp')

// Deertexture.repeat.x=2
// Deertexture.repeat.y=3
// Deertexture.wrapS=THREE.MirroredRepeatWrapping
// Deertexture.wrapT=THREE.MirroredRepeatWrapping

// Deertexture.offset.x=0.5
// Deertexture.offset.y=0.5

// Deertexture.rotation=Math.PI/4
// Deertexture.center.x=0.5
// Deertexture.center.y=0.5

// Deertexture.generateMipmaps=true
Deertexture.minFilter= THREE.NearestFilter
// Deertexture.magFilter= THREE.NearestFilter
console.log(Deertexture.minFilter)


const canvas=document.querySelector('canvas.webgl')
const scene=new THREE.Scene()

//Texture
    // let image=new Image();
    // image.src='/Images/tree.jpg'
    // let texture=new THREE.Texture(image)
    // image.onload=()=>{
    //     texture.needsUpdate=true;
    // }

let geometry=new THREE.BoxGeometry(1,1,1)
console.log(geometry)
let material=new THREE.MeshBasicMaterial({map:Deertexture,wireframe:false})
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
    
////////////////////////////////////////////
let renderer=new THREE.WebGLRenderer({canvas:canvas})
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