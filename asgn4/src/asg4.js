
// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;

    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Normal;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;

    uniform vec3 u_LightPosition;
    uniform vec3 u_EyePosition;
    
    varying vec2 v_TexCoord;

    varying vec3 v_NormalDir;
    varying vec3 v_LightDir;
    varying vec3 v_EyeDir;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_TexCoord = a_TexCoord;
        
        vec3 worldPos = vec3(u_ModelMatrix * a_Position);
        v_LightDir = u_LightPosition - worldPos;
        v_EyeDir = u_EyePosition - worldPos;
        
        v_NormalDir = vec3(u_NormalMatrix * a_Normal);
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform vec4 u_BaseColor;
    uniform float u_TexColorWeight;
    uniform sampler2D u_Sampler;

    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientLight;

    uniform float u_GlobalLit;
    uniform float u_Lit;
    uniform float u_NormalMode;

    varying vec2 v_TexCoord;
    
    varying vec3 v_NormalDir;
    varying vec3 v_LightDir;
    varying vec3 v_EyeDir;

    void main() {
        vec4 unlitColor = (1.0 - u_TexColorWeight) * u_BaseColor + u_TexColorWeight * texture2D(u_Sampler, v_TexCoord);

        vec3 normal = normalize(v_NormalDir);
        vec3 lightDir = normalize(v_LightDir);
        vec3 eyeDir = normalize(v_EyeDir);

        float nDotL = dot(lightDir, normal);
        vec3 diffuse = u_LightColor * unlitColor.rgb * max(0.0, nDotL);

        float eDotR = dot(eyeDir, 2.0 * nDotL * normal - lightDir);
        vec3 specular = u_LightColor * unlitColor.rgb * pow(max(0.0, eDotR), 128.0);

        vec3 ambient = u_AmbientLight * unlitColor.rgb;

        vec4 litColor = vec4(diffuse + ambient + specular, unlitColor.a);

        vec4 finalColor = (1.0 - (u_GlobalLit * u_Lit)) * unlitColor + (u_GlobalLit * u_Lit) * litColor;

        gl_FragColor = (1.0 - u_NormalMode) * finalColor + u_NormalMode * vec4(abs(normal), 1.0);
    }
