import * as THREE from 'three';

class RandObjectPool {
    constructor(scene, rockTexture)
    {
        this.scene = scene;
        this.count = 40;
        this.pool = [];

        this.speed = 0.04;
        this.radius = 20;

        this.prevTime = 0;
        this.spawnFrequency = 0.1;
        
        this.color = 0xaa3123;
        this.scale = 1;
        this.mat = new THREE.MeshPhongMaterial( { map: rockTexture } );
        this.sphereGeo = new THREE.SphereGeometry(this.scale, 8, 4);
        this.cubeGeo = new THREE.BoxGeometry(this.scale, this.scale, this.scale);
        this.coneGeo = new THREE.ConeGeometry(this.scale / 2, this.scale, 12);
        this.cylGeo = new THREE.CylinderGeometry(this.scale / 2, this.scale / 2, this.scale, 12);

        this.generateObjects();
    }

    generateObjects() {
        for (let i = 0; i < this.count; i++) {
            let rand = Math.random();

            let mesh = null;

            if (rand < 0.25) {
                mesh = new THREE.Mesh(this.sphereGeo, this.mat);
            } else if (rand < 0.5) {
                mesh = new THREE.Mesh(this.cubeGeo, this.mat);
            } else if (rand < 0.75) {
                mesh = new THREE.Mesh(this.coneGeo, this.mat);
            } else {
                mesh = new THREE.Mesh(this.cylGeo, this.mat);
            }

            mesh.name = "RandObj" + mesh.id;
            this.pool.push(mesh);
        }

        for (let i = 0; i < this.pool.length; i++) {
            // this.scene.add(this.pool[i]);
            this.pool[i].visible = false;
        }
    }

    spawnRandObject() {
        const u = Math.random();
        const v = Math.random();

        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);

        const x = this.radius * Math.sin(phi) * Math.cos(theta);
        const y = this.radius * Math.sin(phi) * Math.sin(theta);
        const z = this.radius * Math.cos(phi);

        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].visible === false) {
                this.pool[i].position.set(x, y, z);
                this.pool[i].visible = true;
                break;
            }
        }
    }

    update(time) {
        if ((time - this.prevTime) / 1000 > this.spawnFrequency) {
            this.spawnRandObject();
            this.prevTime = time;
        }

        let origin = new THREE.Vector3();
        this.pool.forEach((obj) => {
            if (obj.visible === true) {
                if (obj.position.distanceToSquared(origin) < 1) {
                    obj.visible = false;
                }
                else {
                    let dir = new THREE.Vector3();
                    dir.subVectors(origin, obj.position);
                    dir.normalize();
                    dir.multiplyScalar(this.speed);
                    obj.position.add(dir);

                    obj.rotation.x = time / 2000;
                    obj.rotation.y = time / 1000;
                }
            } 
        })
    }
}

export {RandObjectPool};