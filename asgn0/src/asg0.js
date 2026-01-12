function main() {
    clearCanvas();
}

function handleDrawEvent() {
    let vec1 = new Vector3([
        document.getElementById("vec1x").value,
        document.getElementById("vec1y").value,
        0,
    ]);
    let vec2 = new Vector3([
        document.getElementById("vec2x").value,
        document.getElementById("vec2y").value,
        0,
    ]);

    clearCanvas();

    drawVector(vec1, "red");
    drawVector(vec2, "blue");
}

function handleDrawOperationEvent() {
    let vec1 = new Vector3([
        document.getElementById("vec1x").value,
        document.getElementById("vec1y").value,
        0,
    ]);
    let vec2 = new Vector3([
        document.getElementById("vec2x").value,
        document.getElementById("vec2y").value,
        0,
    ]);

    clearCanvas();

    drawVector(vec1, "red");
    drawVector(vec2, "blue");

    let operation = document.getElementById("operation-select").value;
    let scalar = document.getElementById("scalar").value;

    switch (operation) {
        case "add":
            drawVector(vec1.add(vec2), "green");
            break;
        case "subtract":
            drawVector(vec1.sub(vec2), "green");
            break;
        case "multiply":
            drawVector(vec1.mul(scalar), "green");
            drawVector(vec2.mul(scalar), "green");
            break;
        case "divide":
            drawVector(vec1.div(scalar), "green");
            drawVector(vec2.div(scalar), "green");
            break;
        case "angleBetween":
            console.log("Angle: " + angleBetween(vec1, vec2));
            break;
        case "area":
            console.log("Area of the triangle: " + areaTriangle(vec1, vec2));
            break;
        case "magnitude":
            console.log("Magnitude v1: " + vec1.magnitude());
            console.log("Magnitude v2: " + vec2.magnitude());
            break;
        case "normalize":
            drawVector(vec1.normalize(), "green");
            drawVector(vec2.normalize(), "green");
            break;
        default:
            console.log("Failed to find viable operation");
    }
}

function drawVector(v, color) {
    // Retrieve canvas element
    const canvas = document.getElementById("example");
    if (!canvas) {
        console.log("Failed to retrieve <canvas> element");
        return;
    }

    // Get rendering context for 2DCG
    const ctx = canvas.getContext("2d");

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    ctx.strokeStyle = color;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
    ctx.stroke();
}

function clearCanvas() {
    // Retrieve canvas element
    const canvas = document.getElementById("example");
    if (!canvas) {
        console.log("Failed to retrieve <canvas> element");
        return;
    }

    // Get rendering context for 2DCG
    const ctx = canvas.getContext("2d");

    // Draw a black rectangle
    ctx.fillStyle = "rgba(0, 0, 0, 1.0)"; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with color
}

function angleBetween(v1, v2) {
    // Calculates angle between vectors using dot product
    let angle =
        Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())) *
        (180 / Math.PI);
    return angle;
}

function areaTriangle(v1, v2) {
    // Finds area of triangle made by two vectors using cross product
    let area = Vector3.cross(v1, v2).magnitude() / 2;
    return area;
}
