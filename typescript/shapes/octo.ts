import { Model } from './model';

export class Octo extends Model {

    constructor(gl: WebGLRenderingContext) {
        const i = [
            0, 3, 4,
            0, 1, 4,
            2, 3, 4,
            1, 2, 4,
            0, 3, 5,
            2, 3, 5,
            1, 2, 5,
            0, 1, 5,
        ];
    
        const p = [
            1, 0, 0, // A
            0, -1, 0, // B
            -1, 0, 0, // C
            0, 1, 0, // D
            0, 0, -1, // E
            0, 0, 1, // F
        ];

        const normales = [
            1, 0, 0,
            0, -1, 0,
            -1, 0, 0,
            0, 1, 0,
            0, 0, -1,
            0, 0, 1,
        ];
        super(
            gl,
            p,
            normales,
            i,
            [1.0, 0.0, 0.0, 1.0],
        );
    }

}