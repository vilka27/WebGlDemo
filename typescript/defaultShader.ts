import  { Shader } from './shader';

export class DefaultShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        super(
            gl,
            `
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
          `,
          `
          varying lowp vec4 vColoraaa;
          varying lowp float positionForShadow;
          void main(void) {
              lowp vec3 rgb = positionForShadow * vColoraaa.rgb;
              gl_FragColor = vec4(rgb, 1.0);
          }
        `,
        );
    }

}