// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{	

	// 矩阵乘的顺序为： T * R * S
	// T = [1, 0, positionX,
	// 	 0, 1, positionY,
	// 	 0, 0, 1]

	// R = [	cos(rotation), -sin(rotation), 0,
	// 		sin(rotation), cos(rotation), 0,
	// 		0, 0, 1]

	// S = [scale, 0, 0,
	// 	 0, scale, 0,
	// 	0, 0, 1]  因为这里只有x，y两个维度，所有z的缩放为1，如果也设为scale则会出现偏差

	// 最后的计算顺序一定是
	// T * R * S
	var angle = rotation * Math.PI / 180.0
	var m11 = scale * Math.cos(angle);
	var m12 = - scale * Math.sin(angle);
	var m13 = positionX;
	// var m13 = scale * Math.cos(angle) * positionX - scale * Math.sin(angle) * positionY;

	var m21 = scale * Math.sin(angle);
	var m22 = scale * Math.cos(angle);
	var m23 = positionY;
	// var m23 = scale * Math.sin(angle) * positionX + scale * Math.cos(angle) * positionY;
	
	var m31 = 0;
	var m32 = 0;
	var m33 = 1;

	// return Array( m11, m12, m13, m21, m22, m23, m31, m32, m33);
	return Array( m11, m21, m31, m12, m22, m32, m13, m23, m33);
	// return Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{

	var m11 = trans1[0];
	var m12 = trans1[3];
	var m13 = trans1[6];

	var m21 = trans1[1];
	var m22 = trans1[4];
	var m23 = trans1[7];

	var m31 = trans1[2];
	var m32 = trans1[5];
	var m33 = trans1[8];

	var _m11 = trans2[0];
	var _m12 = trans2[3];
	var _m13 = trans2[6];

	var _m21 = trans2[1];
	var _m22 = trans2[4];
	var _m23 = trans2[7];

	var _m31 = trans2[2];
	var _m32 = trans2[5];
	var _m33 = trans2[8];

	// var t_m11 = m11 * _m11 + m12 * _m21 + m13 * _m31;
	// var t_m12 = m11 * _m12 + m12 * _m22 + m13 * _m32;
	// var t_m13 = m11 * _m13 + m12 * _m23 + m13 * _m33;

	// var t_m21 = m21 * _m11 + m22 * _m21 + m23 * _m31;
	// var t_m22 = m21 * _m12 + m22 * _m22 + m23 * _m32;
	// var t_m23 = m21 * _m13 + m22 * _m23 + m23 * _m33;

	// var t_m31 = m31 * _m11 + m32 * _m21 + m33 * _m31;
	// var t_m32 = m31 * _m12 + m32 * _m22 + m33 * _m32;
	// var t_m33 = m31 * _m13 + m32 * _m23 + m33 * _m33;

	var t_m11 = _m11 * m11 + _m12 * m21 + _m13 * m31;
	var t_m12 = _m11 * m12 + _m12 * m22 + _m13 * m32;
	var t_m13 = _m11 * m13 + _m12 * m23 + _m13 * m33;

	var t_m21 = _m21 * m11 + _m22 * m21 + _m23 * m31;
	var t_m22 = _m21 * m12 + _m22 * m22 + _m23 * m32;
	var t_m23 = _m21 * m13 + _m22 * m23 + _m23 * m33;

	var t_m31 = _m31 * m11 + _m32 * m21 + _m33 * m31;
	var t_m32 = _m31 * m12 + _m32 * m22 + _m33 * m32;
	var t_m33 = _m31 * m13 + _m32 * m23 + _m33 * m33;

	return Array( t_m11, t_m21, t_m31, t_m12, t_m22, t_m32, t_m13, t_m23, t_m33 );
	// return Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
}
