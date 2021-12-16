import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { randInt } from 'three/src/math/MathUtils'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)

// const light = new THREE.PointLight( 0x00ff00, .2, 100 );
// light.position.set( 0, 2, 2 );
// scene.add( light );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

let Boxes = []

class Box {
    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        this.mesh = new THREE.Mesh(geometry, material)

        this.value = randInt(100,999)
    }
}

// Object
function createBoxes(number)
{
    for (let i = 0; i < Boxes.length; i++) {
        scene.remove(Boxes[i].mesh)
    }
    Boxes = []
    for (let i = 0; i < number; i++) {
        let box = new Box()
        scene.add(box.mesh)
        box.mesh.position.set(i*2,0,0) 
        box.mesh.material.color.setRGB(box.value*0.001,0.15,0.6)
        Boxes.push(box)
    }

    camera.position.x = (number*2-1)/2-0.5
    controls.target.set((number*2-1)/2-0.5, 0, 0);
    camera.position.z = number
    // console.log(Boxes)
    // console.log(camera.position.x)
}

let boxNr = document.getElementById('nr')
createBoxes(boxNr.value)
boxNr.addEventListener('change', () => {
    createBoxes(document.getElementById('nr').value)
})
document.getElementById('refresh').addEventListener('click', () => {
    createBoxes(document.getElementById('nr').value)
})

//replace animation
function replace(index1, index2, delay=0) {

    const box1 = Boxes[index1]
    const box2 = Boxes[index2]
    gsap.to(Boxes[index1].mesh.position, { duration: 0.8, delay: 0.8 + delay, z: -1.5 })
    gsap.to(Boxes[index2].mesh.position, { duration: 0.8, delay: 0.8 + delay, z: -3})

    gsap.to(box1.mesh.position, { duration: 0.8, delay: 1.6 + delay, x: box2.mesh.position.x })
    gsap.to(box2.mesh.position, { duration: 0.8, delay: 1.6 + delay, x: box1.mesh.position.x })

    gsap.to(box1.mesh.position, { duration: 0.8, delay: 2.4 + delay, z: 0 })
    gsap.to(box2.mesh.position, { duration: 0.8, delay: 2.4 + delay, z: 0 })

    setTimeout(() => {
        const t = Boxes[index1]
        Boxes[index1] = Boxes[index2]
        Boxes[index2] = t  
        delay+=4
    }, 2500);

    return delay
}

//bubble sort alg
let moves = []
function bubbleSort() {
    moves = []
    let boxesCp = Boxes.slice(0, Boxes.length)
    for (let i = 0; i < Boxes.length; i++) {
        for (let j = 0; j < Boxes.length-1-i; j++) {
            if (boxesCp[j].value > boxesCp[j + 1].value) {
                let t = boxesCp[j]
                boxesCp[j] = boxesCp[j+1]
                boxesCp[j+1] = t 
                moves.push(j)
            }
        }
    }
};


//animation (calls replace function)
let delay = 0
function animation() {
    bubbleSort()
    document.querySelector('.options').classList.add('hide')
    document.querySelector('.title').classList.add('hide')
    for (let i = 0; i < moves.length; i++) {
        setTimeout(() => {
            //console.log(Boxes)
            delay = replace(moves[i], moves[i]+1, delay)
        }, 3200*i);   
    }
    setTimeout(() => {
        document.querySelector('.options').classList.remove('hide')
        document.querySelector('.title').classList.remove('hide')
    }, 3200*(moves.length));
}
let start = document.getElementById('start')
start.addEventListener('click', () => {
    animation()
})
//animation()

//Resize
window.addEventListener('resize', () =>
{
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


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
//const clock = new THREE.Clock()

const tick = () =>
{
    //const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()