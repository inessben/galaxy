import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from'three/addons/loaders/GLTFLoader.js'
import { FontLoader } from './sources/modules/FontLoader.js'
import { TextGeometry } from './sources/modules/TextGeometry.js'

//
// Loaders
// gltf
const gltfLoader = new GLTFLoader()

// Textures
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('textures/planet/globe/diffuse.jpg')

// particles
const star = textureLoader.load('particles/11.png')


// Models
// add an astronaut
let astronaut = null
gltfLoader.load(
    'models/astronaut.glb',
    (gltf) =>
    {
        astronaut = gltf.scene
        astronaut.position.x = - 1
        astronaut.position.y = -1.5
        
        astronaut.scale.set(0.45, 0.45, 0.45)

        astronaut.traverse((child) => {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.add(astronaut)
    }
)

// add a space ship
let spaceShip = null
gltfLoader.load(
    'models/spaceship.glb',
    (gltf) =>
    {
        spaceShip = gltf.scene
        spaceShip.position.x = -1
        spaceShip.position.y = 2
        spaceShip.position.z = -3.5

        spaceShip.rotation.x = 0.2
        spaceShip.rotation.y = 0.5
        spaceShip.rotation.z = 0.6


        spaceShip.scale.set(0.002, 0.002, 0.002)

        spaceShip.traverse((child) => {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.add(spaceShip)
    }
)

// add a flying saucer
let flyingSaucer = null
gltfLoader.load(
    'models/flying-saucer.glb',
    (gltf) =>
    {
        flyingSaucer = gltf.scene
        flyingSaucer.position.x = 3
        flyingSaucer.position.y = 1
        flyingSaucer.position.z = -4

        flyingSaucer.rotation.y = -0.7
        flyingSaucer.rotation.z = 0.4


        flyingSaucer.scale.set(0.007, 0.007, 0.007)

        flyingSaucer.traverse((child) => {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.add(flyingSaucer)
    }
)

// add a speech bubble
let bubble = null
gltfLoader.load(
    'models/speech-bubble.glb',
    (gltf) =>
    {
        bubble = gltf.scene
        bubble.position.x = -0.57
        bubble.position.y = 0.2

        bubble.rotation.y = Math.PI * 1

        bubble.scale.set(0.58, 0.58, 0.58)

        bubble.traverse((child) => {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.add(bubble)
    }
)

// text on the bubble speech
let text = 'Houston, we have a problem...'
const fontLoader = new FontLoader()
fontLoader.load('fonts/oswald.json', ( oswald ) => {
        const geometry = new TextGeometry (text, {
            font: oswald,
            height: 0.06,
            size: 0.065,
            curveSegments: 16,
            bevelThickness: 11,
        })
        const mesh = new THREE.Mesh(geometry, [
            new THREE.MeshBasicMaterial({ color: 0x111111 })
        ])
        mesh.position.x = -0.72
        mesh.position.y = 0.3
        mesh.position.z = -0.05
        scene.add(mesh)
})

// Scene
const scene = new THREE.Scene()
const space = new THREE.Scene()

// Geometry
const count = 1500
const positionArray = new Float32Array(count * 3)
for(let i = 0; i < count; i++)
{ 
    // position
    positionArray[i * 3 + 0] = (Math.random() - 0.5 ) *  6
    positionArray[i * 3 + 1] = (Math.random() - 0.5 ) *  6
    positionArray[i * 3 + 2] = (Math.random() - 0.5 ) *  6
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute
(
    'position', 
    new THREE.BufferAttribute(positionArray, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial
({
    size: 0.07,
    sizeAttenuation: true,
    color: new THREE.Color(0xffffff),
    alphaMap: star,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

// Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Sizes
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

// Resize
window.addEventListener('resize', () =>
{
    // Update sizes object
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 4
scene.add(camera)

// planets
// earth
const earth = new THREE.Mesh
(
    new THREE.SphereGeometry(5.5, 50, 20),
    new THREE.MeshStandardMaterial({ map: earthTexture})
)
earth.position.x = 7
earth.position.y = -5
earth.position.z = -7

scene.add(earth)

// Lights
// add an orange ambient light
const ambientLight = new THREE.AmbientLight(0xFF8900, 0.4)
scene.add(ambientLight)

// add a directionnal light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.castShadow = true
directionalLight.position.x = - 1
directionalLight.position.y = 2
directionalLight.position.z = 3
scene.add(directionalLight)

// add a spot light from the flying saucer
const spotLight = new THREE.SpotLight(0xffffff, 120, Math.PI * 1 )
spotLight.position.set(3, 1, -4)

scene.add(spotLight)

spotLight.target.position.set(7, -5, -7)
scene.add(spotLight.target)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Loop
const loop = () =>
{
    window.requestAnimationFrame(loop)

    // Update controls
    controls.update()

    // Update earth
    if(earth != null)
        earth.rotation.y += 0.001

    // Update flyingSaucer
        if(flyingSaucer != null)
        flyingSaucer.rotation.y += 0.003

    // Update astronaut
    if(astronaut != null)
    astronaut.rotation.x += 0.0015
    astronaut.rotation.y += 0.0015

    // Update particles
for(let i = 0; i < count; i++)
{
    const iStride = i * 3 

    const x = particlesGeometry.attributes.position.array[iStride + 0]
    const y = particlesGeometry.attributes.position.array[iStride + 1]
    const z = particlesGeometry.attributes.position.array[iStride + 2]

    const newY = y + Math.sin(Date.now() * 0.001 + x * 3 + z * 3) * 0.001
    particlesGeometry.attributes.position.array[iStride + 1] = newY
}
particlesGeometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)
}

loop()