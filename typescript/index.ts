import initRenderLoop from 'webgl-demo';

function main() {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const pressedKeysMap = new Map<number, boolean>();    
    document.addEventListener('keydown', event => { 
        pressedKeysMap[event.keyCode] = true
    }, false);
    document.addEventListener('keyup', event => {
        pressedKeysMap[event.keyCode] = false
    }, false);

    initRenderLoop(gl, pressedKeysMap);
}

export default main;