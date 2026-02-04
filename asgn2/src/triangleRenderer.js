class TriangleRenderer {
    constructor() {
        this.type = "TriangleRenderer";
        this.buffer = null;
        this.vertices = null;
    }

    render(verts) {
        
        this.vertices = new Float32Array(verts);

        // Create a buffer object and bind it (should only happen once)
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

            // Assign the buffer object to aPosition variable
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

            // Enable the assignment to aPosition variable
            gl.enableVertexAttribArray(a_Position);
        }

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}
