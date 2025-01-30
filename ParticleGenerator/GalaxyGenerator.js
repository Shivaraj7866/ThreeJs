import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

const canvas = document.querySelector("canvas.webgl")

const scene = new THREE.Scene()

let gui = new GUI({ width: 300 })

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 4, 5)
scene.add(camera)

let renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

let parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = "#ff6030"
parameters.ousideColor = "#dda411"

let Geometry = null;
let material = null;
let points = null;

const galaxyGenerator = () => {

    /**
     * Destroy old galaxy
     */
    if (points !== null) {
        Geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * geometry
     */
   let Geometry=new THREE.BufferGeometry()

    let positions = new Float32Array(parameters.count * 3)
    let colors = new Float32Array(parameters.count * 3)

    let colorInside = new THREE.Color(parameters.insideColor)
    let colorOutside = new THREE.Color(parameters.ousideColor)

    for (let i = 0; i < parameters.count; i++) {

        let i3 = i * 3
        let radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3 + 0] = Math.sin(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

        let mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    Geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    )

    Geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    )

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(Geometry, material)
    scene.add(points)

}
galaxyGenerator()

gui.add(parameters, "count").min(10000).max(1000000).step(1000).name("ParaCounts").onFinishChange(galaxyGenerator)
gui.add(parameters, "size").min(0.001).max(0.1).step(0.001).name("ParaSize").onFinishChange(galaxyGenerator)
gui.add(parameters, "radius").min(0.01).max(20).step(0.01).name("Radius").onFinishChange(galaxyGenerator)
gui.add(parameters, "branches").min(2).max(20).step(1).name("Branches").onFinishChange(galaxyGenerator)
gui.add(parameters, "spin").min(-5).max(5).step(0.001).name("Spin").onFinishChange(galaxyGenerator)
gui.add(parameters, "randomness").min(0).max(2).step(0.001).name("Randomness").onFinishChange(galaxyGenerator)
gui.add(parameters, "randomnessPower").min(1).max(10).step(0.001).name("RandomnessPower").onFinishChange(galaxyGenerator)
gui.addColor(parameters, "insideColor").onFinishChange(galaxyGenerator)
gui.addColor(parameters, "ousideColor").onFinishChange(galaxyGenerator)

window.addEventListener("resize", () => {

    camera.aspect = sizes.width / sizes.height,
        camera.updateProjectionMatrix()

    renderer.render(scene, camera)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
})

function animate() {

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(() => animate())
}
animate()
