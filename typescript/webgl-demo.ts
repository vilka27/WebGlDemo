import  { Shader } from './shader';
import  { DefaultShader } from './defaultShader';

let mat4 = (window as any).mat4;
let cubeRotation = 0.0;

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
function drawObject(gl, viewMatrix, vertexCount, buffer,
    shader: Shader
    ) {
    // second draw
    {
        const numComponents = 1;
        const type = gl.FLOAT;
        const normalize = true;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normales);
        gl.vertexAttribPointer(
            shader.getAttribute('aVertexNorm'),
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        gl.enableVertexAttribArray(shader.getAttribute('aVertexNorm'));
    }
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(
            shader.getAttribute('aVertexPosition'),
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        gl.enableVertexAttribArray(
            shader.getAttribute('aVertexPosition'),
        );
    } {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
        gl.vertexAttribPointer(
            shader.getAttribute('aVertexColor'),
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        gl.enableVertexAttribArray(
            shader.getAttribute('aVertexColor'),
        );
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
    shader.setMatrix('uModelViewMatrix', viewMatrix);
     {
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}
function drawCube(gl, buffers, shader: Shader) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]); // amount to translate
    mat4.rotate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1]); // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.7, // amount to rotate in radians
        [0, 1, 0]); // axis to rotate around (X)

    drawObject(gl, modelViewMatrix, 36, buffers[0], shader);
}
function drawOcto(gl, buffers, shader: Shader) {
    const modelViewMatrix2 = mat4.create();
    mat4.translate(modelViewMatrix2, // destination matrix
        modelViewMatrix2, // matrix to translate
        [-1.0, 1.0, -5.0]); // amount to translate
    drawObject(gl, modelViewMatrix2, 24, buffers[1], shader);
}
function drawScene(
    gl,
    shader: Shader,
    buffers,
    deltaTime
) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 60 * (Math.PI / 180); // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    shader.useProgram();
    shader.setMatrix('uProjectionMatrix', projectionMatrix);

    drawCube(gl, buffers, shader);
    drawOcto(gl, buffers, shader);

    cubeRotation += deltaTime;

    tryDetectError(gl);
}

function createSimpleBuffer(gl, positions, indices, color:any[], normales) {
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
        0, 2, 3, 0, 1, 2, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];
    const positions = [
        -1.0, -1.0, 1.0, // (x, y, z) - 1 вершина
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right fac
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
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
        1, 0, 0, // A
        0, -1, 0, // B
        -1, 0, 0, // C
        0, 1, 0, // D
        0, 0, -1, // E
        0, 0, 1, // F
    ];

    return createSimpleBuffer(gl, p, i, [1.0, 0.0, 0.0, 1.0], n);
}
function main() {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const shader = new DefaultShader(gl);

    const buffers = [cubeBuffer(gl), octoBuffer(gl)];
    let then = 0;

    function render(now) {
        const newNow = 0.001 * now; // convert to seconds
        const deltaTime = newNow - then;
        then = newNow;

        drawScene(gl, shader, buffers, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

export default main;
