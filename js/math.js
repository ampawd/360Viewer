'use strict';

/**
 * @author: Aram Gevorgyan
 * @creation date: December 2015
 */


const degToRad = Math.PI / 180.0;
const radToDeg = 180.0 / Math.PI;

/**
 *  Vec2 class
 *  2 dimensional affine vector
 */
function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

Vec2.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2.prototype.add = function(v) {
    return new
    Vec2(this.x + v.x, this.y + v.y);
};

Vec2.prototype.sub = function(v) {
    return new
    Vec2(this.x - v.x, this.y - v.y);
};

Vec2.prototype.multScalar = function(scalarValue) {
    return new
    Vec2(this.x * scalarValue, this.y * scalarValue);
};

Vec2.prototype.normalize = function() {
    var invLength = 1 / this.length();
    this.x *= invLength;
    this.y *= invLength;
    return this;
};

Vec2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

Vec2.prototype.copy = function() {
    return new Vec2(this.x, this.y);
};

Vec2.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
};


/**
 *  Vec3 class
 *  3 dimensional affine vector
 */
function Vec3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vec3.prototype.add = function(v) {
    return new
    Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
};

Vec3.prototype.sub = function(v) {
    return new
    Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
};

Vec3.prototype.multScalar = function(scalarValue) {
    return new
    Vec3(this.x * scalarValue, this.y * scalarValue, this.z * scalarValue);
};

Vec3.prototype.normalize = function() {
    var invLength = 1 / this.length();
    this.x *= invLength;
    this.y *= invLength;
    this.z *= invLength;
    return this;
};

Vec3.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.x;
};

Vec3.prototype.cross = function(v) {
    return new
    Vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.y, this.x * v.y - this.y * v.x);
};

Vec3.prototype.copy = function() {
    return new Vec3(this.x, this.y, this.z);
};

Vec3.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

/**
 *  Vec4 class
 *  4 dimensional homogenius vector
 */
function Vec4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vec4.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

Vec4.prototype.add = function(v) {
    return new
    Vec3(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
};

Vec4.prototype.sub = function(v) {
    return new
    Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
};

Vec4.prototype.multScalar = function(scalarValue) {
    return new
    Vec4(this.x * scalarValue, this.y * scalarValue, this.z * scalarValue, this.w * scalarValue);
};

Vec4.prototype.normalize = function() {
    var invLength = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x *= invLength;
    this.y *= invLength;
    this.z *= invLength;
    return this;
};

Vec4.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.x + this.w * v.w;
};

Vec4.prototype.copy = function() {
    return new
    Vec4(this.x, this.y, this.z, this.w);
};

Vec4.prototype.set = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
};

/////////////////////////////////////////////////   Matrices basic math operations  /////////////////////////////////////////////////
//  all matrices are stored in column-major order
/**
 *  Mat2 class
 *  2x2 column-major matrix
 */
function Mat2(initMat) {
    this.elements = typeof initMat === 'undefined' ?
        new Float32Array([
            1, 0,
            0, 1
        ]) :
        new Float32Array(initMat);
}

Mat2.prototype.identity = function() {
    this.elements[0] = this.elements[3] = 1;
    this.elements[1] = this.elements[2] = 0;
};

Mat2.prototype.add = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat2([
        a[0] + b[0], a[2] + b[2],
        a[1] + b[1], a[3] + b[3]
    ]);
};

Mat2.prototype.sub = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat2([
        a[0] - b[0], a[2] - b[2],
        a[1] - b[1], a[3] - b[3]
    ]);
};

Mat2.prototype.multScalar = function(value) {
    var a = this.elements;
    return new Mat2([
        a[0] * value, a[2] * value,
        a[1] * value, a[3] * value
    ]);
};

Mat2.prototype.mult = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat2([
        a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3]
    ]);
};

Mat2.prototype.multv2 = function(v) {
    var a = this.elements;
    return new Vec2(
        a[0] * v.x + a[2] * v.y,
        a[1] * v.x + a[3] * v.y
    );
};

Mat2.prototype.transpose = function() {
    var a = this.elements,
        temp;
    temp = a[2];
    a[2] = a[1];
    a[1] = temp;
};

Mat2.prototype.determinant = function() {
    var a = this.elements;
    return a[0] * a[3] - a[2] * a[1];
};

