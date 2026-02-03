function drawImage() {
    // draws a bunny

    let colors = [
        [0.8, 0.8, 0.8, 1.0], // grey
        [1.0, 0.8, 1.0, 1.0], // pink
        [0.0, 0.0, 0.0, 1.0], // black
        [0.9, 0.9, 0.9, 1.0], // light grey
        [0.5, 0.5, 0.9, 1.0], // purple
        [0.7, 0.7, 0.7, 1.0], // dark grey
        [0.7, 0.2, 0.1, 1.0], // red
    ];

    let triangles = [
        // background
        [-8, -8, 8, 8, -8, 8, 4],
        [-8, -8, 8, -8, 8, 8, 4],

        // left ear
        [-4, 0, -1, 6, -4, 8, 0],
        [-4, 0, -4, 8, -7, 6, 0],
        [-4, 1, -2, 6, -4, 7, 1],
        [-4, 1, -4, 7, -6, 6, 1],

        // right ear
        [4, 0, 7, 6, 4, 8, 0],
        [4, 0, 4, 8, 1, 6, 0],
        [4, 1, 6, 6, 4, 7, 1],
        [4, 1, 4, 7, 2, 6, 1],

        // face
        [0, -8, 7, -5, 4, 0, 0],
        [0, -8, 4, 0, -4, 0, 0],
        [0, -8, -4, 0, -7, -5, 0],

        // eyes
        [2, -4, 4, -2, 3, -1, 2],
        [-2, -4, -3, -1, -4, -2, 2],

        // nose
        [0, -7, 1, -6, 0, -4, 3],
        [0, -7, 0, -4, -1, -6, 3],

        // whiskers
        [1, -5, 3, -5, 3, -4.5, 5],
        [1, -5, 3, -6, 3, -5.5, 5],
        [-1, -5, -3, -5, -3, -4.5, 5],
        [-1, -5, -3, -6, -3, -5.5, 5],

        // initials
        [-1, -2, -1, 0, -2, 0, 6],
        [1, -2, 2, 0, 1, 0, 6],
        [0, -3.5, 1, -2.5, 0, -1.5, 6],
        [0, -3.5, 0, -1.5, -1, -2.5, 6],
        [0, -1, 1, 0, -1, 0, 6],
    ];

    for (let i = 0; i < triangles.length; i++) {
        let adjustedTriangle = [
            triangles[i][0] / 8,
            triangles[i][1] / 8,
            triangles[i][2] / 8,
            triangles[i][3] / 8,
            triangles[i][4] / 8,
            triangles[i][5] / 8,
        ];

        let colorIndex = triangles[i][6];

        gl.uniform4f(
            u_FragColor,
            colors[colorIndex][0],
            colors[colorIndex][1],
            colors[colorIndex][2],
            colors[colorIndex][3],
        );

        drawTriangle(adjustedTriangle);
    }
}
