import { Model } from './model';
import { normalize, sum } from '../matrices';

function genTriangles(initial: number[]): number[] {
    let newArray: number[][] = [];
    for (let i = 0; i < initial.length; i += 9) {

        const a = [
            initial[i+0],
            initial[i+1],
            initial[i+2],
        ];
        const b = [
            initial[i+3],
            initial[i+4],
            initial[i+5],
        ];
        const c = [
            initial[i+6],
            initial[i+7],
            initial[i+8],
        ];

        const d = normalize(sum(a, b));
        const e = normalize(sum(b, c));
        const f = normalize(sum(a, c));

        newArray.push(a);
        newArray.push(d);
        newArray.push(f);

        newArray.push(d);
        newArray.push(b);
        newArray.push(e);

        newArray.push(f);
        newArray.push(e);
        newArray.push(c);

        newArray.push(d);
        newArray.push(e);
        newArray.push(f);
    }
    return newArray.flat();
}

function genNormales(triangles: number[]): number[] {
    let normales: number[][] = [];
    for (let i = 0; i < triangles.length; i += 9) {
        const a = [
            triangles[i+0],
            triangles[i+1],
            triangles[i+2],
        ];
        const b = [
            triangles[i+3],
            triangles[i+4],
            triangles[i+5],
        ];
        const c = [
            triangles[i+6],
            triangles[i+7],
            triangles[i+8],
        ];
        const avg = (sum(a, sum(b, c)));
        normales.push(avg);
        normales.push(avg);
        normales.push(avg);
    }
    return normales.flat();
}

export class Sphere extends Model {


    constructor(gl: WebGLRenderingContext) {
   
        let itri = [            
            0,  0, 1,
            0, -1, 0,
            1,  0, 0,

            0, 0, 1,
            1, 0, 0,
            0, 1, 0,

            0,  0, 1,
            -1,  0, 0,
            0, -1, 0,

            0, 0, 1,
            0, 1, 0,
            -1, 0, 0,

            0,  0, -1,
            1,  0, 0,
            0, -1, 0,

            1, 0, 0,
            0, 0, -1,
            0, 1, 0,

            0,  0, -1,
            0, -1, 0,
            -1,  0, 0,

            0, 0, -1,
            -1, 0, 0,
            0, 1, 0,
        ];

        for (let i = 0; i < 5; i++) {
            itri = genTriangles(itri);
        }

        const normales = genNormales(itri);

        let indices = [];
        for (let i = 0; i < normales.length; i+=3) {
            indices.push(i/3);
        }
        const color = [1.0, 0.0, 0.0, 1.0];

        super(
            gl,
            itri,
            normales,
            indices,
            (new Array(Math.ceil(itri.length / 3)))
                .fill(color, 0)
                .flat(),
        );
    }

}