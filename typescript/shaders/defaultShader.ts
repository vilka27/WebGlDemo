import  { Shader } from './shader';

export class DefaultShader extends Shader {

    constructor(gl: WebGLRenderingContext) {
        super(
            gl,
            `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            attribute vec4 aVertexNorm;

            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying lowp vec4 worldNormal;

            varying lowp vec4 vColor;

            void main(void) {
              gl_Position = uProjectionMatrix * 
                            uViewMatrix * 
                            uModelMatrix * 
                            aVertexPosition;
            
              lowp vec4 norm = vec4(aVertexNorm.xyz, 0.0); 
              worldNormal = uModelMatrix * normalize(norm);

              vColor = aVertexColor;
            }
          `,
          `
          varying lowp vec4 vColor;
          varying lowp vec4 worldNormal;

          uniform lowp vec4 lightDirection;

          void main(void) {
              lowp float dp = dot(
                  normalize(worldNormal),
                  normalize(lightDirection)
              ) * 0.6 + 0.4;
              lowp vec3 rgb = dp * vColor.rgb;
              gl_FragColor = vec4(rgb, 1.0);
          }
        `,
        );
    }

}