// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
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

	var tempRo = MatrixMult(rotationXMatrix, rotationYMatrix);
	var mvp = MatrixMult(trans, tempRo);
	var mv = mvp;

	return mv;
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
		
		// Get mv matrix
		this.mv = gl.getUniformLocation( this.prog, 'mv' );
		
		// Get normal matrix
		this.mvNormal = gl.getUniformLocation( this.prog, 'mvNormal' );
		
		// Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );

		// set UV coordinates
		this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');

		// Get normal parameter
		this.aNormal = gl.getAttribLocation(this.prog, 'aNormal');

		// Get sampler
		this.uSampler = gl.getUniformLocation(this.prog, 'uSampler');

		// Get displayTexture
		this.displayTexture = gl.getUniformLocation(this.prog, 'displayTexture');

		// Get shininess
		this.aShininess = gl.getUniformLocation(this.prog, 'aShininess');

		// Get light dir
		this.lightDir = gl.getUniformLocation(this.prog, 'lightDir');
		
		// Get swapYZ
		this.attriSwapYZ = gl.getUniformLocation(this.prog, 'swapYZ');

		this.vertbuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);

		this.texCoordsbuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);

		// Set normal buffer
		this.normalbuffer = gl.createBuffer();

		// Create the buffer objects
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions,
	// an array of 2D texture coordinates, and an array of vertex normals.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex and every three consecutive 
	// elements in the normals array form a vertex normal.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords, normals )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		// this.vertbuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// this.texCoordsbuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		
		// set normal buffer data
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		
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
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw( matrixMVP, matrixMV, matrixNormal )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram( this.prog);
		gl.uniformMatrix4fv( this.mvp, false, matrixMVP);
		gl.uniformMatrix4fv(this.mv, false, matrixMV);
		gl.uniformMatrix3fv(this.mvNormal, false, matrixNormal);

		// vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);

		// texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsbuffer);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoord);

		// normals buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
		gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.aNormal);

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
	
	// This method is called to set the incoming light direction
	setLightDir( x, y, z )
	{

		gl.useProgram( this.prog);
		gl.uniform3f(this.lightDir, x, y, z);

		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the light direction.
	}
	
	// This method is called to set the shininess of the material
	setShininess( shininess )
	{
		gl.useProgram( this.prog);
		gl.uniform1f(this.aShininess, shininess);
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the shininess.
	}
}


// Vertex shader source code
var meshVS = `
	attribute vec3 pos;
	attribute vec2 texCoord;
	attribute vec3 aNormal;

	uniform mat4 mvp;
	uniform mat4 mv;
	uniform mat3 mvNormal;
	uniform bool swapYZ;
	uniform vec3 lightDir;

	varying vec2 vTextureCoord;
	varying vec3 vNormal;
	varying vec3 vFragPos;
	varying vec3 vLightDir;

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
		vNormal = mvNormal * aNormal;
		vFragPos = vec3(mv * vec4(pos, 1));
		vLightDir = lightDir;
	}
`;
// Fragment shader source code
var meshFS = `
	precision mediump float;
	varying vec2 vTextureCoord;
	uniform sampler2D uSampler;
	uniform bool displayTexture;
	uniform vec3 aLightDir;
	uniform float aShininess;

	varying vec3 vNormal;
	varying vec3 vFragPos;
	varying vec3 vLightDir;

	void main()
	{
		// gl_FragColor = vec4(1,1,1,1);

		vec3 lightColor = vec3(1.0, 1.0, 1.0);
		float ambientStrength = 0.1;
		// ambient
		vec3 ambient = ambientStrength * lightColor;

		// diffuse
		vec3 norm = normalize(vNormal);
		float diff = max(dot(norm, vLightDir), 0.0);
		vec3 diffuse = diff * lightColor;

		// specular
		float specularStrength = 0.5;
		vec3 reflectDir = reflect(-vLightDir, norm);
		vec3 viewPos = vec3(0, 0, 1);
		vec3 viewDir = normalize(viewPos - vFragPos);
		vec3 halfVec = normalize(viewDir + vLightDir);
		float spec = pow(max(dot(norm, halfVec), 0.0), aShininess);
		// float spec = pow(max(dot(viewDir, reflectDir), 0.0), aShininess);
		vec3 specular = specularStrength * spec * lightColor;

		if(displayTexture)
		{
			vec3 result = ambient + specular;
			gl_FragColor = texture2D(uSampler, vTextureCoord) * diff + vec4(result, 1);
		}
		else
		{
			// gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,1,1);
			vec3 result = ambient + diffuse + specular;
			gl_FragColor = vec4(result,1);
		}
	}
`;


// This function is called for every step of the simulation.
// Its job is to advance the simulation for the given time step duration dt.
// It updates the given positions and velocities.
function SimTimeStep( dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution, selVert )
{

	var forces = Array( positions.length ); // The total for per particle
	for(var i = 0; i < forces.length; i++)
	{
		forces[i] = gravity.mul(particleMass);
	}

	for ( var i = 0; i < springs.length; i++ )
	{
		var spring = springs[i];	
		var p0 = spring.p0;
		var p1 = spring.p1;
		var rest = spring.rest;
		var length = positions[p1].sub(positions[p0]).len();
		var dHat = (positions[p1].sub(positions[p0])).div(length);
		var springForce = dHat.mul(stiffness).mul(length - rest);
		var dampScalar = velocities[p1].sub(velocities[p0]).dot(dHat);
		var dampForce = dHat.mul(damping).mul(dampScalar);
		var sumForce = springForce.add(dampForce);

		var p0Force = forces[p0].add(sumForce);
		forces[p0] = p0Force;

		var p1Force = forces[p1].sub(sumForce);
		forces[p1] = p1Force;
	
	}

	for (var i = 0; i < forces.length; i++)
	{
		// console.log(positions[i]);
		var force = forces[i];

		// console.log("final force");
		// console.log(force);
		var acc = force.div(particleMass);

		var newPos = positions[i];
		
		var deltaVelocity = velocities[i].add(acc.mul(dt));
		velocities[i] = deltaVelocity;
		var newPos = positions[i].add(deltaVelocity.mul(dt));
		// var newPos = positions[i].add(acc.mul(dt).mul(dt));
		if (newPos.y < -1 || newPos.y > 1.0 || newPos.x < -1 || newPos.x > 1 || newPos.z < -1 || newPos.z > 1)
		{
			velocities[i] = deltaVelocity.mul(-1).mul(restitution);
			newPos = positions[i].add(velocities[i].mul(dt));
		}

		if (i == selVert)
		{
			continue;
		}
		else
		{
			positions[i] = newPos;
		}
	}

	// [TO-DO] Compute the total force of each particle
	
	// [TO-DO] Update positions and velocities
	
	// [TO-DO] Handle collisions
	
}