`;

// Globals
let canvas;
let gl;
let triangleRenderer;
let camera;
let map;
let light;

let a_Position;
let a_TexCoord;
let a_Normal;
let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_NormalMatrix;
let u_LightPosition;
let u_EyePosition;

let u_BaseColor;
let u_LightColor;
let u_AmbientLight;
let u_Lit;
let u_GlobalLit;
let u_NormalMode;
let u_TexColorWeight;
let u_Sampler;

let g_mouseDown = false;
let g_mousePrevPos = [0.0, 0.0];

let g_keysEnabled = false;

let g_prevTime = performance.now();

const g_colors = {
    cafe: [0.725, 0.663, 0.608, 1.0],
    darkGrey: [0.1, 0.1, 0.1, 1.0],
    brown: [0.75, 0.475, 0.231, 1.0],
    red: [1.0, 0.0, 0.0, 1.0],
    white: [1.0, 1.0, 1.0, 1.0],
    black: [0.0, 0.0, 0.0, 1.0],
    grey: [0.5, 0.5, 0.5, 1.0],
    darkBlue: [0.0, 0.1, 0.5, 1.0]
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

    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if (a_TexCoord < 0) {
        console.log("Failed to get the storage location of a_TexCoord");
        return;
    }

    a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
    if (a_Normal < 0) {
        console.log("Failed to get the storage location of a_Normal");
        return;
    }

    u_BaseColor = gl.getUniformLocation(gl.program, "u_BaseColor");
    if (!u_BaseColor) {
        console.log("Failed to get the storage location of u_BaseColor");
        return;
    }

    u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
    if (!u_LightColor) {
        console.log("Failed to get the storage location of u_LightColor");
        return;
    }

    u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
    if (!u_AmbientLight) {
        console.log("Failed to get the storage location of u_AmbientLight");
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
    if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
    if (!u_NormalMatrix) {
        console.log("Failed to get the storage location of u_NormalMatrix");
        return;
    }

    u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
    if (!u_LightPosition) {
        console.log("Failed to get the storage location of u_LightPosition");
        return;
    }

    u_EyePosition = gl.getUniformLocation(gl.program, "u_EyePosition");
    if (!u_EyePosition) {
        console.log("Failed to get the storage location of u_EyePosition");
        return;
    }

    u_TexColorWeight = gl.getUniformLocation(gl.program, "u_TexColorWeight");
    if (!u_TexColorWeight) {
        console.log("Failed to get the storage location of u_TexColorWeight");
        return;
    }

    u_GlobalLit = gl.getUniformLocation(gl.program, "u_GlobalLit");
    if (!u_GlobalLit) {
        console.log("Failed to get the storage location of u_GlobalLit");
        return;
    }

    u_Lit = gl.getUniformLocation(gl.program, "u_Lit");
    if (!u_Lit) {
        console.log("Failed to get the storage location of u_Lit");
        return;
    }

    u_NormalMode = gl.getUniformLocation(gl.program, "u_NormalMode");
    if (!u_NormalMode) {
        console.log("Failed to get the storage location of u_NormalMode");
        return;
    }

    u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    if (!u_Sampler) {
        console.log("Failed to get the storage location of u_Sampler");
        return;
    }
}

function registerEvents() {
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

    document.getElementById("generateMapButton").onclick = function () {
        map.generate();
    };

    document.getElementById("globalLitButton").onclick = function () {
        light.setEnabled(!light.isEnabled);
    };

    document.getElementById("mapVisibleButton").onclick = function () {
        map.setVisible(!map.isVisible);
    };

    document.getElementById("normalButton").onclick = function () {
        light.setNormalMode(!light.isNormalMode);
    };

    document.getElementById("polarSlider").oninput = function () {
        light.setPositionByAngle(
            document.getElementById("polarSlider").value, 
            document.getElementById("azimuthSlider").value
        );
    };

    document.getElementById("azimuthSlider").oninput = function () {
        light.setPositionByAngle(
            document.getElementById("polarSlider").value, 
            document.getElementById("azimuthSlider").value
        );
    };

    document.getElementById("redLightSlider").oninput = function () {
        light.setColor([
            document.getElementById("redLightSlider").value, 
            document.getElementById("greenLightSlider").value,
            document.getElementById("blueLightSlider").value
        ]);
    };

    document.getElementById("redLightSlider").oninput = function () {
        light.setColor([
            document.getElementById("redLightSlider").value, 
            document.getElementById("greenLightSlider").value,
            document.getElementById("blueLightSlider").value
        ]);
    };

    document.getElementById("greenLightSlider").oninput = function () {
        light.setColor([
            document.getElementById("redLightSlider").value, 
            document.getElementById("greenLightSlider").value,
            document.getElementById("blueLightSlider").value
        ]);
    };

    document.getElementById("blueLightSlider").oninput = function () {
        light.setColor([
            document.getElementById("redLightSlider").value, 
            document.getElementById("greenLightSlider").value,
            document.getElementById("blueLightSlider").value
        ]);
    };
}

function initTextures() {
    loadTexture("floor_ground_grass.png", gl.TEXTURE0, []);
    loadTexture("floor_ground_dirt.png", gl.TEXTURE1, []);

    gl.uniform1i(u_Sampler, 0);
}

function loadTexture(path, textureUnit, extraParams) {
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
        
        for (let i = 0; i < extraParams.length; i += 2) {
            gl.texParameteri(gl.TEXTURE_2D, extraParams[i], extraParams[i + 1]);
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    }

    image.src = path;
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    initTextures();

    triangleRenderer = new TriangleRenderer();
    triangleRenderer.addMesh("leafBlock", new Cube(0));
    triangleRenderer.addMesh("dirtBlock", new Cube(1, 32.0));
    triangleRenderer.addMesh("baseSphere", new Sphere());

    camera = new Camera(60.0, [0.0, 5.0, -5.0], [0.0, 5.0, -1.0]);
    light = new Light([1.0, 1.0, 1.0], [0.0, 20.0, 0.0], [0.2, 0.2, 0.2]);
    map = new BlockMap(32, 4);
    map.generate();

    registerEvents();
    
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
    // let deltaY = y - g_mousePrevPos[1];

    camera.mousePan(deltaX);

    g_mousePrevPos = [x, y];
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
        case "KeyF":
            map.addBlock();
            break;
        case "KeyR":
            map.deleteBlock();
            break;
        default:
            break;
    }
}

function renderAllShapes() {

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // === DRAW SCENE ===
    map.render();

    light.render();

    let ball = new GameObject([0.0, 5.0, 0.0], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], 
        "baseSphere", g_colors.white, 0.0, true);
    ball.render();
}
