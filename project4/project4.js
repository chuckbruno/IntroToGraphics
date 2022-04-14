// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var rotationXMatrix = [ 
		1, 0, 0,0,
		0, Math.cos(rotationX), Math.sin(rotationX), 0,
		0, -Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];

	var rotationYMatrix = [ 
		Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
		0, 1, 0, 0,
		Math.sin(rotationY), 0, Math.cos(rotationY), 0,
		0, 0, 0, 1
	];

	var temp = MatrixMult( projectionMatrix, trans );
	var tempRo = MatrixMult(rotationXMatrix, rotationYMatrix);

	var mvp = MatrixMult(temp, tempRo);

	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		// Compile the shader program
		this.prog = InitShaderProgram( meshVS, meshFS );

		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );

		// set UV coordinates
		this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');

		// Get sampler
		this.uSampler = gl.getUniformLocation(this.prog, 'uSampler');

		// Get displayTexture
		this.displayTexture = gl.getUniformLocation(this.prog, 'displayTexture');
		
		// Get swapYZ
		this.attriSwapYZ = gl.getUniformLocation(this.prog, 'swapYZ');

		this.vertbuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);

		this.texCoordsbuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);

		// Create the buffer objects
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		// this.vertbuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// this.texCoordsbuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		
		this.numTriangles = vertPos.length / 3;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		
		gl.useProgram( this.prog);
		gl.uniform1i(this.attriSwapYZ, swap );

		// [TO-DO] Set the uniform parameter(s) of the vertex shader
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram( this.prog);
		gl.uniformMatrix4fv( this.mvp, false, trans);

		// vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);

		// texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoord);

		// texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.uSampler, 0);
		// draw scene
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture

		// You can set the texture image data using the following command.
        this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
	
		gl.useProgram( this.prog);
		gl.uniform1i(this.displayTexture, 1 );
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		gl.useProgram( this.prog);
		gl.uniform1i(this.displayTexture, show );
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
	}
	
}


// Vertex shader source code
var meshVS = `
	attribute vec3 pos;
	attribute vec2 texCoord;
	uniform mat4 mvp;
	uniform bool swapYZ;

	varying vec2 vTextureCoord;
	void main()
	{
		if(swapYZ)
		{
			gl_Position = mvp * vec4(pos.x, pos.z, pos.y,1);
		}
		else
		{
			gl_Position = mvp * vec4(pos,1);

		}
		vTextureCoord = texCoord;
	}
`;
// Fragment shader source code
var meshFS = `
	precision mediump float;
	varying vec2 vTextureCoord;
	uniform sampler2D uSampler;
	uniform bool displayTexture;

	void main()
	{
		// gl_FragColor = vec4(1,1,1,1);

		if(displayTexture)
		{
			gl_FragColor = texture2D(uSampler, vTextureCoord);
		}
		else
		{
			gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,1,1);
		}
	}
`;
