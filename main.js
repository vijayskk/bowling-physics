import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'



const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(window.innerWidth,window.innerHeight)
camera.position.set(0,5,20)

// Mesh
const groundgeo = new THREE.PlaneGeometry(500,500)
const groundmat = new THREE.MeshPhongMaterial({color:0xffffff})
const ground = new THREE.Mesh(groundgeo,groundmat)

scene.add(ground)


const ballgeo = new THREE.SphereGeometry(1)
const ballmat = new THREE.MeshPhongMaterial({color:0x000000 , reflectivity:1})
const ball = new THREE.Mesh(ballgeo,ballmat)

scene.add(ball)




// Lighting

const pl1 = new THREE.PointLight(0xffffff,1)
pl1.position.set(0,10,10)
scene.add(pl1)


// Stump
var isLoaded = false
var stump
const loader = new GLTFLoader()
loader.load('/stump/stump.gltf',(gltf)=>{
  stump = gltf.scene
  stump.scale.set(2,2,2)
  scene.add(stump)
  isLoaded = true
})


// controls
const controls = new OrbitControls(camera,renderer.domElement) 


// Physics Setup
const world = new CANNON.World({
  gravity:new CANNON.Vec3(0,-9.8,0)
})

const timeStep = 1/60


// Physics Objects
const groundBody = new CANNON.Body({
  shape:new CANNON.Box(new CANNON.Vec3(250,250,0.1)),
  mass:0,
})
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)
world.addBody(groundBody)



const cubeBody = new CANNON.Body({
  shape:new CANNON.Box(new CANNON.Vec3(0.3,0.5,0.3)),
  mass:1,
})
cubeBody.position.set(0,10,0)
world.addBody(cubeBody)

const ballBody = new CANNON.Body({
  shape:new CANNON.Sphere(1),
  mass:1,
})
ballBody.position.set(10,10,0)
ballBody.velocity.x = -24
world.addBody(ballBody)


function animate(){

  if(isLoaded){
    world.step(timeStep)
  }


  ground.position.copy(groundBody.position)
  ground.quaternion.copy(groundBody.quaternion)

  ball.position.copy(ballBody.position)
  ball.quaternion.copy(ballBody.quaternion)

  if(isLoaded){
    stump.position.copy(cubeBody.position)
    stump.quaternion.copy(cubeBody.quaternion)
    stump.position.y -=0.7 * -cubeBody.quaternion.z
  }

  controls.update()


  renderer.render(scene,camera)
  requestAnimationFrame(animate)
}
animate()


function reset(){
  ballBody.position.set(10,10,0)
  cubeBody.position.set(0,10,0)

}

var button = document.querySelector('#reset')
button.onclick = function reset(){
  ballBody.position.set(10,10,0)
  cubeBody.quaternion.setFromEuler(0,0,0)
  cubeBody.position.set(0,10,0)
  cubeBody.angularVelocity.set(0,0,0)
  cubeBody.velocity.set(0,0,0)
  ballBody.angularVelocity.set(0,0,0)
  ballBody.velocity.set(0,0,0)
  ballBody.velocity.x = -24
}