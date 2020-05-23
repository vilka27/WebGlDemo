import { Model } from './model';

export class Rect extends Model {

    constructor(gl: WebGLRenderingContext) {
        const indices = [
            0, 2, 3, 0, 1, 2
        ];
        const positions = [
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0
        ];
        const normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];
        const color = [1,1,0,1];
        super(
            gl,
            positions,
            normals,
            indices,
            (new Array(Math.ceil(positions.length / 3)))
                .fill(color, 0)
                .flat(),
        );
    }

}