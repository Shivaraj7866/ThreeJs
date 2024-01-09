import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5;

let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

////////////////////////////////////////////////////

// ------------------TextureLoader------------------

const textureLoader = new THREE.TextureLoader()
const matCaptexture = textureLoader.load("/Images/deer.webp")
console.log(matCaptexture)

//-----------------FontLoader--------------
let fontLoader = new FontLoader() 
let font;
fontLoader.load('./Fonts/helvetiker_regular.typeface.json', (loadedFont) => {
    font = loadedFont;
    let textGeometry = new TextGeometry(
        "Hello three js",
        {
            font: font,
            size: 1,
            height: 0.5,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        }
    );

    //To know the text position along x and y and also we can keep it in the center by adjusting the x and y
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.03) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.03) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )

    textGeometry.center()
    console.log(textGeometry.boundingBox)

    let material = new THREE.MeshMatcapMaterial({ matcap: matCaptexture })
    let mesh = new THREE.Mesh(textGeometry, material)
    scene.add(mesh)

    
    let torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40)
    
    // console.time("donuts")
    for (let i = 0; i < 200; i++) {
        let torus = new THREE.Mesh(torusGeometry, material)
        scene.add(torus)

        torus.position.x = (Math.random() - 0.5) * 10
        torus.position.y = (Math.random() - 0.5) * 10
        torus.position.z = (Math.random() - 0.5) * 10

        const rotate = Math.random() * Math.PI
        torus.rotation.set(rotate, rotate, rotate)


        const scale = Math.random()
        torus.scale.set(scale, scale, scale)

    }
// console.timeEnd("donuts")
})

////////////////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(new THREE.Color(0x000000))

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
})
renderer.render(scene, camera)

function animate() {
    //update Controls
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(() => animate())
}
console.log("Working");
animate()