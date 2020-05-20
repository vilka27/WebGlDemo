import initRenderLoop from 'webgl-demo';

function main() {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    initRenderLoop(gl);
}

export default main;