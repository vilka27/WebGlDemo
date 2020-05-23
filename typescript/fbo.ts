export class FBO {


    private fb: WebGLFramebuffer;
    private targetTexture: WebGLTexture
    private depthBuffer: WebGLRenderbuffer

    constructor(
        private gl: WebGLRenderingContext,
        public width: number,
        public height: number
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        // create to render to
        this.targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);

        this.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);

        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border,
                        format, type, data);

        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
            gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
            gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
            gl.CLAMP_TO_EDGE);
        

        // Create and bind the framebuffer
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(
        gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D,
            this.targetTexture, level
        );

        gl.renderbufferStorage(gl.RENDERBUFFER,
            gl.DEPTH_COMPONENT16,
            width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER,
        this.depthBuffer);
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
    
        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.width, this.height);
    
        // Clear the attachment(s).
        this.gl.clearColor(0, 0, 1, 1);   // clear to blue
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | 
            this.gl.DEPTH_BUFFER_BIT);            
    }

    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    bindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
    }

}