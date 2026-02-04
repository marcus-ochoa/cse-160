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

let triangleRenderer;

let g_globalAngleY = 225.0;
let g_globalAngleX = -20.0;

let g_isMainAnimOn = true;
let g_isAltAnimOn = false;

let g_rotUp = 10.0;
let g_rotMid = 10.0;
let g_rotLow = 10.0;
let g_rotClaw = 4.0;
let g_rotHead = -10.0;
let g_bodyPosY = -0.5;

let g_upAnimCheck;
let g_midAnimCheck;
let g_lowAnimCheck;
let g_clawAnimCheck;
let g_headAnimCheck;

let g_upAngleSlider;
let g_midAngleSlider;
let g_lowAngleSlider;
let g_clawAngleSlider;
let g_headAngleSlider;

let g_mouseDown = false;
let g_mousePrevPos = [0.0, 0.0];
const g_camRotStep = 0.5;

let g_startTime = performance.now() / 1000.0;
let g_seconds = performance.now() / 1000.0 - g_startTime;
let g_prevTime = performance.now();
let g_animStartTime = 0.0;

const g_colors = {
    cafe: [0.725, 0.663, 0.608, 1.0],
    darkGrey: [0.1, 0.1, 0.1, 1.0],
    brown: [0.75, 0.475, 0.231, 1.0],
}

function setupWebGL() {
    canvas = document.getElementById("webgl");

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    triangleRenderer = new TriangleRenderer(10);

    // Enables depth test so the depth buffer keeps track of what is in front of what
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to intialize shaders.");
        return;
    }

    // Get the storage location of a_Position
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
}

function addHTMLActions() {
    g_upAnimCheck = document.getElementById("upAnimCheck");
    g_midAnimCheck = document.getElementById("midAnimCheck");
    g_lowAnimCheck = document.getElementById("lowAnimCheck");
    g_clawAnimCheck = document.getElementById("clawAnimCheck");
    g_headAnimCheck = document.getElementById("headAnimCheck");

    g_upAngleSlider = document.getElementById("upAngleSlider");
    g_midAngleSlider = document.getElementById("midAngleSlider");
    g_lowAngleSlider = document.getElementById("lowAngleSlider");
    g_clawAngleSlider = document.getElementById("clawAngleSlider");
    g_headAngleSlider = document.getElementById("headAngleSlider");
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    addHTMLActions();

    // Register functions (event handler) to be called on mouse press/move
    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;

    canvas.onmouseup = function (ev) {
        g_mouseDown = false;
    };

    canvas.onmouseleave = function (ev) {
        g_mouseDown = false;
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.65, 0.733, 0.627, 1.0);

    requestAnimationFrame(tick);
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;

    updateAnimation();
    renderAllShapes();

    let duration = performance.now() - g_prevTime;
    document.getElementById("FPSspan").textContent = "ms: " + duration + " fps: " + Math.floor(1000 / duration);
    g_prevTime = performance.now();

    requestAnimationFrame(tick);
}

function onMouseDown(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    if (x < rect.left || x > rect.right) return;
    if (y < rect.top || y > rect.bottom) return;

    if (ev.shiftKey) {
        g_isMainAnimOn = false;
        g_isAltAnimOn = true;
        g_animStartTime = performance.now() / 1000.0;
        return;
    }

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
    if (g_isMainAnimOn) {
        g_rotUp = g_upAnimCheck.checked ? 8.0 * Math.sin(g_seconds) : g_upAngleSlider.value;
        g_rotMid = g_midAnimCheck.checked ? 10.0 + 20.0 * Math.abs(Math.sin(g_seconds)) : g_midAngleSlider.value;
        g_rotLow = g_lowAnimCheck.checked ? 10.0 + 30.0 * Math.abs(Math.sin(g_seconds)) : g_lowAngleSlider.value;
        g_rotClaw = g_clawAnimCheck.checked ? 4.0 * Math.abs(Math.sin(g_seconds)) : g_clawAngleSlider.value;
        g_rotHead = g_headAnimCheck.checked ? -10.0 * Math.sin(g_seconds) : g_headAngleSlider.value;
        g_noseScale = 1.0;
        g_bodyPosY = -0.5;
    }

    // "Keyframed" alt shift click animation
    if (g_isAltAnimOn) {
        let runtime = g_seconds - g_animStartTime;
        if (runtime < 3) {
            g_rotUp = -8.0;
            g_rotMid = 30.0;
            g_rotLow = 40.0;
            g_rotClaw = 4.0;
            g_rotHead = 10.0;
            g_noseScale = 1.0 + 0.2 * Math.abs(Math.sin(3 * g_seconds));
        } else if (runtime < 6) {
            g_rotHead = -10.0 * Math.sin(8 * runtime);
        } else if (runtime < 7) {
            g_rotMid = 30.0 - (runtime - 6) * 50.0;
        } else if (runtime < 10) {
            g_bodyPosY = -0.5 - (runtime - 7) * 5.0;
        } else {
            g_isAltAnimOn = false;
            g_isMainAnimOn = true;
        }
    }
}

