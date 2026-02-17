class TriangleRenderer {
    constructor() {
        this.type = "TriangleRenderer";
        this.vertexBuffer = null;
        this.texCoordBuffer = null;
        this.vertices = null;
        this.texCoords = null;
    }

    setVertices(verts) {
        this.vertices = new Float32Array(verts);

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
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    }

    setTexCoords(texCoords) {
        this.texCoords = new Float32Array(texCoords);

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
        gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.DYNAMIC_DRAW);
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

    render() {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}
