
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;

    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_BaseColor;

    uniform float u_TexColorWeight;

    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;

    void main() {
        gl_FragColor = (1.0 - u_TexColorWeight) * u_BaseColor + u_TexColorWeight * texture2D(u_Sampler, v_TexCoord);
    }
`;

// Globals
let canvas;
let gl;
let triangleRenderer;
let camera;
let map;

let a_Position;
let a_TexCoord;
let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

let u_BaseColor;
let u_TexColorWeight;
let u_Sampler;

// let g_globalAngleY = 225.0;
// let g_globalAngleX = -20.0;

let g_mouseDown = false;
let g_mousePrevPos = [0.0, 0.0];

let g_keysEnabled = false;
const g_camRotStep = 0.5;

let g_prevTime = performance.now();

const g_colors = {
    cafe: [0.725, 0.663, 0.608, 1.0],
    darkGrey: [0.1, 0.1, 0.1, 1.0],
    brown: [0.75, 0.475, 0.231, 1.0],
    red: [1.0, 0.0, 0.0, 1.0],
    white: [1.0, 1.0, 1.0, 1.0],
    black: [0.0, 0.0, 0.0, 1.0],
    grey: [0.5, 0.5, 0.5, 1.0],
    skyBlue: [0.4, 0.7, 1.0, 1.0]
}

function setupWebGL() {
    canvas = document.getElementById("webgl");

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

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

    // Get the storage location of a_TexCoord
    a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if (a_TexCoord < 0) {
        console.log("Failed to get the storage location of a_TexCoord");
        return;
    }

    // Get the storage location of u_BaseColor
    u_BaseColor = gl.getUniformLocation(gl.program, "u_BaseColor");
    if (!u_BaseColor) {
        console.log("Failed to get the storage location of u_BaseColor");
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }

    // Get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
    if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    // Get the storage location of u_TexColorWeight
    u_TexColorWeight = gl.getUniformLocation(gl.program, "u_TexColorWeight");
    if (!u_TexColorWeight) {
        console.log("Failed to get the storage location of u_TexColorWeight");
        return;
    }

    // Get the storage location of u_Sampler
    u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    if (!u_Sampler) {
        console.log("Failed to get the storage location of u_Sampler");
        return;
    }
}

function initTextures() {
    loadTexture("floor_ground_grass.png", gl.TEXTURE0);
}

function loadTexture(path, textureUnit) {
    let image = new Image();
    
    if (!image) {
        console.log("Failed to create the image object");
        return;
    }

    image.onload = function() {
        let texture = gl.createTexture();

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);
    }

    image.src = path;
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    initTextures();

    triangleRenderer = new TriangleRenderer();
    camera = new Camera(60.0, [0.0, 1.5, 0.0], [0.0, 1.5, -1.0]);
    map = new Map();
    map.generate();

    // Register functions (event handler) to be called on mouse press/move
    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;

    canvas.onmouseup = function (ev) {
        g_mouseDown = false;
    };

    canvas.onmouseleave = function (ev) {
        g_mouseDown = false;
        g_keysEnabled = false;
    };

    document.addEventListener("keydown", onKeydown);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    requestAnimationFrame(tick);
}

function tick() {

    renderAllShapes();

    let duration = performance.now() - g_prevTime;
    document.getElementById("FPSspan").textContent = "ms: " + duration + " fps: " + Math.floor(1000 / duration);
    g_prevTime = performance.now();

    requestAnimationFrame(tick);
}

function onMouseDown(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect();

    if (x < rect.left || x > rect.right) return;
    if (y < rect.top || y > rect.bottom) return;

    g_mousePrevPos = [x, y];
    g_mouseDown = true;
    g_keysEnabled = true;
}

function onMouseMove(ev) {
    if (!g_mouseDown) return;
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    
    let deltaX = x - g_mousePrevPos[0];
    let deltaY = y - g_mousePrevPos[1];

    // g_globalAngleY -= deltaX * g_camRotStep;
    // g_globalAngleX -= deltaY * g_camRotStep;

    g_mousePrevPos = [x, y];

    renderAllShapes();
}

function onKeydown(ev) {
    if (!g_keysEnabled) return;

    switch (ev.code) {
        case "KeyW":
            if (ev.shiftKey) {
                camera.moveUp();
            } else {
                camera.moveForward();
            }
            break;
        case "KeyS":
            if (ev.shiftKey) {
                camera.moveDown();
            } else {
                camera.moveBackward();
            }
            break;
        case "KeyA":
            camera.moveLeft();
            break;
        case "KeyD":
            camera.moveRight();
            break;
        case "KeyQ":
            camera.panLeft();
            break;
        case "KeyE":
            camera.panRight();
            break;
        case "Space":
            camera.moveUp();
            break;
        default:
            break;
    }
}

function renderAllShapes() {
    // Pass in the global rotation matrix
    // let globalRotMatrix = new Matrix4().rotate(g_globalAngleX, 1.0, 0.0, 0.0).rotate(g_globalAngleY, 0.0, 1.0, 0.0);
    // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // === DRAW SCENE ===

    map.render();

    let skybox = new Cube([0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [100.0, 100.0, 100.0], g_colors.skyBlue, 0.0, false);
    skybox.render();

    let ground = new Cube([0.0, -0.5, 0.0], [0.0, 0.0, 0.0], [20.0, 1.0, 20.0], g_colors.brown, 0.0, true);
    ground.render();


}
