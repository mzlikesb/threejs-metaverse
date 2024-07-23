import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import CatCafe from '../public/Models/cat_cafe_environment.glb';
import { ModelLoad } from './ModelLoader.js';
import px from '../public/Textures/CubeMaps/px.png';
import nx from '../public/Textures/CubeMaps/px.png';
import py from '../public/Textures/CubeMaps/py.png';
import ny from '../public/Textures/CubeMaps/ny.png';
import pz from '../public/Textures/CubeMaps/pz.png';
import nz from '../public/Textures/CubeMaps/nz.png';

async function init() {
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
    camera.position.set(0, 3, 0);

    const orbit = new OrbitControls(camera, renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(5,10,7.5);
    scene.add(directionalLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const texture = await new THREE.CubeTextureLoader()
        .loadAsync( [ px, nx, py, ny, pz, nz ]);

    scene.environment = texture;

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `;

    const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
        }
        `;

    const uniforms = {
        topColor: { value: new THREE.Color(0x10C5D1) },
        bottomColor: { value: new THREE.Color(0xAF8F78) }
    };

    const gradientMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    });

    const sphereGeometry = new THREE.SphereGeometry();
    const sphereMesh = new THREE.Mesh(sphereGeometry, gradientMaterial);
    sphereMesh.scale.x = 20;
    sphereMesh.scale.y = 20;
    sphereMesh.scale.z = 20;
    scene.add(sphereMesh);

    ModelLoad(CatCafe, scene, {x:0,y:-0.12,z:0}, {x:0.01,y:0.01,z:0.01});
    ModelLoad('https://models.readyplayer.me/669e0feb3d2df5297df26a07.glb', scene, {x:0, y:0, z:0});

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