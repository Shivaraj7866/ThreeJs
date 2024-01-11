import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

const canvas = document.querySelector("canvas.webgl")

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let scene = new THREE.Scene()

/**
 * Fog(#262837)
 */
let fog = new THREE.Fog("#262837", 1, 25)
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * doorTexture
 */
const doorColorTexture = textureLoader.load("/Images/door/color.jpg")
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAmbientOcclusionTexture = textureLoader.load("/Images/door/ambientOcclusion.jpg")
const doorAlphaTexture = textureLoader.load("/Images/door/alpha.jpg")
const doorHeightTexture = textureLoader.load("/Images/door/height.jpg")
const doorMetalnessTexture = textureLoader.load("/Images/door/metalness.jpg")
const doorNormalTexture = textureLoader.load("/Images/door/normal.jpg")
const doorRoughnessTexture = textureLoader.load("/Images/door/roughness.jpg")
console.log(doorColorTexture)
/**
 * wallsTexture
 */
const brickColorTexture = textureLoader.load("/Images/bricks/color.jpg")
brickColorTexture.colorSpace = THREE.SRGBColorSpace;
const brickNormalTexture = textureLoader.load("/Images/bricks/normal.jpg")
const brickAmbientOcclusionTexture = textureLoader.load("/Images/bricks/ambientOcclusion.jpg")
const brickRoughnessTexture = textureLoader.load("/Images/bricks/roughness.jpg")
/**
 * grassTexture FOR floor
 */
const grassColorTexture = textureLoader.load("/Images/grass/color.jpg")
grassColorTexture.colorSpace = THREE.SRGBColorSpace;
const grassNormalTexture = textureLoader.load("/Images/grass/normal.jpg")
const grassAmbientOcclusionTexture = textureLoader.load("/Images/grass/ambientOcclusion.jpg")
const grassRoughnessTexture = textureLoader.load("/Images/grasss/roughnes.jpg")

/**
 * repeat grass Texture
 */
console.log(grassColorTexture.repeat)
grassColorTexture.repeat.set(5, 5)
grassNormalTexture.repeat.set(5, 5)
grassAmbientOcclusionTexture.repeat.set(5, 5)
grassRoughnessTexture.repeat.set(5, 5)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(0.5, 7, 10)
scene.add(camera)

let renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor("#262837")
console.log(renderer)

let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

let house = new THREE.Group()
scene.add(house)

let walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        transparent: true,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture,
        side: THREE.DoubleSide
    })
)
walls.position.y = 3 * 0.5 + 0.001
house.add(walls)

let roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#5af254" })
)
roof.position.y = 3 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

let door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.08,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture

    })
)
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.z = 1.5 + 0.5 + 0.001
door.position.y = 1
house.add(door)

/**
 * Bushes
 */
let bushGeometry = new THREE.SphereGeometry(1, 20, 20)
let bushMaterial = new THREE.MeshStandardMaterial({ color: "#20c60d" })

let bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

let bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1, 0.15, 2.7)

let bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.2, 2.2)

let bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.25, 0.24, 0.24)
bush4.position.set(-1, 0.15, 2.6)

house.add(bush1, bush2, bush3, bush4)

/**
 * Graves
 */
let graves = new THREE.Group()
scene.add(graves)

let graveGeometyry = new THREE.BoxGeometry(0.8, 1, 0.3)
let graveMaterial = new THREE.MeshStandardMaterial({ color: "#747c77" })

for (let i = 0; i < 50; i++) {

    let angle = Math.random() * Math.PI * 2
    let radius = 4 + Math.random() * 5

    let x = radius * Math.cos(angle)
    let z = radius * Math.sin(angle)

    let grave = new THREE.Mesh(graveGeometyry, graveMaterial)
    grave.position.set(x, 0.421, z)
    grave.rotation.y = (Math.random() - 0.5) * 1
    grave.rotation.z = (Math.random() - 0.5) * 1
    graves.add(grave)
}

let floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        transparent: true,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        side: THREE.DoubleSide
    })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

let gui = new GUI()

let ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
// scene.add(ambientLight)

let DirLight = new THREE.DirectionalLight(0xffffff)
DirLight.position.set(-4, 2, 1)
gui.add(DirLight, "intensity").min(1).max(8).step(0.001)
gui.add(DirLight.position, "x").min(-4).max(4).step(0.001)
// scene.add(DirLight)

let pointLight = new THREE.PointLight("#ff7d46", 5, 8)
pointLight.position.set(0, 2.8, 2.7)
house.add(pointLight)
gui.add(pointLight, "intensity").min(2).max(10).step(0.001).name("pLightIntensity")

/**
 * ghost
 */
let ghost1=new THREE.PointLight(0xff0000,1.5)
let ghost2=new THREE.PointLight(0x00ff00,1.5)
let ghost3=new THREE.PointLight(0x0000ff,1.5)

scene.add(ghost1,ghost2,ghost3)

window.addEventListener("resize", () => {
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
})

let clock=new THREE.Clock()
function animate() {

    let elapseTime=clock.getElapsedTime()
    let ghost1Angle=elapseTime*0.5

    //Update ghosts
    ghost1.position.x=Math.cos(ghost1Angle)* 4
    ghost1.position.z=Math.sin(ghost1Angle)*4
    ghost1.position.y=Math.sin(ghost1Angle*0.5)

    let ghost2Angle=-elapseTime*0.5
    ghost2.position.x=Math.cos(ghost2Angle)* 5.5
    ghost2.position.z=Math.sin(ghost2Angle*0.5)*5.5
    ghost2.position.y=Math.sin(ghost2Angle)

    let ghost3Angle=-elapseTime*0.5
    ghost3.position.x=Math.cos(ghost3Angle)* 3.5
    ghost3.position.z=Math.sin(ghost3Angle*0.5)*3.5
    ghost3.position.y=Math.sin(ghost3Angle)

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(() => animate())

}
animate()