import * as THREE from 'three';

class GameManager {
    constructor(scene, camera)
    {
        this.cow = null;
        this.mixer = null;
        this.deathAnim = null;
        this.isCowRaising = false;
        this.raiseSpeed = 0.02;
        
        this.initQuat = null;

        this.maxAngle = 0.05;
        this.camera = camera;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
        this.scene = scene;

        this.radius = 10;
        this.raiseTarget = null;
    }

    setCow(cow, clips) {
        this.cow = cow;
        this.cow.scale.set(0.1, 0.1, 0.1);
        this.mixer = new THREE.AnimationMixer(cow);

        let clip = THREE.AnimationClip.findByName(clips, 'Armature|Death');
        this.deathAnim = this.mixer.clipAction(clip);
        this.deathAnim.setLoop(THREE.LoopRepeat, 1);
        this.deathAnim.clampWhenFinished = true;

        let light = new THREE.PointLight(0xFFFFFF, 3);
        light.position.set(0, 0, 0);
        cow.add(light);

        this.initQuat = this.cow.quaternion;

        this.spawnCow();
    }

    spawnCow() {
        this.deathAnim.stop();
        this.deathAnim.reset();

        const u = Math.random();
        const v = Math.random();

        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);

        const x = this.radius * Math.sin(phi) * Math.cos(theta);
        const y = this.radius * Math.sin(phi) * Math.sin(theta);
        const z = this.radius * Math.cos(phi);

        let dir = new THREE.Vector3(x, y, z);
        dir.normalize();
        const q = new THREE.Quaternion();
        q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        this.cow.quaternion.set(0, 0, 0, 1);
        this.cow.quaternion.premultiply(q);
        this.cow.position.set(x, y, z);
    }

    checkCow() {
        let camVec = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        let cowVec = new THREE.Vector3(this.cow.position.x, this.cow.position.y, this.cow.position.z);
        camVec.normalize();
        cowVec.normalize();

        let angle = Math.acos(camVec.dot(cowVec));

        if (angle < this.maxAngle) {
            this.deathAnim.play();
            this.raiseTarget = this.camera.position.clone();
            this.isCowRaising = true;
        }
    }

    update(dt) {
        this.mixer.update(dt);

        if (this.isCowRaising) {
            if (this.cow.position.distanceToSquared(this.raiseTarget) < 1) {
                this.isCowRaising = false;
                this.spawnCow();
            } else {
                let dir = new THREE.Vector3();
                dir.subVectors(this.raiseTarget, this.cow.position);
                dir.normalize();
                dir.multiplyScalar(this.raiseSpeed);
                this.cow.position.add(dir);
            }
        }
    }
}

export { GameManager };