Mat2.prototype.getInverse = function() {
    var invOut,
        d = this.determinant(),
        a = this.elements;

    if (d === 0) {
        console.log("determinant is 0");
        return false;
    }

    d = 1 / d;
    invOut = [
        a[3], -a[1], -a[2], a[0]
    ];

    for (var i = 0; i < 4; i++) {
        invOut[i] *= d;
    }

    return new Mat2(invOut);
};

Mat2.prototype.print = function() {
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            console.log(this.elements[i * 2 + j]);
        }
        console.log('\n');
    }
};

Mat2.prototype.copy = function() {
    var a = this.elements;
    return new Mat2([a[0], a[1], a[2], a[3]]);
};


/**
 *  Mat3 class
 *  3x3 column-major matrix
 */
function Mat3(initMat) {
    this.elements = typeof initMat === 'undefined' ?
        new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]) :
        new Float32Array(initMat);
}

Mat3.prototype.identity = function() {
    this.elements[0] = this.elements[4] = this.elements[8] = 1;
    this.elements[1] = this.elements[2] = this.elements[3] = this.elements[5] = this.elements[6] = this.elements[7] = 0;
};

Mat3.prototype.set = function(s11, s12, s13, s21, s22, s23, s31, s32, s33) {
    var a = this.elements;
    a[0] = s11;
    a[3] = s12;
    a[6] = s13;
    a[1] = s21;
    a[4] = s22;
    a[7] = s23;
    a[2] = s31;
    a[5] = s32;
    a[8] = s33;
};

Mat3.prototype.add = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat3([
        a[0] + b[0], a[3] + b[3], a[6] + b[6],
        a[1] + b[1], a[4] + b[4], a[7] + b[7],
        a[2] + b[2], a[5] + b[5], a[8] + b[8]
    ]);
};

Mat3.prototype.sub = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat3([
        a[0] - b[0], a[3] - b[3], a[6] - b[6],
        a[1] - b[1], a[4] - b[4], a[7] - b[7],
        a[2] - b[2], a[5] - b[5], a[8] - b[8]
    ]);
};

Mat3.prototype.multScalar = function(value) {
    var a = this.elements;
    return new Mat3([
        a[0] * value, a[3] * value, a[6] * value,
        a[1] * value, a[4] * value, a[7] * value,
        a[2] * value, a[5] * value, a[8] * value,
    ]);
};

Mat3.prototype.mult = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat3([
        a[0] * b[0] + a[3] * b[1] + a[6] * b[2], a[1] * b[0] + a[4] * b[1] + a[7] * b[2], a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
        a[0] * b[3] + a[3] * b[4] + a[6] * b[5], a[1] * b[3] + a[4] * b[4] + a[7] * b[5], a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
        a[0] * b[6] + a[3] * b[7] + a[6] * b[8], a[1] * b[6] + a[4] * b[7] + a[7] * b[8], a[2] * b[6] + a[5] * b[7] + a[8] * b[8]
    ]);
};

Mat3.prototype.multv3 = function(v) {
    var a = this.elements;
    return new Vec3(
        a[0] * v.x + a[3] * v.y + a[6] * v.z,
        a[1] * v.x + a[4] * v.y + a[7] * v.z,
        a[2] * v.x + a[5] * v.y + a[8] * v.z
    );
};

Mat3.prototype.transpose = function() {
    var a = this.elements,
        temp;
    temp = a[3];
    a[3] = a[1];
    a[1] = temp;
    temp = a[6];
    a[6] = a[2];
    a[2] = temp;
    temp = a[7];
    a[7] = a[5];
    a[5] = temp;
};

Mat3.prototype.determinant = function() {
    var a = this.elements;
    return a[0] * a[4] * a[8] - a[0] * a[7] * a[5] - a[3] * a[1] * a[8] + a[3] * a[7] * a[2] + a[6] * a[1] * a[5] - a[6] * a[4] * a[2];
};

Mat3.prototype.getInverse = function() {
    var invOut,
        d = this.determinant(),
        a = this.elements;

    if (d == 0) {
        console.log("determinant is 0");
        return false;
    }

    d = 1 / d;
    invOut = [
        a[4] * a[8] - a[7] * a[5], a[7] * a[2] - a[1] * a[8], a[1] * a[5] - a[4] * a[2],
        a[6] * a[5] - a[3] * a[8], a[0] * a[8] - a[6] * a[2], a[3] * a[2] - a[0] * a[5],
        a[3] * a[7] - a[6] * a[4], a[6] * a[1] - a[0] * a[7], a[0] * a[4] - a[3] * a[1]
    ];

    for (var i = 0; i < 9; i++) {
        invOut[i] *= d;
    }

    return new Mat3(invOut);
};

