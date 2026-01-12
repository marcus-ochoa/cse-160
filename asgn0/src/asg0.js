
function main() {
    clearCanvas();
 }

 function handleDrawEvent() {
    let vec1 = new Vector3([document.getElementById("vec1x").value, document.getElementById("vec1y").value, 0]);
    let vec2 = new Vector3([document.getElementById("vec2x").value, document.getElementById("vec2y").value, 0]);

    clearCanvas();

    drawVector(vec1, 'red');
    drawVector(vec2, 'blue');
 }

 function drawVector(v, color) {
    // Retrieve canvas element
    const canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve <canvas> element');
        return;
    }

    // Get rendering context for 2DCG
    const ctx = canvas.getContext('2d');

    let cx = canvas.width/2;
    let cy = canvas.height/2;

    ctx.strokeStyle = color;

    console.log(v);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
    ctx.stroke();
 }

 function clearCanvas() {
    // Retrieve canvas element
    const canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve <canvas> element');
        return;
    }

    // Get rendering context for 2DCG
    const ctx = canvas.getContext('2d');
    
    // Draw a black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with color
 }