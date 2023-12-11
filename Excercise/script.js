import * as THREE from "three"

const canvas=document.querySelector('canvas.webgl')
//scene
const scene=new THREE.Scene();

//objects

const group=new THREE.Group()
    group.position.y=1
    group.scale.y=2
    group.rotation.y=1
    scene.add(group)

//     const cube1=new THREE.Mesh(
//         new THREE.BoxGeometry(1,1,1),
//         new THREE.MeshBasicMaterial({color:0xff0000})
//     )
//     cube1.position.x=-2
//    group.add(cube1)

//     const cube2=new THREE.Mesh(
//         new THREE.BoxGeometry(1,1,1),
//         new THREE.MeshBasicMaterial({color:0x00ff00})
//     )
//    group.add(cube2)

//     const cube3=new THREE.Mesh(
//         new THREE.BoxGeometry(1,1,1),
//         new THREE.MeshBasicMaterial({color:0x0000ff})
//     )
//     cube3.position.x=2
//    group.add(cube3)

function CreteCubes(color,xPosition){
        let cube=new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:color})
        )
        cube.position.x=xPosition
        console.log(cube)
        group.add(cube)
}

CreteCubes(0xff0000,-2)
CreteCubes(0x00ff00,0)
CreteCubes(0x0000ff,2)


//AxesHelper
    const axesHelper=new THREE.AxesHelper(3)
    scene.add(axesHelper)

let size={
    width:800,
    height:500
}

//camera
const camera=new THREE.PerspectiveCamera(75,size.width / size.height)
camera.position.set(0,0,4)
scene.add(camera)

//renderer
const renderer=new THREE.WebGLRenderer({canvas:canvas})
renderer.setSize(size.width,size.height)

renderer.render(scene,camera)