Mat3.prototype.copy = function() {
    var a = this.elements;
    return new Mat3([a[0], a[1], a[2],
        a[3], a[4], a[5],
        a[6], a[7], a[8]
    ]);
};

Mat3.prototype.print = function() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            console.log(this.elements[i * 3 + j]);
        }
        console.log('\n');
    }
};


/**
 *  Mat4 class
 *  4x4 column-major matrix
 */
function Mat4(initMat) {
    this.elements = typeof initMat === 'undefined' ?
        new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]) :
        new Float32Array(initMat);
}

Mat4.prototype.identity = function() {
    this.elements[0] = this.elements[5] = this.elements[10] = this.elements[15] = 1.0;
    this.elements[1] = this.elements[2] = this.elements[3] = this.elements[4] = this.elements[6] =
        this.elements[7] = this.elements[8] = this.elements[9] = this.elements[11] = this.elements[12] = this.elements[13] = this.elements[14] = 0.0;
};

Mat4.prototype.set = function(s11, s12, s13, s14, s21, s22, s23, s24, s31, s32, s33, s34, s41, s42, s43, s44) {
    var a = this.elements;
    a[0] = s11;
    a[4] = s12;
    a[8] = s13;
    a[12] = s14;
    a[1] = s21;
    a[5] = s22;
    a[9] = s23;
    a[13] = s24;
    a[2] = s31;
    a[6] = s32;
    a[10] = s33;
    a[14] = s34;
    a[3] = s31;
    a[7] = s32;
    a[11] = s43;
    a[15] = s44;
};

Mat4.prototype.add = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat4([
        a[0] + b[0], a[4] + b[4], a[8] + b[8], a[12] + b[12],
        a[1] + b[1], a[5] + b[5], a[9] + b[9], a[13] + b[13],
        a[2] + b[2], a[6] + b[6], a[10] + b[10], a[14] + b[14],
        a[3] + b[3], a[7] + b[7], a[11] + b[11], a[15] + b[15],
    ]);
};

Mat4.prototype.sub = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat4([
        a[0] - b[0], a[4] - b[4], a[8] - b[8], a[12] - b[12],
        a[1] - b[1], a[5] - b[5], a[9] - b[9], a[13] - b[13],
        a[2] - b[2], a[6] - b[6], a[10] - b[10], a[14] - b[14],
        a[3] - b[3], a[7] - b[7], a[11] - b[11], a[15] - b[15],
    ]);
};

Mat4.prototype.multScalar = function(value) {
    var a = this.elements;
    return new Mat4([
        a[0] * value, a[4] * value, a[8] * value, a[12] * value,
        a[1] * value, a[5] * value, a[9] * value, a[13] * value,
        a[2] * value, a[6] * value, a[10] * value, a[14] * value,
        a[3] * value, a[7] * value, a[11] * value, a[15] * value,
    ]);
};

Mat4.prototype.mult = function(rhs) {
    var a = this.elements,
        b = rhs.elements;
    return new Mat4([
        a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
        a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
        a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
        a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
    ]);
};

Mat4.prototype.multv4 = function(v) {
    var a = this.elements;
    return new Vec4(
        a[0] * v.x + a[4] * v.y + a[8] * v.z + a[12] * v.w,
        a[1] * v.x + a[5] * v.y + a[9] * v.z + a[13] * v.w,
        a[2] * v.x + a[6] * v.y + a[10] * v.z + a[14] * v.w,
        a[3] * v.x + a[7] * v.y + a[11] * v.z + a[15] * v.w
    );
};

Mat4.prototype.multv3 = function(v) {
    var a = this.elements;
    return new Vec3(
        a[0] * v.x + a[3] * v.y_a[6] * v.z,
        a[1] * v.x + a[4] * v.y + a[7] * v.z,
        a[2] * v.x + a[5] * v.y + a[8] * v.z
    );
};

Mat4.prototype.transpose = function() {
    var a = this.elements,
        temp;
    temp = a[4];
    a[4] = a[1];
    a[1] = temp;
    temp = a[8];
    a[8] = a[2];
    a[2] = temp;
    temp = a[12];
    a[12] = a[3];
    a[3] = temp;
    temp = a[9];
    a[9] = a[6];
    a[6] = temp;
    temp = a[13];
    a[13] = a[7];
    a[7] = temp;
    temp = a[14];
    a[14] = a[11];
    a[11] = temp;
};

