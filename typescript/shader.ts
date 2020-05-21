import  { SimpleCache } from './cache';

export class Shader {

    private loadShader(type: number, source: string): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);
    
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            throw new Error(
                `An error occurred compiling the shaders: 
                ${gl.getShaderInfoLog(shader)}`,
            );
        }
    
        return shader;
    }

    private readonly vertexShader: WebGLShader;
    private readonly fragmentShader: WebGLShader;
    private readonly program: WebGLProgram;
    private readonly attributesCache: SimpleCache<number>;
    private readonly uniformsCache: SimpleCache<WebGLUniformLocation>;

    constructor(
        private gl: WebGLRenderingContext,
        private vertexSource: string,
        private fragmentSource: string,
    ) {
        this.gl = gl;
        this.vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error(
                `Unable to initialize the shader program: `+
                gl.getProgramInfoLog(this.program),
            );
        }

        this.attributesCache = new SimpleCache((name) => 
            this.gl.getAttribLocation(this.program, name),
        );
        this.uniformsCache = new SimpleCache((name) => 
            this.gl.getUniformLocation(this.program, name),
        );
    }

    getAttribute(name: string): number {
        return this.attributesCache.get(name);
    }

    useProgram() {
        this.gl.useProgram(this.program);
    }

    setMatrix(
        name: string,
        value: any, /* TODO: strict type */
    ) {
        this.gl.uniformMatrix4fv(
            this.uniformsCache.get(name),
            false,
            value,
        );
    }

}
