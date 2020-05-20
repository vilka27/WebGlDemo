import  { Shader } from './shader';
import  { DefaultShader } from './defaultShader';
import { Model } from './model';

let mat4 = (window as any).mat4;
let cubeRotation = 0.0;

function tryDetectError(gl:WebGLRenderingContext) {
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
function getCubeMatrix(){
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
    return modelViewMatrix;
}
function getOctoMatrix(){
    const modelViewMatrix2 = mat4.create();
    mat4.translate(modelViewMatrix2, // destination matrix
        modelViewMatrix2, // matrix to translate
        [-1.0, 1.0, -5.0]); // amount to translate
        return modelViewMatrix2;
}
function drawScene(
    gl: WebGLRenderingContext,
    shader: Shader,
    deltaTime: number,
    models: Model[],
) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 60 * (Math.PI / 180); // in radians
    const canvas = gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
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

    models[0].draw(getCubeMatrix(),shader);
    models[1].draw(getOctoMatrix(),shader);

    cubeRotation += deltaTime;

    tryDetectError(gl);
}
function getCubeModel(gl:WebGLRenderingContext):Model{
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
    return new Model(gl,positions,indices,[1,1,0,1]);
}
function getOctoModel(gl:WebGLRenderingContext):Model{
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

    const p = [
        1, 0, 0, // A
        0, -1, 0, // B
        -1, 0, 0, // C
        0, 1, 0, // D
        0, 0, -1, // E
        0, 0, 1, // F
    ];
    return new Model(gl,p,i,[1.0, 0.0, 0.0, 1.0]);
}
function initRenderLoop(gl:WebGLRenderingContext) {
    const shader = new DefaultShader(gl);
    let then = 0;

    function render(now: number) {
        const newNow = 0.001 * now; // convert to seconds
        const deltaTime = newNow - then;
        then = newNow;

        const models = [ getCubeModel(gl), getOctoModel(gl) ];

        drawScene( gl, shader, deltaTime, models );
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

export default initRenderLoop;