function renderAllShapes() {
    // Pass in the global rotation matrix
    var globalRotMatrix = new Matrix4().rotate(g_globalAngleX, 1.0, 0.0, 0.0).rotate(g_globalAngleY, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // === DRAW SCENE ===
    var branch = new Cube([0.0, 0.25, 0.0], [45.0, 0.0, 0.0], [1.5, 0.2, 0.2], g_colors.brown);
    branch.render();

    var body = new Cube([0.0, g_bodyPosY, 0.0], [0.0, 0.0, 0.0], [1.0, 0.5, 0.5], g_colors.cafe);
    body.render();
    var head = new Cube([-0.52, -0.18, 0,0], [g_rotHead, 0.0, -10.0], [0.5, 0.4, 0.4], g_colors.cafe, body);
    head.render();
    var nose = new Cube([-0.25, 0.2, 0.0], [0.0, 0.0, 0.0], [0.1, 0.1 * g_noseScale, 0.15 * g_noseScale], g_colors.darkGrey, head);
    nose.render();


    var upFR = new Cube([-0.25, -0.15, -0.3], [-10.0, 0.0, -g_rotUp], [0.4, 0.7, 0.1], g_colors.cafe, body);
    upFR.render();

    var upFL = new Cube([-0.25, -0.15, 0.3], [10.0, 0.0, g_rotUp], [0.4, 0.7, 0.1], g_colors.cafe, body);
    upFL.render();

    var upBR = new Cube([0.25, -0.15, -0.3], [-10.0, 0.0, -g_rotUp], [0.4, 0.7, 0.1], g_colors.cafe, body);
    upBR.render();

    var upBL = new Cube([0.25, -0.15, 0.3], [10.0, 0.0, g_rotUp], [0.4, 0.7, 0.1], g_colors.cafe, body);
    upBL.render();


    var midFR = new Cube([0.0, 0.6, 0.0], [g_rotMid, 0.0, 0.0], [0.3, 0.45, 0.1], g_colors.cafe, upFR);
    midFR.render();

    var midFL = new Cube([0.0, 0.6, 0.0], [-g_rotMid, 0.0, 0.0], [0.3, 0.45, 0.1], g_colors.cafe, upFL);
    midFL.render();

    var midBR = new Cube([0.0, 0.6, 0.0], [g_rotMid, 0.0, 0.0], [0.3, 0.45, 0.1], g_colors.cafe, upBR);
    midBR.render();

    var midBL = new Cube([0.0, 0.6, 0.0], [-g_rotMid, 0.0, 0.0], [0.3, 0.45, 0.1], g_colors.cafe, upBL);
    midBL.render();


    var lowFR = new Cube([0.0, 0.4, 0.0], [g_rotLow, 0.0, 0.0], [0.2, 0.3, 0.1], g_colors.cafe, midFR);
    lowFR.render();

    var lowFL = new Cube([0.0, 0.4, 0.0], [-g_rotLow, 0.0, 0.0], [0.2, 0.3, 0.1], g_colors.cafe, midFL);
    lowFL.render();

    var lowBR = new Cube([0.0, 0.4, 0.0], [g_rotLow, 0.0, 0.0], [0.2, 0.3, 0.1], g_colors.cafe, midBR);
    lowBR.render();

    var lowBL = new Cube([0.0, 0.4, 0.0], [-g_rotLow, 0.0, 0.0], [0.2, 0.3, 0.1], g_colors.cafe, midBL);
    lowBL.render();


    var aClawFR = new Cone([-0.035, 0.2, 0.0], [0.0, 0.0, -g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowFR);
    aClawFR.render();

    var bClawFR = new Cone([0.035, 0.2, 0.0], [0.0, 0.0, g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowFR);
    bClawFR.render();

    var aClawBR = new Cone([-0.035, 0.2, 0.0], [0.0, 0.0, -g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowBR);
    aClawBR.render();

    var bClawBR = new Cone([0.035, 0.2, 0.0], [0.0, 0.0, g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowBR);
    bClawBR.render();

    var aClawFL = new Cone([-0.035, 0.2, 0.0], [0.0, 0.0, -g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowFL);
    aClawFL.render();

    var bClawFL = new Cone([0.035, 0.2, 0.0], [0.0, 0.0, g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowFL);
    bClawFL.render();

    var aClawBL = new Cone([-0.035, 0.2, 0.0], [0.0, 0.0, -g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowBL);
    aClawBL.render();

    var bClawBL = new Cone([0.035, 0.2, 0.0], [0.0, 0.0, g_rotClaw], [0.13, 0.34, 0.1], g_colors.darkGrey, 8, lowBL);
    bClawBL.render();
}
