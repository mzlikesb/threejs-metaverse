import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

export async function LoadModel(modelPath, scene, pos={x:0, y:0, z:0}, scale={x:1, y:1, z:1}) {
    return new Promise((resolve, reject) => {
        loader.load(
            modelPath,
            (gltf) =>{
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                scene.add(gltf.scene);
                gltf.scene.position.set(pos.x, pos.y, pos.z);
                gltf.scene.scale.set(scale.x, scale.y, scale.z);
                resolve(gltf);
            },
            (xhr)=>{
                //console.log((xhr.loaded / xhr.total * 100) + "% loaded");
            },
            (error)=>{
                console.error('load error', error);
                reject(error);
            }
        );
});
}

export async function LoadAnimation(animationPath) {
    return new Promise((resolve, reject) => {
        loader.load(
            animationPath,
            (gltf) => {
                resolve(gltf.animations);
            },
            undefined,
            (error) => {
                console.error('load error', error);
                reject(error);
            }
        );
    });
}