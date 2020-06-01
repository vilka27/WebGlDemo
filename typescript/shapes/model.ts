import { Shader } from '../shaders/shader';
import { buildVector, Mat4, normalizeVec3, Vec3, Vec4, vectorProduct } from '../matrices';


interface ModelBuffers{
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
    normales: WebGLBuffer;
}
export interface IModel{
    draw: (viewMatrix: Mat4, shader: Shader ) => void;
}
export class Model implements IModel{
    private readonly gl: WebGLRenderingContext;
    private readonly buffers: ModelBuffers;
    private readonly vertexCount: number;

    constructor(gl: WebGLRenderingContext, fragments: Fragment[], normales?: number[]) {

        this.gl = gl;
        const triangles = fragments.map(fr => {
            return fr.triangle;
        });
        
        const positions: number[] = triangles
            .flat()
            .flat()
            .map(a => a * 1.0);
        const indices = triangles
            .map((_tr, i) => {
                return [i * 3, i * 3 + 1, i * 3 + 2];
            })
            .flat()
            .map(a => a * 1.0);
        const newColors = fragments
            .map(fr => {
                return fr.triangle.map(point => {
                    return fr.color || [1, 1, 1, 1];
                });
            })
            .flat(2)
            .map(a => a * 1.0);
        const newNormales = normales || this.calcNormales(triangles);
        this.buffers = this.bindBuffers(positions, indices, newColors, newNormales);
        this.vertexCount = indices.length;
    }

    calcNormales(triangles: Triangle[]): number[] {
        return triangles.map(tr => {
            const norms = tr.map(point => {
                return getNormale(tr);
            });
            return norms;
        }).flat(2);
    }
    private bindBuffers(p: number[], i: number[], c: number[], n: number[]): ModelBuffers {
        const position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            p,
        ), this.gl.STATIC_DRAW);
    
        const color = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            c,
        ), this.gl.STATIC_DRAW);
    
        const normales = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normales);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
            n,
        ), this.gl.STATIC_DRAW);

        const indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(
            i,
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
                this.vertexCount, type, offset,
            );
        }
    }

    
}
export type Triangle = [Vec3, Vec3, Vec3];

export type Fragment = {
    triangle: Triangle;
    color?: Vec4;
};

function getNormale(tr: Triangle): Vec3 {
    const vec1 = buildVector(tr[0], tr[1]);
    const vec2 = buildVector(tr[0], tr[2]);
    const normale = vectorProduct(vec1, vec2);
    return normalizeVec3(normale);
}
