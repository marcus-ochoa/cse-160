// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
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
let u_Size;

// Shapes render list
let g_shapesList = [];

let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5;
let g_selectedSegments = 8;

// Shape options
const SQUARE_MODE = 0;
const TRIANGLE_MODE = 1;
const CIRCLE_MODE = 2;
const STAR_MODE = 3;

let g_selectedShape = SQUARE_MODE;

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

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, "u_Size");
    if (!u_Size) {
        console.log("Failed to get the storage location of u_Size");
        return;
    }
}

function addHTMLActions() {
    document.getElementById("clearButton").onclick = function () {
        g_shapesList = [];
        renderAllShapes();
    };

    document.getElementById("squareButton").onclick = function () {
        g_selectedShape = SQUARE_MODE;
    };
    document.getElementById("triangleButton").onclick = function () {
        g_selectedShape = TRIANGLE_MODE;
    };
    document.getElementById("circleButton").onclick = function () {
        g_selectedShape = CIRCLE_MODE;
    };
    document.getElementById("starButton").onclick = function () {
        g_selectedShape = STAR_MODE;
    };

    document.getElementById("drawImageButton").onclick = drawImage;

    document
        .getElementById("redSlider")
        .addEventListener("mouseup", function () {
            g_selectedColor[0] = this.value / 100;
        });
    document
        .getElementById("greenSlider")
        .addEventListener("mouseup", function () {
            g_selectedColor[1] = this.value / 100;
        });
    document
        .getElementById("blueSlider")
        .addEventListener("mouseup", function () {
            g_selectedColor[2] = this.value / 100;
        });

    document
        .getElementById("sizeSlider")
        .addEventListener("mouseup", function () {
            g_selectedSize = this.value;
        });
    document
        .getElementById("segmentSlider")
        .addEventListener("mouseup", function () {
            g_selectedSegments = this.value;
        });
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addHTMLActions();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;

    // If the mouse is being dragged and clicked, update
    canvas.onmousemove = function (ev) {
        if (ev.buttons == 1) {
            click(ev);
        }
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    let point;

    switch (g_selectedShape) {
        case SQUARE_MODE:
            point = new Point([x, y], g_selectedColor.slice(), g_selectedSize);
            break;
        case TRIANGLE_MODE:
            point = new Triangle(
                [x, y],
                g_selectedColor.slice(),
                g_selectedSize,
            );
            break;
        case CIRCLE_MODE:
            point = new Circle(
                [x, y],
                g_selectedColor.slice(),
                g_selectedSize,
                g_selectedSegments,
            );
            break;
        case STAR_MODE:
            point = new Star(
                [x, y],
                g_selectedColor.slice(),
                g_selectedSize,
                g_selectedSegments,
            );
            break;
        default:
            console.log("Failed to find shape mode");
            return;
    }

    g_shapesList.push(point);
    renderAllShapes();
}

function renderAllShapes() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = g_shapesList.length;
    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}
