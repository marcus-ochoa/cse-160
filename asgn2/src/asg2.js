// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

// Globals
let canvas;
let gl;
let a_Position;
let u_FragColor;

let g_globalAngleY = 0.0;
let g_globalAngleX = 0.0;

let g_isAnimOn = true;

let g_angleLegFR = -10.0;

let g_mouseDown = false;
let g_mousePrevPos = [0.0, 0.0];
const g_camRotStep = 0.5;

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById("webgl");

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas); // previous version
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // improved version, better performance

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    // Enables depth test which means the depth buffer will keep track of what is in front of what
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to intialize shaders.");
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
    if (!u_GlobalRotateMatrix) {
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return;
    }

    // Set the matrix buffer to the identity matrix initially (maybe not necessary?)
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function addHTMLActions() {

    document.getElementById("animOnButton").onclick = function () {
        g_isAnimOn = true;
    };
    document.getElementById("animOffButton").onclick = function () {
        g_isAnimOn = false;
    };

    document
        .getElementById("legFRSlider")
        .addEventListener("mouseup", function () {
            g_angleLegFR = this.value;
        });

    document
        .getElementById("camAngleYSlider")
        .addEventListener("mouseup", function () {
            g_globalAngleY = this.value;
            renderAllShapes();
        });
    document
        .getElementById("camAngleXSlider")
        .addEventListener("mouseup", function () {
            g_globalAngleX = this.value;
            renderAllShapes();
        });
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addHTMLActions();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = onMouseDown;

    // If the mouse is being dragged and clicked, update
    canvas.onmousemove = onMouseMove;

    canvas.onmouseup = function (ev) {
        g_mouseDown = false;
    };

    canvas.onmouseleave = function (ev) {
        g_mouseDown = false;
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // Render all shapes in main
    // renderAllShapes();

    requestAnimationFrame(tick);
}

function tick() {

    let tickStart = performance.now();
    g_seconds = performance.now() / 1000.0 - g_startTime;

    updateAnimation();
    renderAllShapes();

    let duration = performance.now() - tickStart;
    document.getElementById("FPSspan").textContent = "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10;

    requestAnimationFrame(tick);
}

function onMouseDown(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    if (x < rect.left || x > rect.right) return;
    if (y < rect.top || y > rect.bottom) return;

    g_mousePrevPos = [x, y];
    g_mouseDown = true;
}

function onMouseMove(ev) {
    
    if (!g_mouseDown) return;
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    
    var deltaX = x - g_mousePrevPos[0];
    var deltaY = y - g_mousePrevPos[1];

    g_globalAngleY -= deltaX * g_camRotStep;
    g_globalAngleX -= deltaY * g_camRotStep;

    g_mousePrevPos = [x, y];

    renderAllShapes();
}

function updateAnimation() {
    if (g_isAnimOn) {
        g_angleLegFR = -10.0 * Math.sin(g_seconds);
    }
}

function renderAllShapes() {

    // Pass in the global rotation matrix
    var globalRotMatrix = new Matrix4().rotate(g_globalAngleX, 1.0, 0.0, 0.0).rotate(g_globalAngleY, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var body = new Cube([0.0, -0.4, 0.0], [0.0, 0.0, 0.0], [1.0, 0.5, 0.5], [1.0, 0.0, 0.0, 1.0]);
    body.render();
    var head = new Cube([-0.6, -0.35, 0.0], [45.0, 0.0, -20.0], [0.5, 0.32, 0.32], [0.0, 1.0, 0.0, 1.0]);
    head.render();


    var legFR = new Cube([-0.25, -0.22, -0.3], [g_angleLegFR, 0.0, 0.0], [0.4, 0.7, 0.1], [0.0, 0.0, 1.0, 1.0]);
    legFR.render();

    var legFL = new Cube([-0.25, -0.22, 0.3], [10.0, 0.0, 0.0], [0.4, 0.7, 0.1], [0.0, 0.0, 1.0, 1.0]);
    legFL.render();

    var legBR = new Cube([0.25, -0.22, -0.3], [-10.0, 0.0, 0.0], [0.4, 0.7, 0.1], [0.0, 0.0, 1.0, 1.0]);
    legBR.render();

    var legBL = new Cube([0.25, -0.22, 0.3], [10.0, 0.0, 0.0], [0.4, 0.7, 0.1], [0.0, 0.0, 1.0, 1.0]);
    legBL.render();


    var calfFR = new Cube([0.0, 0.5, 0.06], [20.0, 0.0, 0.0], [0.3, 0.45, 0.1], [0.0, 1.0, 1.0, 1.0], legFR);
    calfFR.render();

    var calfFL = new Cube([0.0, 0.5, -0.06], [-20.0, 0.0, 0.0], [0.3, 0.45, 0.1], [0.0, 1.0, 1.0, 1.0], legFL);
    calfFL.render();

    var calfBR = new Cube([0.0, 0.5, 0.06], [20.0, 0.0, 0.0], [0.3, 0.45, 0.1], [0.0, 1.0, 1.0, 1.0], legBR);
    calfBR.render();

    var calfBL = new Cube([0.0, 0.5, -0.06], [-20.0, 0.0, 0.0], [0.3, 0.45, 0.1], [0.0, 1.0, 1.0, 1.0], legBL);
    calfBL.render();


    var footFR = new Cube([0.0, 0.3, 0.04], [20.0, 0.0, 0.0], [0.2, 0.3, 0.1], [1.0, 1.0, 0.0, 1.0], calfFR);
    footFR.render();

    var footFL = new Cube([0.0, 0.3, -0.04], [-20.0, 0.0, 0.0], [0.2, 0.3, 0.1], [1.0, 1.0, 0.0, 1.0], calfFL);
    footFL.render();

    var footBR = new Cube([0.0, 0.3, 0.04], [20.0, 0.0, 0.0], [0.2, 0.3, 0.1], [1.0, 1.0, 0.0, 1.0], calfBR);
    footBR.render();

    var footBL = new Cube([0.0, 0.3, -0.04], [-20.0, 0.0, 0.0], [0.2, 0.3, 0.1], [1.0, 1.0, 0.0, 1.0], calfBL);
    footBL.render();    
}