Mat4.prototype.determinant = function() {
    var a = this.elements;
    return a[0] * a[5] * a[10] * a[15] + a[0] * a[9] * a[14] * a[7] + a[0] * a[13] * a[6] * a[11] +
        a[4] * a[1] * a[14] * a[11] + a[4] * a[9] * a[2] * a[15] + a[4] * a[13] * a[10] * a[3] +
        a[8] * a[1] * a[6] * a[15] + a[8] * a[5] * a[14] * a[3] + a[8] * a[13] * a[2] * a[7] +
        a[12] * a[1] * a[10] * a[7] + a[12] * a[5] * a[2] * a[11] + a[12] * a[9] * a[6] * a[3] -
        a[0] * a[5] * a[14] * a[11] - a[0] * a[9] * a[6] * a[15] - a[0] * a[13] * a[10] * a[7] -
        a[4] * a[1] * a[10] * a[15] - a[4] * a[9] * a[14] * a[3] - a[4] * a[13] * a[2] * a[11] -
        a[8] * a[1] * a[14] * a[7] - a[8] * a[5] * a[2] * a[15] - a[8] * a[13] * a[6] * a[3] -
        a[12] * a[1] * a[6] * a[11] - a[12] * a[5] * a[10] * a[3] - a[12] * a[9] * a[2] * a[7];
};

Mat4.prototype.getInverse = function() {
    var invOut = [],
        a = this.elements,
        a11 = a[0],
        a12 = a[4],
        a13 = a[8],
        a14 = a[12],
        a21 = a[1],
        a22 = a[5],
        a23 = a[9],
        a24 = a[13],
        a31 = a[2],
        a32 = a[6],
        a33 = a[10],
        a34 = a[14],
        a41 = a[3],
        a42 = a[7],
        a43 = a[11],
        a44 = a[15];

    invOut[0] = a23 * a34 * a42 - a24 * a33 * a42 + a24 * a32 * a43 - a22 * a34 * a43 - a23 * a32 * a44 + a22 * a33 * a44;
    invOut[4] = a14 * a33 * a42 - a13 * a34 * a42 - a14 * a32 * a43 + a12 * a34 * a43 + a13 * a32 * a44 - a12 * a33 * a44;
    invOut[8] = a13 * a24 * a42 - a14 * a23 * a42 + a14 * a22 * a43 - a12 * a24 * a43 - a13 * a22 * a44 + a12 * a23 * a44;
    invOut[12] = a14 * a23 * a32 - a13 * a24 * a32 - a14 * a22 * a33 + a12 * a24 * a33 + a13 * a22 * a34 - a12 * a23 * a34;

    invOut[1] = a24 * a33 * a41 - a23 * a34 * a41 - a24 * a31 * a43 + a21 * a34 * a43 + a23 * a31 * a44 - a21 * a33 * a44;
    invOut[5] = a13 * a34 * a41 - a14 * a33 * a41 + a14 * a31 * a43 - a11 * a34 * a43 - a13 * a31 * a44 + a11 * a33 * a44;
    invOut[9] = a14 * a23 * a41 - a13 * a24 * a41 - a14 * a21 * a43 + a11 * a24 * a43 + a13 * a21 * a44 - a11 * a23 * a44;
    invOut[13] = a13 * a24 * a31 - a14 * a23 * a31 + a14 * a21 * a33 - a11 * a24 * a33 - a13 * a21 * a34 + a11 * a23 * a34;

    invOut[2] = a22 * a34 * a41 - a24 * a32 * a41 + a24 * a31 * a42 - a21 * a34 * a42 - a22 * a31 * a44 + a21 * a32 * a44;
    invOut[6] = a14 * a32 * a41 - a12 * a34 * a41 - a14 * a31 * a42 + a11 * a34 * a42 + a12 * a31 * a44 - a11 * a32 * a44;
    invOut[10] = a12 * a24 * a41 - a14 * a22 * a41 + a14 * a21 * a42 - a11 * a24 * a42 - a12 * a21 * a44 + a11 * a22 * a44;
    invOut[14] = a14 * a22 * a31 - a12 * a24 * a31 - a14 * a21 * a32 + a11 * a24 * a32 + a12 * a21 * a34 - a11 * a22 * a34;

    invOut[3] = a23 * a32 * a41 - a22 * a33 * a41 - a23 * a31 * a42 + a21 * a33 * a42 + a22 * a31 * a43 - a21 * a32 * a43;
    invOut[7] = a12 * a33 * a41 - a13 * a32 * a41 + a13 * a31 * a42 - a11 * a33 * a42 - a12 * a31 * a43 + a11 * a32 * a43;
    invOut[11] = a13 * a22 * a41 - a12 * a23 * a41 - a13 * a21 * a42 + a11 * a23 * a42 + a12 * a21 * a43 - a11 * a22 * a43;
    invOut[15] = a12 * a23 * a31 - a13 * a22 * a31 + a13 * a21 * a32 - a11 * a23 * a32 - a12 * a21 * a33 + a11 * a22 * a33;

    var det = a11 * invOut[0] + a21 * invOut[4] + a31 * invOut[8] + a41 * invOut[12];
    if (det == 0) {
        console.log("determinant is 0");
        return false;
    }

    det = 1 / det;
    for (let i = 0; i < 16; i++) {
        invOut[i] *= det;
    }
    return new Mat4(invOut);
};

