class TriangleRenderer {
    constructor() {
        this.type = "TriangleRenderer";
        this.vertexBuffer = null;
        this.texCoordBuffer = null;
        this.litScalarBuffer = null;
        this.vertexCount = null;
        this.meshes = {};
        this.prevMeshKey = null;
    }

    addMesh(key, mesh) {
        this.meshes[key] = mesh;
    }

    renderMesh(key, transform, color, texColorWeight, litWeight) {
        if (key != this.prevMeshKey) {
            let mesh = this.meshes[key];
            this.setVertices(mesh.vertices);
            this.setTexCoords(mesh.texCoords);
            this.setLitScalars(mesh.litScalars);
            this.setTextureID(mesh.textureID);
            this.prevMeshKey = key;
        }

        this.setModelMatrix(transform);
        this.setBaseColor(color);
        this.setTexColorWeight(texColorWeight);
        this.setLitWeight(litWeight);
        this.render();
    }

    setVertices(verts) {
        // Create a buffer object and bind it (should only happen once)
        if (this.vertexBuffer === null) {
            this.vertexBuffer = gl.createBuffer();
            if (!this.vertexBuffer) {
                console.log("Failed to create the vertex buffer object");
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            // Assign the buffer object to a_Position variable
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            // Enable the assignment to a_Position variable
            gl.enableVertexAttribArray(a_Position);
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Write date into the vertex buffer object
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);

        this.vertexCount = verts.length / 3;
    }

    setTexCoords(texCoords) {
        // Create a buffer object and bind it (should only happen once)
        if (this.texCoordBuffer === null) {
            this.texCoordBuffer = gl.createBuffer();
            if (!this.texCoordBuffer) {
                console.log("Failed to create the tex coord buffer object");
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

            // Assign the buffer object to a_TexCoord variable
            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);

            // Enable the assignment to a_TexCoord variable
            gl.enableVertexAttribArray(a_TexCoord);
        }
        
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

        // Write date into the tex coords buffer object
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);
    }

    setLitScalars(litScalars) {
        // Create a buffer object and bind it (should only happen once)
        if (this.litScalarBuffer === null) {
            this.litScalarBuffer = gl.createBuffer();
            if (!this.litScalarBuffer) {
                console.log("Failed to create the lit scalar buffer object");
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.litScalarBuffer);

            // Assign the buffer object to a_TexCoord variable
            gl.vertexAttribPointer(a_LitScalar, 1, gl.FLOAT, false, 0, 0);

            // Enable the assignment to a_TexCoord variable
            gl.enableVertexAttribArray(a_LitScalar);
        }
        
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.litScalarBuffer);

        // Write date into the tex coords buffer object
        gl.bufferData(gl.ARRAY_BUFFER, litScalars, gl.DYNAMIC_DRAW);
    }

    setBaseColor(color) {
        gl.uniform4f(
            u_BaseColor,
            color[0],
            color[1],
            color[2],
            color[3],
        );
    }

    setTexColorWeight(weight) {
        gl.uniform1f(u_TexColorWeight, weight);
    }

    setModelMatrix(matrix) {
        gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    }

    setTextureID(id) {
        gl.uniform1i(u_Sampler, id);
    }

    setLitWeight(weight) {
        gl.uniform1f(u_LitWeight, weight);
    }

    render() {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}
