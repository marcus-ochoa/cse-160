class GameObject {
    constructor(
        position = [0.0, 0.0, 0.0],
        rotation = [0.0, 0.0, 0.0],
        scale = [1.0, 1.0, 1.0],
        meshKey = null,
        color = [1.0, 1.0, 1.0, 1.0],
        texColorWeight = 1.0,
        isStatic = false,
        lit = true,
        parent = null,
    ) {
        this.type = "GameObject";
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.color = color;
        this.matrix = new Matrix4();
        this.transferMatrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.parent = parent;
        this.texColorWeight = texColorWeight;
        this.isStatic = isStatic;
        this.meshKey = meshKey;
        this.lit = lit;

        this.updateMatrix();
    }

    render() {
        if (!this.isStatic) {
            this.updateMatrix();
        }

        triangleRenderer.renderMesh(this.meshKey, this.matrix, this.normalMatrix, this.color, this.texColorWeight, this.lit);
    }

    updateMatrix() {
        this.matrix.setIdentity();
        this.transferMatrix.setIdentity();

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

        this.normalMatrix.set(this.matrix);
        this.normalMatrix.transpose().invert();
    }
}
