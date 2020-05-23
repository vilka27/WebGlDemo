import  { Shader } from './shaders/shader';
import  { DefaultShader } from './shaders/defaultShader';
import  { TexturedShader } from './shaders/texturedShader';
import { Model } from './shapes/model';
import { Cube } from './shapes/cube';
import { Sphere } from './shapes/sphere';
import { Octo2 } from './shapes/octo2';
import { Rect } from './shapes/rect';
import { Mat4, Vec4 } from './matrices';
import { FBO } from './fbo';
import { 
    identity, ortho, perspective, rotate, scale, translate,
 } from './matrices';
import { Cylinder } from './shapes/cylinder';

let cubeRotation = 0.0;
let yAngle = 0.0;
let distance = 6.0;

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
function getCubeMatrix() {
    const modelMatrix = identity();
    translate(modelMatrix, [2.0, 0.0, 0.0]);
    rotate(modelMatrix, cubeRotation, [0, 0, 1]);
    rotate(modelMatrix, cubeRotation * 0.2, [0, 1, 0]);
    return modelMatrix;
}

function getOctoMatrix() {
    const modelMatrix = identity();
    translate(modelMatrix, [0.0, 1.0, 0.0]);
    rotate(modelMatrix, cubeRotation * 0.2, [1, 0, 0]);
    return modelMatrix;
}
function getOctoMatrix2() {
    const modelMatrix = identity();
    scale(modelMatrix, [2.0, 1.0, 1.0]);
    translate(modelMatrix,  [-1.0, 1.0, 0.0]);
    rotate(modelMatrix, cubeRotation * 0.2, [1, 0, 0]);
    return modelMatrix;
}
function getCylinderMatrix() {
    const modelMatrix = identity();
    scale(modelMatrix, [1.0, 1.0, 0.5]);
    translate(modelMatrix,  [1.0, -1.0, 0.0]);
    rotate(modelMatrix, cubeRotation * 0.7, [1, 0, 0]);
    return modelMatrix;
}
function drawScene(
    gl: WebGLRenderingContext,
    shader: Shader,
    models: Model[],
    viewMatrix: Mat4,
    time: number,
) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 60 * (Math.PI / 180); // in radians
    const canvas = gl.canvas as HTMLCanvasElement;
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const zNear = 0.1;
    const zFar = 100.0;    
    const projectionMatrix = perspective(
        fieldOfView,
        aspect,
        zNear,
        zFar,
    );

    shader.useProgram();

    shader.setMatrix('uProjectionMatrix', projectionMatrix);
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
    models[3].draw(getCylinderMatrix(),shader);

    tryDetectError(gl);
}
function drawFBO(gl:WebGLRenderingContext, texturedShader: TexturedShader, rect: Rect, fboX: FBO, fboY: FBO, fboZ: FBO) {
    texturedShader.useProgram();
    texturedShader.set1i('u_texture', 0);  
    rect.bind(texturedShader.getAttribute('aVertexPosition')); 
    function draw(fbo: FBO, x: number) {
        fbo.bindTexture()
        let orto = ortho(-3.0, 3.0, -3.0, 3.0, 0.0, 100.0,);
        translate(orto, [x, -3.0, 0.0],);
        texturedShader.setMatrix('u_matrix', orto);
        rect.draw();
    }
    draw(fboX, -3.0);
    draw(fboY, -2.0);
    draw(fboZ, -1.0);
}

function handleKeyboard(pressedKeysMap: Map<number, boolean>) {
    const A = 65;
    const D = 68;
    const W = 87;
    const S = 83;
    if (pressedKeysMap[A]) {
        yAngle -= 0.02;
    }
    if (pressedKeysMap[D]) {
        yAngle += 0.02;
    }
    if (pressedKeysMap[W]) {
        distance -= 0.02;
    }
    if (pressedKeysMap[S]) {
        distance += 0.02;
    }
}

function initRenderLoop(gl:WebGLRenderingContext, pressedKeysMap: Map<number, boolean>) {
    const basicShader = new DefaultShader(gl);
    const texturedShader = new TexturedShader(gl);
    let then = 0;

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    const cubeModel = new Cube(gl);
    const octoModel = new Sphere(gl);
    const octoModel2 = new Octo2(gl);
    const cylinderModel = new Cylinder(gl);

    const rect = new Rect(gl);

    const fboX =  new FBO(gl, 512, 512);
    const fboY =  new FBO(gl, 512, 512);
    const fboZ =  new FBO(gl, 512, 512);

    const models = [ cubeModel, octoModel, octoModel2, cylinderModel ];

    const canvas = gl.canvas as HTMLCanvasElement;

    function render(now: number) {

        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;
        if (canvas.width  != displayWidth ||
            canvas.height != displayHeight) {    
          canvas.width  = displayWidth;
          canvas.height = displayHeight;
        }

        handleKeyboard(pressedKeysMap);

        const newNow = 0.001 * now; // convert to seconds
        const deltaTime = newNow - then;

        cubeRotation += deltaTime;

        then = newNow;

        {
            fboX.bind();
            const viewMatrix = identity();
            translate(viewMatrix, [0, 0, -distance]);
            drawScene( gl, basicShader, models, viewMatrix, newNow );
            fboX.unbind();
        }
        {
            fboY.bind();
            const viewMatrix = identity();
            translate(viewMatrix, [0, 0, -distance]);
            rotate(viewMatrix, Math.PI/2, [0, 1, 0]);
            drawScene( gl, basicShader, models, viewMatrix, newNow );
            fboY.unbind();
        }
        {
            fboZ.bind();
            const viewMatrix = identity();
            translate(viewMatrix, [0, 0, -distance]);
            rotate(viewMatrix, Math.PI/2, [1, 0, 0]);
            drawScene( gl, basicShader, models, viewMatrix, newNow );
            fboZ.unbind();
        }

        gl.viewport(
            0, 0,
            gl.drawingBufferWidth, gl.drawingBufferHeight,
        );
        const viewMatrix = identity();
        translate(viewMatrix, [0, 0, -distance]);
        rotate(viewMatrix, yAngle, [0, 1, 0]);
        drawScene( gl, basicShader, models, viewMatrix, newNow );

        drawFBO(gl, texturedShader, rect, fboX, fboY, fboZ);


        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

export default initRenderLoop;
