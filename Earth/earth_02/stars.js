import * as THREE from "three"
import { loader } from "../earth"

export default function getStars(stars = 500) {
    function randomSpherePoionts() {
        const radius = Math.random() * 25 * 25
        const phi = Math.acos(2 * Math.random() - 1)// Calculates angle of a right-angle triangle in radians
        const theta = Math.random() * Math.PI * 2

        const x = radius * Math.sin(phi) * Math.cos(theta) //
        const y = radius * Math.sin(phi) * Math.sin(theta) //
        const z = radius * Math.cos(phi) //

        return {
            pos: new THREE.Vector3(x, y, z),
            hue: 0.6,
            radius
        }
    }

    const verts = [],
        colors = [],
        positions = []

    let col;
    for (let i = 0; i < stars; i++) {
        let p = randomSpherePoionts();
        let { pos, hue } = p
        verts.push(pos.x, pos.y, pos.z)
        positions.push(p)
        col = new THREE.Color().setHSL(hue, 0.2, Math.random(0.4))
        colors.push(col.r, col.g, col.b)

    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial()
    mat.vertexColors = true
    mat.size = 0.2
    mat.map = loader.load("../textures/stars/5.png")
    mat.depthWrite = false
    mat.blending = THREE.AdditiveBlending

    const Points = new THREE.Points(geo, mat)

    return Points;

}