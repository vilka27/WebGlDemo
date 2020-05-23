export type Mat4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];

export function identity(): Mat4 {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}

export function translate(matrix: Mat4, vector: Vec3) {
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

export function scale(matrix: Mat4, scale: Vec3) {
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

export function rotate(matrix: Mat4, rad: number, axis: Vec3) {
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

export function perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    const matrix: Mat4 = [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0,
    ];
    return matrix;
}


export function ortho(
    left,
    right,
    bottom,
    top,
    near,
    far,
): Mat4 {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    return [
        -2 * lr, 0, 0, 0,
        0, -2 * bt, 0, 0,
        0, 0, 2 * nf, 0,
        (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
        ];
}

export function normalizeVec3(vector: Vec3): Vec3 {
    const sumQ = vector[0] * vector[0]
        + vector[1] * vector[1]
        + vector[2] * vector[2]; //vector[0] * vector[2];
    const rLength = Q_rsqrt(sumQ);

    return [
        vector[0] * rLength,
        vector[1] * rLength,
        vector[2] * rLength,
    ];
}

const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const floatView = new Float32Array(bytes);
const intView = new Uint32Array(bytes);
const threehalfs = 1.5;

function Q_rsqrt(n: number) {
  const x2 = n * 0.5;
  floatView[0] = n;
  intView[0] = 0x5f3759df - ( intView[0] >> 1 );
  let y = floatView[0];
  y = y * ( threehalfs - ( x2 * y * y ) );

  return y;
}

export function sum(a: Vec3, b: Vec3): Vec3 {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
    ];
}

export function vectorProduct(a: Vec3, b: Vec3): Vec3 {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

export function buildVector(from: Vec3, to: Vec3): Vec3 {
    return [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
}
export function multiplyMat4(out: Mat4, a: Mat4, b: Mat4): Mat4 {
    const a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    const a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    const a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    const a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
  
    // Cache only the current line of the second matrix
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }

export function scewY(out: Mat4, y: number): Mat4 {

    out[0] += y * out[4];
    out[1] += y * out[5];
    out[2] += y * out[6];
    out[3] += y * out[7];

    return out;
  }
export function scewX(out: Mat4, x: number): Mat4 {
    out[4] += x * out[0];
    out[5] += x * out[1];
    out[6] += x * out[2];
    out[7] += x * out[3];
    return out;
  }

export function scewZ(out: Mat4, z: number): Mat4 {
    out[0] += z * out[8];
    out[1] += z * out[9];
    out[2] += z * out[10];
    out[3] += z * out[11];
  
    return out;
  }