import { Fragment, Model, Triangle } from './model';
import { normalizeVec3, sum, Vec3, Vec4 } from '../matrices';

function genTriangles(initial: number[]): number[] {
    const newArray: number[][] = [];
    for (let i = 0; i < initial.length; i += 9) {

        const a: Vec3 = [
            initial[i + 0],
            initial[i + 1],
            initial[i + 2],
        ];
        const b: Vec3  = [
            initial[i + 3],
            initial[i + 4],
            initial[i + 5],
        ];
        const c: Vec3  = [
            initial[i + 6],
            initial[i + 7],
            initial[i + 8],
        ];

        const d: Vec3 = normalizeVec3(sum(a, b));
        const e: Vec3 = normalizeVec3(sum(b, c));
        const f: Vec3 = normalizeVec3(sum(a, c));

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

export class Sphere extends Model {

    constructor(gl: WebGLRenderingContext) {
        
        const A: Vec3 = [1, 0, 0];
        const B: Vec3 = [0, -1, 0];
        const C: Vec3 = [-1, 0, 0];
        const D: Vec3 = [0, 1, 0]; 
        const E: Vec3 = [0, 0, -1];
        const F: Vec3 = [0, 0, 1];

        const trs: Triangle[] = [
            [A, E, D], 
            [A, B, E],
            [C, D, E],
            [B, C, E],
            [A, D, F], 
            [C, F, D], 
            [B, F, C], 
            [A, F, B], 

        ];
        let itri: number[] = trs.flat().flat();

        for (let i = 0; i < 2; i++) {
            itri = genTriangles(itri);
        }

        const color: Vec4 = [1.0, 0.0, 0.0, 1.0];

        const points: Vec3[] = itri.groupBy(3);

        const triangles: Triangle[] = points.groupBy(3);

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
