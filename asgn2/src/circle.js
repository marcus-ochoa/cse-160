class Circle {
    constructor(
        pos = [0.0, 0.0, 0.0],
        col = [1.0, 1.0, 1.0, 1.0],
        sz = 5.0,
        seg = 8,
    ) {
        this.type = "circle";
        this.position = pos;
        this.color = col;
        this.size = sz;
        this.segments = seg;
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

        let angleStep = 360 / this.segments;

        for (let angle = 0; angle < 360; angle += angleStep) {
            let nextAngle = angle + angleStep;
            let vec1 = [
                Math.cos((angle * Math.PI) / 180) * d,
                Math.sin((angle * Math.PI) / 180) * d,
            ];
            let vec2 = [
                Math.cos((nextAngle * Math.PI) / 180) * d,
                Math.sin((nextAngle * Math.PI) / 180) * d,
            ];
            let point1 = [
                this.position[0] + vec1[0],
                this.position[1] + vec1[1],
            ];
            let point2 = [
                this.position[0] + vec2[0],
                this.position[1] + vec2[1],
            ];

            // Draw
            drawTriangle([
                this.position[0],
                this.position[1],
                point1[0],
                point1[1],
                point2[0],
                point2[1],
            ]);
        }
    }
}
