function greeter(person) {
    return "Hello, " + person;
}
let user = "Jane User";
document.body.textContent = greeter(user);
let mat4 = window.mat4;
let cubeRotation = 0.0;
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }
    return shaderProgram;
}
function tryDetectError(gl) {
    const errorCode = gl.getError();
    if (errorCode !== gl.NO_ERROR) {
        console.error(`GL ERROR OCCURED, CODE=${errorCode}`);
        [
            [gl.INVALID_ENUM, 'Invalid enum'],
            [gl.INVALID_VALUE, 'Invalid value'],
            [gl.INVALID_OPERATION, 'Invalid operation'],
            [gl.INVALID_FRAMEBUFFER_OPERATION, 'Invalid framebuffer operation'],
            [gl.OUT_OF_MEMORY, 'Out of memory'],
            [gl.CONTEXT_LOST_WEBGL, 'Context lost webgl'],
        ].filter((item) => item[0] === errorCode)
            .map((item) => item[1])
            .forEach((item) => console.error(`${errorCode} means: ${item}`));
    }
}
function drawObject(gl, viewMatrix, vertexCount, buffer, pInfo) {
    {
        const numComponents = 1;
        const type = gl.FLOAT;
        const normalize = true;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normales);
        gl.vertexAttribPointer(pInfo.attribLocations.vertexNorm, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(pInfo.attribLocations.vertexNorm);
    }
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(pInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(pInfo.attribLocations.vertexPosition);
    }
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
        gl.vertexAttribPointer(pInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(pInfo.attribLocations.vertexColor);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
    gl.uniformMatrix4fv(pInfo.uniformLocations.modelViewMatrix, false, viewMatrix);
    {
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}
function drawCube(gl, buffers, programInfo) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
    drawObject(gl, modelViewMatrix, 36, buffers[0], programInfo);
}
function drawOcto(gl, buffers, programInfo) {
    const modelViewMatrix2 = mat4.create();
    mat4.translate(modelViewMatrix2, modelViewMatrix2, [-1.0, 1.0, -5.0]);
    drawObject(gl, modelViewMatrix2, 24, buffers[1], programInfo);
}
function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const fieldOfView = 60 * (Math.PI / 180);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    drawCube(gl, buffers, programInfo);
    drawOcto(gl, buffers, programInfo);
    cubeRotation += deltaTime;
    tryDetectError(gl);
}
function createSimpleBuffer(gl, positions, indices, color, normales) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const colorBuffer = gl.createBuffer();
    const colors = (new Array(Math.ceil(positions.length / 3))).fill(color, 0).flat();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normales), gl.STATIC_DRAW);
    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        normales: normBuffer,
    };
}
function cubeBuffer(gl) {
    const indices = [
        0, 2, 3, 0, 1, 2,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ];
    const positions = [
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];
    const normales = [
        0.2, 0.2, 0.2, 0.2,
        0.3, 0.3, 0.3, 0.3,
        2, 2, 2, 2,
        0, 0, 0, 0,
        0.7, 0.7, 0.7, 0.7,
        0.5, 0.5, 0.5, 0.5,
    ];
    return createSimpleBuffer(gl, positions, indices, [1, 1, 0, 1], normales);
}
function octoBuffer(gl) {
    const i = [
        0, 3, 4,
        0, 1, 4,
        2, 3, 4,
        1, 2, 4,
        0, 3, 5,
        2, 3, 5,
        1, 2, 5,
        0, 1, 5,
    ];
    const n = [
        2,
        0.5,
        0,
        0.5,
        0.7,
        0.3,
    ];
    const p = [
        1, 0, 0,
        0, -1, 0,
        -1, 0, 0,
        0, 1, 0,
        0, 0, -1,
        0, 0, 1,
    ];
    return createSimpleBuffer(gl, p, i, [1.0, 0.0, 0.0, 1.0], n);
}
function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute lowp float aVertexNorm;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp float positionForShadow;
    varying lowp vec4 vColoraaa;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColoraaa = aVertexColor;
      positionForShadow = aVertexNorm;
    }
  `;
    const fsSource = `
    varying lowp vec4 vColoraaa;
    varying lowp float positionForShadow;
    void main(void) {
        lowp vec3 rgb = positionForShadow * vColoraaa.rgb;
        gl_FragColor = vec4(rgb, 1.0);
    }
  `;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            vertexNorm: gl.getAttribLocation(shaderProgram, 'aVertexNorm'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    const buffers = [cubeBuffer(gl), octoBuffer(gl)];
    let then = 0;
    function render(now) {
        const newNow = 0.001 * now;
        const deltaTime = newNow - then;
        then = newNow;
        drawScene(gl, programInfo, buffers, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();
