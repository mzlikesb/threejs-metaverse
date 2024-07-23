import * as THREE from 'three';
import { LoadAnimation } from './ModelLoader';
import idleAnimation from '../public/Animations/F_Standing_Idle_001.glb';
import walkAnimation from '../public/Animations/F_Walk_002.glb';

export class CharacterLocomotion{
    constructor(character){
        this.character = character;
        this.mixer = new THREE.AnimationMixer(this.character);
        this.clips = {};
        this.currentAction = null;
    }
    async initialize() {

        const idleClips = await LoadAnimation(idleAnimation);
        const walkClips = await LoadAnimation(walkAnimation);

        //remove root motion
        const tracks =  walkClips[0].tracks.filter(track => !track.name.includes('.position'));
        const walkClipEdited = new THREE.AnimationClip( walkClips[0].name,  walkClips[0].duration, tracks);

        this.clips['idle'] = idleClips[0];
        this.clips['walk'] = walkClipEdited;
        this.playAnimation('idle');
    }

    playAnimation(clipName) {
        if(this.clips[clipName] == null) return;
        if (this.currentAction && this.clips[clipName] === this.currentAction._clip) {
            return;
        }

        if (this.currentAction) {
            this.currentAction.fadeOut(0.2);
        }
        this.currentAction = this.mixer.clipAction(this.clips[clipName]);
        this.currentAction.reset().fadeIn(0.2).play();
    }

    update(camera, delta){

        let direction = new THREE.Vector2(0,0);
        const velocity = 0.02;
        if(keyPressed['ArrowUp']) direction.y = 1;
        if(keyPressed['ArrowDown']) direction.y = -1;
        if(keyPressed['ArrowRight']) direction.x = -1;
        if(keyPressed['ArrowLeft']) direction.x = 1;
        if(keyPressed['ArrowLeft']) direction.x = 1;

        direction.normalize();

        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0; // Ignore vertical component
        cameraDirection.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, cameraDirection).normalize();

        const moveDirection = new THREE.Vector3();
        moveDirection.addScaledVector(cameraDirection, direction.y);
        moveDirection.addScaledVector(right, direction.x);
        moveDirection.normalize();

        if (moveDirection.length() > 0) {
            //rotaion
            const angle = Math.atan2(moveDirection.x, moveDirection.z);
            const targetQuaternion = new THREE.Quaternion();
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            this.character.quaternion.slerp(targetQuaternion, 0.1);
            
            this.playAnimation('walk');
        } else {
            this.playAnimation('idle');
        }

        this.character.position.addScaledVector(moveDirection, velocity);
        this.mixer.update(delta);
    }
}