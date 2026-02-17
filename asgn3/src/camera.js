class Camera {
    constructor(
        fov = 60.0,
        eye = [0.0, 0.0, 0.0],
        at = [0.0, 0.0, -1.0],
        up = [0.0, 1.0, 0.0],
        speed = 0.05
    ) {
        this.type = "Camera";
        this.fov = fov;
        this.eye = new Vector3(eye);
        this.at = new Vector3(at);
        this.up = new Vector3(up);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);

        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);

        this.speed = speed;
    }

    moveForward() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);

        this.eye.add(f);
        this.at.add(f);

        this.updateView();
    }

    moveBackward() {
        let f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);

        this.eye.add(f);
        this.at.add(f);

        this.updateView();
    }

    moveLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);

        this.updateView();
    }

    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);

        this.eye.add(s);
        this.at.add(s);

        this.updateView();
    }

    moveUp() {
        let u = this.up;
        u.normalize();
        u.mul(this.speed);

        this.eye.add(u);
        this.at.add(u);

        this.updateView();
    }

    moveDown() {
        let u = this.up;
        u.normalize();
        u.mul(this.speed);

        this.eye.sub(u);
        this.at.sub(u);

        this.updateView();
    }

    panLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let rotatedF = rotMatrix.multiplyVector3(f);
        rotatedF.add(this.eye);
        this.at = rotatedF;

        this.updateView();
    }

    panRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let rotatedF = rotMatrix.multiplyVector3(f);
        rotatedF.add(this.eye);
        this.at = rotatedF;

        this.updateView();
    }

    updateView() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );

        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
    }
}
