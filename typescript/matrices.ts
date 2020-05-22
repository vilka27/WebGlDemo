export type Mat4 = Array<number>;
export type Vec3 = Array<number>;
export type Vec4 = Array<number>;

export function identity() {
    var out = new Array<number>(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

export function translate(
    matrix: Mat4,
    vector: Vec3,
) {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    matrix[12] = matrix[0] * x + matrix[4] * y + 
        matrix[8] * z + matrix[12];
    matrix[13] = matrix[1] * x + matrix[5] * y + 
        matrix[9] * z + matrix[13];
    matrix[14] = matrix[2] * x + matrix[6] * y + 
        matrix[10] * z + matrix[14];
    matrix[15] = matrix[3] * x + matrix[7] * y + 
        matrix[11] * z + matrix[15];
}

export function scale(
    matrix: Mat4,
    scale: Vec3,
) {
    const x = scale[0];
    const y = scale[1];
    const z = scale[2];  
    matrix[0] *= x;
    matrix[1] *= x;
    matrix[2] *= x;
    matrix[3] *= x;
    matrix[4] *= y;
    matrix[5] *= y;
    matrix[6] *= y;
    matrix[7] *= y;
    matrix[8] *= z;
    matrix[9] *= z;
    matrix[10] *= z;
    matrix[11] *= z;
}

export function rotate(
    matrix: Mat4,
    rad: number,
    axis: Vec3,
) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];

    const len = 1 / Math.sqrt(x * x + y * y + z * z);
    
    x *= len;
    y *= len;
    z *= len;
  
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
  
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
  
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
  
    matrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
    matrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
    matrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
    matrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
    matrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
    matrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
    matrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
    matrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
    matrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
    matrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
    matrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
    matrix[11] = a03 * b20 + a13 * b21 + a23 * b22;
}

export function perspective(
    fovy: number,
    aspect: number,
    near: number,
    far: number,
): Mat4 {
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var matrix = new Array<number>(16);
    matrix[0] = f / aspect;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = f;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = (far + near) * nf;
    matrix[11] = -1;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 2 * far * near * nf;
    matrix[15] = 0;
    return matrix;
}

export function normalize(
    vector: Vec4,
): Vec4 {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += vector[i] * vector[i];        
    }
    sum = Math.sqrt(sum);
    for (let i = 0; i < vector.length; i++) {
        vector[i] /= sum;    
    }
    return vector;
}

export function sum(
    a: Vec4,
    b: Vec4,
): Vec4 {
    var out = new Array<number>(Math.min(a.length, b.length));
    for (let i = 0; i < out.length; i++) {
        out[i] = a[i] + b[i];    
    }
    return out;
}