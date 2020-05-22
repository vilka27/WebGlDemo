import  { Shader } from './shaders/shader';
import  { DefaultShader } from './shaders/defaultShader';
import { Model } from './shapes/model';
import { Cube } from './shapes/cube';
import { Octo } from './shapes/octo';
import { Octo2 } from './shapes/octo2';

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
        cubeRotation * 0.2, // amount to rotate in radians
        [0, 1, 0]); // axis to rotate around (X)
    return modelViewMatrix;
}
function getOctoMatrix(){
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-1.0, 1.0, -5.0]); // amount to translate

    console.log(modelViewMatrix);

    return modelViewMatrix;
}
function getOctoMatrix2(){
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-4.0, 1.0, -8.0]); // amount to translate

    console.log(modelViewMatrix);

    return modelViewMatrix;
}
function drawScene(
    gl: WebGLRenderingContext,
    shader: Shader,
    deltaTime: number,
    models: Model[],
    time: number,
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

    const viewMatrix = mat4.create();
    shader.setMatrix('uViewMatrix', viewMatrix);

    const circleTime = (time % 8) / 8;
    const piTime = Math.PI * 2 * circleTime;
    const sinTime = Math.sin(piTime);
    const cosTime = Math.cos(piTime);

    shader.setVector4f(
        'lightDirection',
        [sinTime, cosTime, 0.8, 0.0],
    );

    models[0].draw(getCubeMatrix(),shader);
    models[1].draw(getOctoMatrix(),shader);
    models[2].draw(getOctoMatrix2(),shader);

    cubeRotation += deltaTime;

    tryDetectError(gl);
}
function initRenderLoop(gl:WebGLRenderingContext) {
    const shader = new DefaultShader(gl);
    let then = 0;

    function render(now: number) {
        const newNow = 0.001 * now; // convert to seconds
        const deltaTime = newNow - then;
        then = newNow;

        const cubeModel = new Cube(gl);
        const octoModel = new Octo(gl);
        const octoModel2 = new Octo2(gl);

        const models = [ cubeModel, octoModel, octoModel2 ];

        drawScene( gl, shader, deltaTime, models, newNow );
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

export default initRenderLoop;
