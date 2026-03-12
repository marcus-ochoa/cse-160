import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RandObjectPool } from './randObjectPool.js';
import { GameManager } from './gameManager.js';

const canvas = document.querySelector('#c');

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
camera.position.set(0, 0, 18);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enablePan = false;
controls.minDistance = 15;
controls.maxDistance = 18;
controls.update();

const cubeLoader = new THREE.CubeTextureLoader();

// https://freestylized.com/skybox/sky_02/
const skybox = cubeLoader.load([
    '../resources/skybox/px.png',
    '../resources/skybox/nx.png',
    '../resources/skybox/py.png',
    '../resources/skybox/ny.png',
    '../resources/skybox/pz.png',
    '../resources/skybox/nz.png'
]);

const textureLoader = new THREE.TextureLoader();
const rockTexture = textureLoader.load( '../resources/textures/rock.jpg' );
rockTexture.colorSpace = THREE.SRGBColorSpace;

// https://ambientcg.com/view?id=Grass005
const grassTexture = textureLoader.load( '../resources/textures/grass.jpg' );
grassTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = skybox;

const ambientColor = 0xFFFFFF;
const ambientLight = new THREE.AmbientLight(ambientColor, 0.4);
scene.add(ambientLight);

const directionalColor = 0xFFFFFF;
const directionalLight = new THREE.DirectionalLight(directionalColor, 0.5);
directionalLight.position.set(20, 15, 10);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

const spotLight = new THREE.SpotLight(0xFFFFFF, 30);
spotLight.position.set(camera.position.x, camera.position.y, camera.position.z);
spotLight.target.position.set(0, 0, 0);
spotLight.angle = Math.PI / 20;
scene.add(spotLight);
scene.add(spotLight.target);

camera.attach(spotLight);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 12, 8),
    new THREE.MeshPhongMaterial( { map: grassTexture } )
);
sphere.name = "MainSphere";
scene.add(sphere);

const objPool = new RandObjectPool(scene, rockTexture);
const gameManager = new GameManager(scene, camera);

// https://poly.pizza/m/5XSc2Fka3F
const gltfLoader = new GLTFLoader();

gltfLoader.load('../resources/models/cow.glb', function (gltf) {
    scene.add(gltf.scene);
    gameManager.setCow(gltf.scene, gltf.animations);
    renderer.setAnimationLoop(update);
}, undefined, function (error) {
    console.error(error);
} );

const timer = new THREE.Timer();

canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        gameManager.checkCow();
    }
});

function update(time) {
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    timer.update(time);
    objPool.update(time);
    gameManager.update(timer.getDelta());

    renderer.render(scene, camera);
}

function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

