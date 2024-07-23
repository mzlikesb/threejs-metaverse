import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();
export function ModelLoad(modelPath, scene, pos={x:0, y:0, z:0}, scale={x:1, y:1, z:1}) {
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
        },
        (xhr)=>{
            //console.log((xhr.loaded / xhr.total * 100) + "% loaded");
        },
        (error)=>{
            console.error('load error', error);
        }
    );
}