Mat4.prototype.copy = function() {
    var a = this.elements;
    return new Mat4([a[0], a[1], a[2], a[3],
        a[4], a[5], a[6], a[7],
        a[8], a[9], a[10], a[11],
        a[12], a[13], a[14], a[15]
    ]);
};

Mat4.prototype.print = function() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            console.log(this.elements[i * 4 + j]);
        }
        console.log('\n');
    }
};

function translate(mat4, v) {
    mat4.identity();
    mat4.elements[12] = v.x;
    mat4.elements[13] = v.y;
    mat4.elements[14] = v.z;
    return mat4;
}

function rotateX(mat4, alpha) {
    mat4.identity();
    let c = Math.cos(alpha);
    let s = Math.sin(alpha);
    mat4.elements[5] = c;
    mat4.elements[6] = s;
    mat4.elements[9] = -mat4.elements[6];
    mat4.elements[10] = mat4.elements[5];
    return mat4;
}

function rotateY(mat4, alpha) {
    mat4.identity();
    let c = Math.cos(alpha);
    let s = Math.sin(alpha);
    mat4.elements[0] = c;
    mat4.elements[2] = -s;
    mat4.elements[8] = -mat4.elements[2];
    mat4.elements[10] = mat4.elements[0];
    return mat4;
}

function rotateZ(mat4, alpha) {
    mat4.identity();
    let c = Math.cos(alpha);
    let s = Math.sin(alpha);
    mat4.elements[0] = c;
    mat4.elements[1] = s;
    mat4.elements[4] = -mat4.elements[1];
    mat4.elements[5] = mat4.elements[0];
    return mat4;
}

function scale(mat4, v) {
    mat4.identity();
    mat4.elements[0] = v.x;
    mat4.elements[5] = v.y;
    mat4.elements[10] = v.z;
    return mat4;
}



function lookAt(mat4, cameraPosition, target, up) {
    mat4.identity();
    let zAxis = cameraPosition.sub(target).normalize();
    let xAxis = up.cross(zAxis);
    let yAxis = zAxis.cross(xAxis);

    mat4.elements[0] = xAxis.x;
    mat4.elements[1] = xAxis.y;
    mat4.elements[2] = xAxis.z;
    mat4.elements[3] = 0;

    mat4.elements[4] = yAxis.x;
    mat4.elements[5] = yAxis.y;
    mat4.elements[6] = yAxis.z;
    mat4.elements[7] = 0;
    mat4.elements[8] = zAxis.x;
    mat4.elements[9] = zAxis.y;
    mat4.elements[10] = zAxis.z;
    mat4.elements[11] = 0;

    mat4.elements[12] = -cameraPosition.x;
    mat4.elements[13] = -cameraPosition.y;
    mat4.elements[14] = -cameraPosition.z;
    mat4.elements[15] = 1;

    //mat4.transpose();

    return mat4.getInverse();
}


//  fov angle must be in radians
function perspective(mat4, fov, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    var rangeInv = 1.0 / (near - far);

    mat4.elements[0] = f / aspect;
    mat4.elements[1] = 0;
    mat4.elements[2] = 0;
    mat4.elements[3] = 0;
    mat4.elements[4] = 0;
    mat4.elements[5] = f;
    mat4.elements[6] = 0;
    mat4.elements[7] = 0;

    mat4.elements[8] = 0;
    mat4.elements[9] = 0;
    mat4.elements[10] = (near + far) * rangeInv;
    mat4.elements[11] = -1;
    mat4.elements[12] = 0;
    mat4.elements[13] = 0;
    mat4.elements[14] = near * far * rangeInv * 2;
    mat4.elements[15] = 0;

    return mat4;
}