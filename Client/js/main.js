import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { LoadModel } from './ModelLoader.js';
import { AddCubeMap, AddSphere} from './environment.js';
import CatCafe from '../public/Models/cat_cafe_environment.glb';

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
camera.position.set(0, 3, 0);

async function init() {
    const orbit = new OrbitControls(camera, renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(5,10,7.5);
    scene.add(directionalLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    await AddCubeMap(scene);
    AddSphere(scene, new THREE.Color(0x10C5D1), new THREE.Color(0xAF8F78));

    await LoadModel(CatCafe, scene, {x:0,y:-0.12,z:0}, {x:0.01,y:0.01,z:0.01});
    await LoadModel('https://models.readyplayer.me/669e0feb3d2df5297df26a07.glb', scene, {x:0, y:0, z:0});

    camera.position.z = 5;
    orbit.update();


    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();