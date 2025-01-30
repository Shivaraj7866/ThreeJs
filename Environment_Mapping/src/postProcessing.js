import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader, ShaderPass,SMAAPass,UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug UI
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Stats.js
const stats = new Stats()
stats.showPanel(0) // 0: FPS, 1: MS, 2: MB, 3+: custom
document.body.appendChild(stats.dom)

// Loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

// Update all materials
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

// Environment map
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/2/px.png',
    '/environmentMaps/2/nx.png',
    '/environmentMaps/2/py.png',
    '/environmentMaps/2/ny.png',
    '/environmentMaps/2/pz.png',
    '/environmentMaps/2/nz.png'
])

scene.background = environmentMap
scene.environment = environmentMap

// Models
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        // samples : renderer.getPixelRatio() === 1 ? 2 : 0
    }
)

// PostProcessing
let effectComposer = new EffectComposer(renderer,renderTarget)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

let dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

let glitchPass = new GlitchPass() // give glitch effect
glitchPass.goWild = false
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

let rgbShiftPass = new ShaderPass(RGBShiftShader) // gives blur effect for everthing in scene
rgbShiftPass.enabled = false   
effectComposer.addPass(rgbShiftPass)

let unRealBloomEffect = new UnrealBloomPass()
unRealBloomEffect.strength = 0.3
unRealBloomEffect.radius = 1
unRealBloomEffect.threshold = 0.6
effectComposer.addPass(unRealBloomEffect)

gui.add(unRealBloomEffect,"enabled").min(0).max(5).step(0.001)
gui.add(unRealBloomEffect,"strength").min(0).max(1).step(0.001)
gui.add(unRealBloomEffect,"radius").min(0).max(2).step(0.001)
gui.add(unRealBloomEffect,"threshold").min(0).max(1).step(0.001)

let gammaCorrectionShader = new ShaderPass(GammaCorrectionShader) //gives littlebit darker or realistic effect
effectComposer.addPass(gammaCorrectionShader)

// console.log(renderer.capabilities)
// if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2){
    console.log("SMAA")
    let sMAAPass = new SMAAPass()
    effectComposer.addPass(sMAAPass) // it helps to improve the anti-alias but lower perfomance but we have to use this only when pixelratio is more
// }

/**
 * Debug postprocessing
 */
const postProcessing = gui.addFolder("post-processing")

postProcessing.add(dotScreenPass,"enabled").name("dot-screen")
postProcessing.add(rgbShiftPass,"enabled").name("rgbShiftPass")
postProcessing.add(glitchPass,"enabled").name("GlitchPass")
postProcessing.add(gammaCorrectionShader,"enabled").name("gammaCorrectionShader")

/**
 * Dynamically Add UI for Stats
 */
const statsDiv = document.createElement('div')
const createStatsUI = () => {
    statsDiv.className = 'stats-ui'
    statsDiv.style.position = 'absolute'
    statsDiv.style.top = '10px'
    statsDiv.style.left = '100px'
    statsDiv.style.color = 'white'
    statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    statsDiv.style.padding = '10px'
    statsDiv.style.borderRadius = '8px'
    statsDiv.style.fontFamily = 'monospace'
    
    document.body.appendChild(statsDiv)
}
createStatsUI()

/**
 * Resize
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    effectComposer.setSize(sizes.width,sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

/**
 * Animate
*/
const clock = new THREE.Clock()

const tick = () => {
    stats.begin()

    window.requestAnimationFrame(tick)
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene,camera)
    effectComposer.render()

    statsDiv.innerHTML = `
    <p>Draw Calls: <span id="drawCalls " : >${renderer.info.render.calls}</span></p>
    <p>Textures: <span id="textures : ">${renderer.info.memory.textures}</span></p>
    <p>Frames: <span id="frames : ">${renderer.info.render.frame}</span></p>
    <p>Geometries: <span id="geometries">${renderer.info.memory.geometries}</span></p>
`
    stats.end()

  
}

tick()
