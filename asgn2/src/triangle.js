class Triangle {
    constructor(pos = [0.0, 0.0, 0.0], col = [1.0, 1.0, 1.0, 1.0], sz = 5.0) {
        this.type = "triangle";
        this.position = pos;
        this.color = col;
        this.size = sz;
    }

    render() {
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(
            u_FragColor,
            this.color[0],
            this.color[1],
            this.color[2],
            this.color[3],
        );

        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, this.size);

        let d = this.size / 200.0;

        // Draw
        drawTriangle([
            this.position[0],
            this.position[1],
            this.position[0] + d,
            this.position[1],
            this.position[0],
            this.position[1] + d,
        ]);
    }
}

function drawTriangle(verts) {
    let vertices = new Float32Array(verts);

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // original line, slower
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); // new line, faster we are sending constant data

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawTriangle3D(verts) {
    let vertices = new Float32Array(verts);

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // original line, slower
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); // new line, faster we are sending constant data

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
