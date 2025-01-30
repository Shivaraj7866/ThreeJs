import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// console.log(GLTFLoader)
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

const gltfLoader = new GLTFLoader()
let model = null;
gltfLoader.load("./models/Duck/glTF-Binary/Duck.glb", (gltf) => {
    // console.log("loaded", gltf)
    model = gltf.scene;
    model.position.y = -1.2
    scene.add(model)
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const dLight = new THREE.DirectionalLight(0xffffff, 0.9)
dLight.position.set(1, 2, 3)
scene.add(dLight)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
let mouse = new THREE.Vector2()

window.addEventListener("mousemove", (event) => {

    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1

})

canvas.addEventListener("click", () => {
    if (CurrentIntersect) {

        // console.log(CurrentIntersect)
        switch (CurrentIntersect.object) {
            case object1: console.log("sphere1")
                break;
            case object2: console.log("sphere2")
                break;
            case object3: console.log("sphere3")
                break;
        }

        // if(CurrentIntersect.object === object1){
        //     console.log("clicked on the spheres1",CurrentIntersect.object)  
        // }
        // if(CurrentIntersect.object === object2){
        //     console.log("clicked on the spheres2",CurrentIntersect.object)  
        // }
        // if(CurrentIntersect.object === object3){
        //     console.log("clicked on the spheres3",CurrentIntersect.object)  
        // }
    }

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let CurrentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Animate Objects
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object1.position.y = Math.sin(elapsedTime * 0.4) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.2) * 1.5

    //Cast Ray
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    objectsToTest.forEach(element => element.material.color.set(0xff0000));

    intersects.forEach(element => element.object.material.color.set(0x0000ff));

    if (intersects.length > 0) {

        // if (CurrentIntersect === null) console.log("mouse entered", CurrentIntersect)
        CurrentIntersect = intersects[0]

    } else {

        // if (CurrentIntersect) console.log("mouse exited", CurrentIntersect);
        CurrentIntersect = null;

    }

    if (model) {
        const intersectModel = raycaster.intersectObject(model)
        // console.log(intersectModel)
        if (intersectModel.length) {
            model.children[0].children[0].material.color.set(0xff0000)
            model.scale.set(1.5, 1.5, 1.5)
            console.log(model);
            // model.rotation.y+=0.01
            // model.rotation.z+=0.001
            // model.rotation.x+=0.001
            model.position.set(-1, -1, -1)
        }
        else {
            model.scale.set(1, 1, 1)
            model.children[0].children[0].material.color.set(0x00ff00)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// //Cast Ray
// const rayOrigin=new THREE.Vector3(-3,0,0)
// const rayDirection=new THREE.Vector3(10,0,0)
// rayDirection.normalize()

// raycaster.set(rayOrigin,rayDirection)

// const objectsToTest=[object1,object2,object3]
// const intersects=raycaster.intersectObjects(objectsToTest)
// // console.log(intersects)

// objectsToTest.forEach(element => {
//     element.material.color.set(0xff0000)
//  });

// intersects.forEach(element => {
//     element.object.material.color.set(0x0000ff)
//  });

//----------------------------------------Practice--------------------------------------
// import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// import GUI from "lil-gui"
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

// /**
//  * canvas
//  */
// const canvas = document.querySelector("canvas.webgl")

// /**
//  * Dubug
//  */
// let gui = new GUI()

// /**
//  * scene
//  */
// const scene = new THREE.Scene()

// let sizes = {
//     x: window.innerWidth,
//     y: window.innerHeight
// }

// /**
//  * Objects
//  */
// const material1 = new THREE.MeshBasicMaterial(0xffffff)
// const material2 = new THREE.MeshBasicMaterial(0xffffff)
// const material3 = new THREE.MeshBasicMaterial(0xffffff)

// const sphere1 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 5, 16),
//     material1
// )
// sphere1.position.x = -2

// const sphere2 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     material2
// )

// const sphere3 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 5, 16),
//     material3
// )
// sphere3.position.x = 2

// scene.add(sphere1, sphere2, sphere3)

// sphere1.updateMatrixWorld()
// sphere2.updateMatrixWorld()
// sphere3.updateMatrixWorld()

// /**
//  * Raycaster
//  */
// const raycaster = new THREE.Raycaster()

// // const rayOrigin=new THREE.Vector3(-3,0,0)
// // const rayDirection=new THREE.Vector3(-10,0,0)
// // rayDirection.normalize()

// // raycaster.set(rayOrigin,rayDirection)

// // let objArr=[sphere1,sphere2,sphere3]
// // let interSectSphere=raycaster.intersectObjects(objArr);
// // console.log(interSectSphere)

// /**
//  * camera
//  */
// const camera = new THREE.PerspectiveCamera(45, sizes.x / sizes.y, 0.2, 100)
// camera.position.set(0, 0, 5)
// scene.add(camera)

// /**
//  * OrbitControls
//  */
// let controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true;

// /**
//  * renderer
//  */
// let renderer = new THREE.WebGLRenderer({ canvas })
// renderer.setSize(sizes.x, sizes.y)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// let mouse = new THREE.Vector2()

// window.addEventListener('mousemove', (e) => {
//     mouse.x = e.clientX / sizes.x * 2 - 1
//     mouse.y = -(e.clientY / sizes.y) * 2 + 1
//     // console.log(mouse.y)
// })

// window.addEventListener("resize", () => {

//     //update sizes
//     sizes.x = window.innerWidth
//     sizes.y = window.innerHeight

//     //update camera
//     camera.aspect = sizes.x / sizes.y
//     camera.updateProjectionMatrix()

//     //update renderer
//     renderer.setSize(sizes.x, sizes.y)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// })

// let clock = new THREE.Clock()

// let currentIntersect = null;

// function animate() {

//     let elapsedTime = clock.getElapsedTime()

//     //animate Objects
//     sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
//     sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
//     sphere3.position.y = Math.sin(elapsedTime * 1.3) * 1.5

//     raycaster.setFromCamera(mouse, camera)

//     let spheresToTest = [sphere1, sphere2, sphere3]
//     let interSect = raycaster.intersectObjects(spheresToTest)
//     console.log(interSect)

//     spheresToTest.forEach(ele => ele.material.color.set(0xff0000))

//     interSect.forEach(ele => ele.object.material.color.set(0x00ff00))
//     // if (interSect.length > 0) {
//     //     if (currentIntersect === null) console.log("enter", currentIntersect)
//     //     currentIntersect = interSect[0]
//     // }
//     // else {
//     //     if (currentIntersect) console.log("exit", currentIntersect)
//     //     currentIntersect = null
//     // }



//     //controls
//     controls.update()

//     //rendrer
//     renderer.render(scene, camera)

//     window.requestAnimationFrame(animate)


// }
// animate()