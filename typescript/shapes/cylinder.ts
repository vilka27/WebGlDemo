import { Fragment, Model, Triangle } from './model';
import { normalizeVec3, Vec4 } from '../matrices';

export class Cylinder extends Model {

    constructor(gl: WebGLRenderingContext) {
        const anglesAmount = 16;

        const items: number[][] = [];

        for (let i = 0; i <= anglesAmount; i++) {
            const angle = i * Math.PI * 2 / anglesAmount;
            const x = Math.sin(angle);
            const y = Math.cos(angle);
            items.push([x, y]);
        }

        const points: number[][] = [];

        for (let i = 0; i < anglesAmount; i++) {
            const a = items[i];
            const b = items[i + 1];

            const x1 = a[0];
            const x2 = b[0];
            const y1 = a[1];
            const y2 = b[1];

            const E = [ x1, y1, -1.0 ];
            const F = [ x1, y1, 1.0];
            const G = [ x2, y2, 1.0 ];
            const H = [x2, y2, -1.0];           

            const O1 = [0, 0, 1.0];
            const O2 = [0, 0, -1.0];


            points.push(E);
            points.push(F);
            points.push(H);

            points.push(F);
            points.push(G);
            points.push(H);

            points.push(F);
            points.push(O1);
            points.push(G);

            points.push(H);
            points.push(O2);
            points.push(E);
        }

        const defaultColor: Vec4 = [0.2, 0.2, 1.0, 1.0];

        const triangles: Triangle[] = points.groupBy(3);
        
        const fragments: Fragment[] = triangles.map(tr => {
            return {
                triangle: tr,
                color: defaultColor,
            };
        });
        super(
            gl,
            fragments,
        );
    }

}