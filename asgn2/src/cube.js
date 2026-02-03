class Cube {
    constructor(
        position = [0.0, 0.0, 0.0],
        rotation = [0.0, 0.0, 0.0],
        scale = [1.0, 1.0, 1.0],
        color = [1.0, 1.0, 1.0, 1.0],
        parent = null
    ) {
        this.type = "cube";
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.color = color;
        this.matrix = new Matrix4();
        this.transferMatrix = new Matrix4();
        this.parent = parent;
    }

    render() {
        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(
            u_FragColor,
            this.color[0],
            this.color[1],
            this.color[2],
            this.color[3],
        );

        if (this.parent) {
            this.matrix = this.parent.transferMatrix;
        }

        this.matrix.translate(this.position[0], this.position[1], this.position[2]);
        this.matrix.rotate(this.rotation[2], 0.0, 0.0, 1.0);
        this.matrix.rotate(this.rotation[1], 0.0, 1.0, 0.0);
        this.matrix.rotate(this.rotation[0], 1.0, 0.0, 0.0);
        this.transferMatrix = new Matrix4(this.matrix);
        this.matrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        // if (!this.parent) this.matrix.translate(-0.5, -0.5, -0.5);
        this.matrix.translate(-0.5, -0.5, -0.5);
        

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);



        this.drawFaces();
    }

    drawFaces() {
        
        // Draw cube
        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.5,
            this.color[1] * 0.5,
            this.color[2] * 0.5,
            this.color[3],
        );

        // back face
        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0
        ]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ]);

        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.6,
            this.color[1] * 0.6,
            this.color[2] * 0.6,
            this.color[3],
        );

        // left face
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0, 0.0, 1.0
        ]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0
        ]);

        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.7,
            this.color[1] * 0.7,
            this.color[2] * 0.7,
            this.color[3],
        );

        // bottom face
        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 1.0
        ]);

        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.8,
            this.color[1] * 0.8,
            this.color[2] * 0.8,
            this.color[3],
        );

        // front face
        drawTriangle3D([
            0.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            0.0, 1.0, 1.0
        ]);
        drawTriangle3D([
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0
        ]);

        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.9,
            this.color[1] * 0.9,
            this.color[2] * 0.9,
            this.color[3],
        );

        // right face
        drawTriangle3D([
            1.0, 0.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0
        ]);
        drawTriangle3D([
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 1.0
        ]);

        gl.uniform4f(
            u_FragColor,
            this.color[0] * 1.0,
            this.color[1] * 1.0,
            this.color[2] * 1.0,
            this.color[3],
        );

        // top face
        drawTriangle3D([
            0.0, 1.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0
        ]);
        drawTriangle3D([
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ]);
    }
}
