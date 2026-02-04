class Cone {
    constructor(
        position = [0.0, 0.0, 0.0],
        rotation = [0.0, 0.0, 0.0],
        scale = [1.0, 1.0, 1.0],
        color = [1.0, 1.0, 1.0, 1.0],
        segments = 8,
        parent = null
    ) {
        this.type = "Cone";
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.color = color;
        this.matrix = new Matrix4();
        this.transferMatrix = new Matrix4();
        this.parent = parent;

        this.segments = segments;
    }

    render() {
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(
            u_FragColor,
            this.color[0],
            this.color[1],
            this.color[2],
            this.color[3],
        );

        if (this.parent) {
            this.matrix = new Matrix4(this.parent.transferMatrix);
        }
        
        // Perform matrix transformations
        this.matrix.translate(this.position[0], this.position[1], this.position[2]);
        this.matrix.rotate(this.rotation[2], 0.0, 0.0, 1.0);
        this.matrix.rotate(this.rotation[1], 0.0, 1.0, 0.0);
        this.matrix.rotate(this.rotation[0], 1.0, 0.0, 0.0);
        this.transferMatrix = new Matrix4(this.matrix);
        this.matrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        if (!this.parent) this.matrix.translate(-0.5, -0.5, -0.5); // sets pivot
        else this.matrix.translate(-0.5, 0.0, -0.5);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        this.drawFaces();
    }

    drawFaces() {
        // Draw cone
        gl.uniform4f(
            u_FragColor,
            this.color[0] * 0.5,
            this.color[1] * 0.5,
            this.color[2] * 0.5,
            this.color[3],
        );
        
        let angleStep = 360 / this.segments;

        for (let angle = 0; angle < 360; angle += angleStep) {
            let nextAngle = angle + angleStep;
            let vec1 = [
                Math.cos((angle * Math.PI) / 180) * 0.5,
                Math.sin((angle * Math.PI) / 180) * 0.5,
            ];
            let vec2 = [
                Math.cos((nextAngle * Math.PI) / 180) * 0.5,
                Math.sin((nextAngle * Math.PI) / 180) * 0.5,
            ];

            // Bottom color
            gl.uniform4f(
                u_FragColor,
                this.color[0] * 0.5,
                this.color[1] * 0.5,
                this.color[2] * 0.5,
                this.color[3],
            );

            triangleRenderer.render([
                0.5, 0.0, 0.5,
                0.5 + vec2[0], 0.0, 0.5 + vec2[1],
                0.5 + vec1[0], 0.0, 0.5 + vec1[1]
            ]);

            // Surface color
            gl.uniform4f(
                u_FragColor,
                this.color[0] * 0.6 + 0.4 * (angle / 360),
                this.color[1] * 0.6 + 0.4 * (angle / 360),
                this.color[2] * 0.6 + 0.4 * (angle / 360),
                this.color[3],
            );

            triangleRenderer.render([
                0.5, 1.0, 0.5,
                0.5 + vec1[0], 0.0, 0.5 + vec1[1],
                0.5 + vec2[0], 0.0, 0.5 + vec2[1]
            ]);
        }
    }
}
