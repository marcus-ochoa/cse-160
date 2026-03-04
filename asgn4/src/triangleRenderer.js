class TriangleRenderer {
    constructor() {
        this.type = "TriangleRenderer";
        this.vertexBuffer = null;
        this.normalBuffer = null;
        this.texCoordBuffer = null;
        this.vertexCount = null;
        this.meshes = {};
        this.prevMeshKey = null;
    }

    addMesh(key, mesh) {
        this.meshes[key] = mesh;
    }

    renderMesh(key, modelMatrix, normalMatrix, color, texColorWeight, lit) {
        if (key != this.prevMeshKey) {
            let mesh = this.meshes[key];
            this.setVertices(mesh.vertices);
            this.setTexCoords(mesh.texCoords);
            this.setNormals(mesh.normals);
            this.setTextureID(mesh.textureID);
            this.prevMeshKey = key;
        }

        this.setModelMatrix(modelMatrix);
        this.setNormalMatrix(normalMatrix);
        this.setBaseColor(color);
        this.setTexColorWeight(texColorWeight);
        this.setLit(lit);
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

        // Write data into the vertex buffer object
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

        // Write data into the tex coords buffer object
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);
    }

    setNormals(normals) {
        // Create a buffer object and bind it (should only happen once)
        if (this.normalBuffer === null) {
            this.normalBuffer = gl.createBuffer();
            if (!this.normalBuffer) {
                console.log("Failed to create the normal buffer object");
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

            // Assign the buffer object to a_Normal variable
            gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

            // Enable the assignment to a_Normal variable
            gl.enableVertexAttribArray(a_Normal);
        }
        
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // Write data into the normals buffer object
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW);
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

    setLit(val) {
        gl.uniform1f(u_Lit, val ? 1.0 : 0.0);
    }

    setModelMatrix(matrix) {
        gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    }

    setNormalMatrix(matrix) {
        gl.uniformMatrix4fv(u_NormalMatrix, false, matrix.elements);
    }

    setTextureID(id) {
        gl.uniform1i(u_Sampler, id);
    }

    render() {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}
