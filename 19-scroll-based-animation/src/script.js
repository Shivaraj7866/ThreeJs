import * as THREE from "three"
import GUI from "lil-gui"
import gsap from "gsap"
import "./style.css"

console.log(gsap)

const canvas=document.querySelector("canvas.webgl")
let bodyElement=document.querySelector("body")

let size={
    width: window.innerWidth,
    height:window.innerHeight
}

let gui=new GUI()

let parameter={
    materialColor:"#ffffff"
}

let textureLoader=new THREE.TextureLoader()
let gradientTexture=textureLoader.load("textures/gradients/3.jpg")
gradientTexture.colorSpace=THREE.SRGBColorSpace // it allows texture to apply its original color
gradientTexture.magFilter=THREE.NearestFilter //the shades of texture will apply on the object as it is 
console.log(gradientTexture)

const scene=new THREE.Scene()

let cameraGroup=new THREE.Group()
scene.add(cameraGroup)

const camera=new THREE.PerspectiveCamera(55,size.width/size.height,0.1,1000)
camera.position.set(0,0,5)
cameraGroup.add(camera)

let renderer=new THREE.WebGLRenderer({canvas})
renderer.setSize(size.width,size.height)

/**
 * Material
 */
let material=new THREE.MeshToonMaterial({
    color:parameter.materialColor,
    gradientMap:gradientTexture,
    side:THREE.DoubleSide
})

gui
.addColor(parameter,"materialColor")
.onChange(()=>{
    material.color.set(parameter.materialColor),
    ParticleMaterial.color.set(parameter.materialColor)
})

/**
 * meshes
 */
let meshDistance=camera.position.x/6;
console.log(meshDistance)
let mesh1=new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)
let mesh2=new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
let mesh3=new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.3,100,16),
    material
)

let mesh4=new THREE.Mesh(
    new THREE.BoxGeometry(2,2,0.3),
    material
)

let mesh5=new THREE.Mesh(
    new THREE.BoxGeometry(2,2,0.3),
    material
)

let mesh6=new THREE.Mesh(
    new THREE.BoxGeometry(2,2,0.3),
    material
)

mesh1.position.x=meshDistance
mesh2.position.x=meshDistance
mesh3.position.x=meshDistance
mesh4.position.x=meshDistance
mesh5.position.x=meshDistance
mesh6.position.x=meshDistance

scene.add(mesh1,mesh2,mesh3,mesh4,mesh5,mesh6)

const sectionMeshes=[mesh1,mesh2,mesh3,mesh4]
// console.log(mesh1)

//particles
const particleCounts=300
let positions=new Float32Array(particleCounts,3)

for(let i = 0 ; i<particleCounts ; i++){

    positions[i * 3 + 0] = (Math.random()-0.5)*10
    positions[i * 3 + 1]=meshDistance * 0.5 - Math.random() * meshDistance * sectionMeshes.length
    positions[i * 3 + 2]=(Math.random()-0.5)*10

}

let ParticleGeometry=new THREE.BufferGeometry()
ParticleGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3))

let ParticleMaterial=new THREE.PointsMaterial({
    color:parameter.materialColor,
    size:0.05,
    sizeAttenuation:true
})

let particle=new THREE.Points(ParticleGeometry,ParticleMaterial)
scene.add(particle)

/**
 * Lights
 */
let Dlight=new THREE.DirectionalLight(0xffffff,1.5)
Dlight.position.set(1,1,0)
scene.add(Dlight)

let scrollY=window.scrollY
let currentSection=0;
let newSection=0
// console.log(scrollY)

window.addEventListener("scroll",()=>{
        scrollY=window.scrollY
         newSection=Math.round(scrollY/size.height)
        // console.log(newSection)
        // console.log(scrollY,"scrollY")

        if(newSection != currentSection){
            currentSection=newSection

            if(newSection === 2){

                // scene.add(mesh1,mesh2,mesh3,mesh4)


                gsap.from(
                    ".section",
                    {
                        scrollTrigger:".webgl",
                        x:800
                    }
                )

            }else{
                // scene.remove(mesh1,mesh2,mesh3,mesh4)

            }

            // gsap.to(
            //     sectionMeshes[currentSection],
            //     // console.log(sectionMeshes[currentSection].rotation)
            //     {   
            //         ScrollTrigger:".webgl",
            //         duration: 1.5,
            //         // ease:"power2.inOut",
            //         x:"+=6",
            //         y:"+=3",
            //         z:"+=1.5"
            //     }
            // )
            // console.log("changed",currentSection)
        }
    })

    
    let cursor={}
    cursor.x=0
    cursor.y=0
    
    window.addEventListener("mousemove",(event)=>{
        cursor.x=(event.clientX/size.width-0.5)*5
        cursor.y=(event.clientY/size.height-0.5)*5
        // console.log(cursor.x)
    })
    
    window.addEventListener("resize",()=>{
        
        //update sizes
        size.width=window.innerWidth
        size.height=window.innerHeight
        
        //update camera
        camera.aspect=size.width/size.height
        camera.updateProjectionMatrix()
        
        //update renderer
        renderer.setSize(size.width,size.height)
        renderer.render(scene,camera)
        renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    })


let clock=new THREE.Clock()
let previousTime=0;

function animate(){

    let elapsedTime=clock.getElapsedTime()
    let deltaTime= elapsedTime - previousTime
    previousTime=elapsedTime;

    //Update camera position and Animate
    // camera.position.x = scrollY/size.height * meshDistance

    if(newSection === 2){
        camera.position.x = scrollY/size.height * meshDistance 
    }

    const parallaxX=cursor.x *0.5
    const parallaxY=-cursor.y *0.5
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    //Animate meshes
    for(let mesh of sectionMeshes){
        mesh.rotation.x += deltaTime * 0.15
        mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene,camera)

    window.requestAnimationFrame(()=> animate())

}
animate()