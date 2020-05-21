import { Shader } from './shader';

export class Model {
    private positions: any[];
    private colors: any[];
    private indices: any[];
    private normales: any[];
    private gl: WebGLRenderingContext;
    private buffers: ModelBuffers;

    constructor(gl, positions, indices, color){
        this.gl = gl;
        this.positions = positions;
        this.indices = indices;
        this.colors = (new Array(Math.ceil(positions.length / 3))).fill(color, 0).flat();
        this.normales = (new Array(Math.ceil(positions.length / 3))).fill(0.5, 0);
        this.buffers = this.bindBuffers();
    }
    private bindBuffers(): ModelBuffers{

        const position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
    
        const color = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    
        const indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    
        const normales = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normales);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normales), this.gl.STATIC_DRAW);

        return {
            position,
            color,
            indices,
            normales,
        };
    }

    draw(viewMatrix, shader: Shader ) {
        {
            const numComponents = 1;
            const type = this.gl.FLOAT;
            const normalize = true;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normales);
            this.gl.vertexAttribPointer(
                shader.getAttribute('aVertexNorm'),
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            this.gl.enableVertexAttribArray(shader.getAttribute('aVertexNorm'));
        }
        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(
                shader.getAttribute('aVertexPosition'),
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            this.gl.enableVertexAttribArray(
                shader.getAttribute('aVertexPosition'),
            );
        } {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
            this.gl.vertexAttribPointer(
                shader.getAttribute('aVertexColor'),
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            this.gl.enableVertexAttribArray(
                shader.getAttribute('aVertexColor'),
            );
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        shader.setMatrix('uModelViewMatrix', viewMatrix);
         {
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, type, offset);
        }
    }
}

interface ModelBuffers{
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
    normales: WebGLBuffer;
}
