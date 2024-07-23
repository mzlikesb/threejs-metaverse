import * as THREE from 'three';
import px from '../public/Textures/CubeMaps/px.png';
import nx from '../public/Textures/CubeMaps/px.png';
import py from '../public/Textures/CubeMaps/py.png';
import ny from '../public/Textures/CubeMaps/ny.png';
import pz from '../public/Textures/CubeMaps/pz.png';
import nz from '../public/Textures/CubeMaps/nz.png';

export async function AddCubeMap(scene) {
    const texture = new THREE.CubeTextureLoader()
        .load( [ px, nx, py, ny, pz, nz ]);

    scene.environment = texture;
}

export function AddSphere(scene, topColor= new THREE.Color(0xffffff), bottomColor= new THREE.Color(0x000000) ) {
    
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
        topColor: { value: topColor },
        bottomColor: { value: bottomColor }
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
   
}