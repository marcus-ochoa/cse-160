class Cube {
    constructor(
        position = [0.0, 0.0, 0.0],
        rotation = [0.0, 0.0, 0.0],
        scale = [1.0, 1.0, 1.0],
        color = [1.0, 1.0, 1.0, 1.0],
        texColorWeight = 1.0,
        lit = true,
        parent = null,
    ) {
        this.type = "Cube";
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.color = color;
        this.matrix = new Matrix4();
        this.transferMatrix = new Matrix4();
        this.parent = parent;
        this.texColorWeight = texColorWeight;
        this.lit = lit;
    }

    render() {
        // Pass the color of a point to u_BaseColor variable
        triangleRenderer.setBaseColor([
            this.color[0],
            this.color[1],
            this.color[2],
            this.color[3],
        ]);

        triangleRenderer.setTexColorWeight(this.texColorWeight);

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

        triangleRenderer.setModelMatrix(this.matrix);
        this.drawFaces();
    }

    drawFaces() {
        // Draw cube

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 0.5,
                this.color[1] * 0.5,
                this.color[2] * 0.5,
                this.color[3],
            ]);
        }

        triangleRenderer.setTexCoords([
            0.0, 0.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
        ]);

        // back face
        triangleRenderer.setVertices([
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ]);

        triangleRenderer.render();

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 0.6,
                this.color[1] * 0.6,
                this.color[2] * 0.6,
                this.color[3],
            ]);
        }

        // left face
        triangleRenderer.setVertices([
            0.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0
        ]);

        triangleRenderer.render();

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 0.7,
                this.color[1] * 0.7,
                this.color[2] * 0.7,
                this.color[3],
            ]);
        }

        // bottom face
        triangleRenderer.setVertices([
            0.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 1.0
        ]);

        triangleRenderer.render();

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 0.8,
                this.color[1] * 0.8,
                this.color[2] * 0.8,
                this.color[3],
            ]);
        }

        // front face
        triangleRenderer.setVertices([
            0.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0
        ]);

        triangleRenderer.render();

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 0.9,
                this.color[1] * 0.9,
                this.color[2] * 0.9,
                this.color[3],
            ]);
        }

        // right face
        triangleRenderer.setVertices([
            1.0, 0.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 1.0
        ]);

        triangleRenderer.render();

        if (this.lit) {
            triangleRenderer.setBaseColor([
                this.color[0] * 1.0,
                this.color[1] * 1.0,
                this.color[2] * 1.0,
                this.color[3],
            ]);
        }

        // top face
        triangleRenderer.setVertices([
            0.0, 1.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ]);

        triangleRenderer.render();
    }
}
