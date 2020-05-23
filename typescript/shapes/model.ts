import { Shader } from '../shaders/shader';

export class Model {
    private gl: WebGLRenderingContext;
    buffers: ModelBuffers;

    constructor(
        gl,
        private positions: number[],
        private normales: number[],
        public indices: number[],
        private colors: number[],
    ) {
        this.gl = gl;
        this.indices = indices;
        this.positions = positions.map(a => a * 1.0 );
        this.normales = normales.map(a => a * 1.0 );
        this.colors = colors.map(a => a * 1.0 );        
        
        this.buffers = this.bindBuffers();
    }
    private bindBuffers(): ModelBuffers{

        const position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            this.positions,
        ), this.gl.STATIC_DRAW);
    
        const color = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            this.colors,
        ), this.gl.STATIC_DRAW);
    
        const normales = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normales);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            this.normales,
        ), this.gl.STATIC_DRAW);

        const indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(
            this.indices,
        ), this.gl.STATIC_DRAW);
    
        return {
            position,
            color,
            indices,
            normales,
        };
    }

    draw(viewMatrix, shader: Shader ) {
        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = true;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.buffers.normales);
            this.gl.vertexAttribPointer(
                shader.getAttribute('aVertexNorm'),
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            this.gl.enableVertexAttribArray(
                shader.getAttribute('aVertexNorm'),
            );
        }
        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.buffers.position);
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
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.buffers.color);
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
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 
        this.buffers.indices);
        shader.setMatrix('uModelMatrix', viewMatrix);
         {
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES,
                this.indices.length, type, offset,
            );
        }
    }
}

interface ModelBuffers{
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
    normales: WebGLBuffer;
}
