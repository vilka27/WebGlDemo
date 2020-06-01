import { Fragment, Model, Triangle } from './model';
import { Vec3, Vec4 } from '../matrices';

export class Octo extends Model {

    constructor(gl: WebGLRenderingContext) {
       
        const A: Vec3 = [1, 0, 0];
        const B: Vec3 = [0, -1, 0];
        const C: Vec3 = [-1, 0, 0];
        const D: Vec3 = [0, 1, 0]; 
        const E: Vec3 = [0, 0, -1];
        const F: Vec3 = [0, 0, 1];

        const triangles: Triangle[] = [
            [A, E, D], 
            [A, B, E],
            [C, D, E],
            [B, C, E],
            [A, D, F], 
            [C, F, D], 
            [B, F, C], 
            [A, F, B], 
        ];
        const color: Vec4 = [0.1, 1.0, 0.9, 1.0];
        const fragments: Fragment[] = triangles.map(tr => {
            return {
                triangle: tr,
                color,
            };
        });
        super(
            gl,
            fragments,
        );
    }

}