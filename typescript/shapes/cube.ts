import { Fragment, Model } from './model';
import { Vec4 } from '../matrices';

export class Cube extends Model {

    constructor(gl: WebGLRenderingContext) {
        const defaultColor: Vec4 = [1, 1, 1, 1];
        const A = [-1, 1, 1];
        const B = [-1, 1, -1];
        const C = [1, 1, -1];
        const D = [1, 1, 1];

        const E = [-1, -1, 1];
        const F = [-1, -1, -1];
        const G = [1, -1, -1];
        const H = [1, -1, 1];


        const topFace = [
            {
                triangle: [A, C, B],
            },
            {
                triangle: [A, D, C],
            },
        ];
        const bottomFace = [
            {
                triangle: [E, F, G],
            },
            {
                triangle: [E, G, H],
            },
        ];

        const frontFace = [
            {
                triangle: [E, D, A],
            },
            {
                triangle: [E, H, D],
            },
        ];
        const backFace = [
            {
                triangle: [C, G, F],
            },
            {
                triangle: [C, F, B],
            },
        ];

        const rightFace = [
            {
                triangle: [H, G, C],
            },
            {
                triangle: [H, C, D],
            },
        ];
        const leftFace = [
            {
                triangle: [B, E, A],
            },
            {
                triangle: [B, F, E],
            },
        ];
        const fragments: Fragment[] = 
        [].concat(frontFace, backFace, topFace, bottomFace, rightFace, leftFace);
        fragments.forEach(fr => {
            fr.color = defaultColor;
        });
        super(
            gl,
            fragments,
        );
    }

}