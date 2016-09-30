'use strict';

;(function() {

	let cnv = document.getElementById("canvas3d"),
		gl = cnv.getContext("experimental-webgl"),
		vshader,
		fshader,
		shaderProgram,
		rand = Math.random;
		
	function onresize() {
		setUpGL();
		projection = perspective(projection, fov*degToRad, cnv.width/cnv.height, 1, 3000);
		renderScene();
	}
	
	function setUpInteractivities() {
		addEventListener("resize", onresize);    
    }
	
	function setUpGL() {
		cnv.width = cnv.offsetWidth;
		cnv.height = cnv.offsetHeight;
		gl.viewport(0, 0, cnv.width, cnv.height);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	}	
	
	function loadSphere(r, center, lats, longs) {
		let	vertexBuffer = gl.createBuffer(),
			colorBuffer = gl.createBuffer(),
			indexBuffer = gl.createBuffer(),
			vertices = [],
			verticesColors = [],
			indices = [];	
			
			let theta, phi, x, y, z;
			for (let i = 0; i <= lats; i++) {				
				theta = i * Math.PI/lats;
				for (let j = 0; j <= longs; j++) {
					phi = j * 2 * Math.PI/longs;					
					x = Math.sin(theta) * Math.cos(phi);
					y = Math.cos(theta);
					z = Math.sin(theta) * Math.sin(phi);					
					vertices.push(r * x + center.x);
					vertices.push(r * y + center.y);
					vertices.push(r * z + center.z);					
				}				
			}
			let l = vertices.length / 3;
			for (let i = 0; i < l; i++) {
				for (let k = 0; k < 4; k++) {
					verticesColors.push( k == 3 ? 1 : rand() );					
				}
			}
			for (let i = 0; i < lats; i++) {				
				for (let j = 0; j < longs; j++) {
					let first = (i * (longs + 1)) + j;
					let second = first + longs + 1;
					
					indices.push(first);
					indices.push(second);
					indices.push(first + 1);

					indices.push(second);
					indices.push(second + 1);
					indices.push(first + 1);
				}
			}
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);	  
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);		   		   
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesColors),	gl.STATIC_DRAW);

		return {
			vertexBuffer: vertexBuffer,
			indexBuffer: indexBuffer,
			colorBuffer: colorBuffer,
			indices: indices
		}
	}
	
	function renderScene() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);			

		gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vertexBuffer);																
		gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0);	

		gl.bindBuffer(gl.ARRAY_BUFFER, sphere.colorBuffer);							
		gl.vertexAttribPointer(pColorLoc, 4, gl.FLOAT, false, 0, 0);	
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
		
		Ry = rotateY(Ry, alpha*degToRad / 2);
		
		model = T.mult( S.mult( Rz.mult(Ry).mult(Rx) ) );
		mvp = projection.mult( model );								
		
		gl.uniformMatrix4fv(mvpLoc, false, mvp.elements);
		gl.drawElements(gl.TRIANGLE_STRIP, sphere.indices.length, gl.UNSIGNED_SHORT, 0);	
	
		alpha++;
		
		if (Math.abs(alpha) > 360) {
			alpha = 0;
			
			if (timerID) {
				cancelAnimationFrame(timerID);				
			}
		}			
	}
	
	function mainLoop() {
		timerID = requestAnimationFrame(mainLoop);	
        renderScene();
    }
	

	vshader = getShader("vshader", gl);
	fshader = getShader("fshader", gl);
	shaderProgram = buildProgram(vshader, fshader, gl);
	gl.useProgram(shaderProgram);
	
	let vPositionLoc = gl.getAttribLocation(shaderProgram, "vPosition"),
		pColorLoc = gl.getAttribLocation(shaderProgram, "pColor"),
		mvpLoc	= gl.getUniformLocation(shaderProgram, "mvp"),
	
		Rx = rotateX(new Mat4(), 0),
		Ry = rotateY(new Mat4(), 0),
		Rz = rotateZ(new Mat4(), 0),
		
		T = translate(new Mat4(), new Vec3(0, 0, 0)),	
		S = scale(new Mat4(), new Vec3(1, 1, 1)),
		
		fov = 55,
		
		projection = perspective(new Mat4(), fov*degToRad, cnv.width/cnv.height, 1, 3000),		
		mvp,
		model,
		alpha = 0,
		timerID  = 0,
		sphere = loadSphere(250, new Vec3(0, 0, 0), 100, 100);
	
	gl.enableVertexAttribArray(vPositionLoc);
	gl.enableVertexAttribArray(pColorLoc);


	setUpGL();
	onresize();
	setUpInteractivities();
	mainLoop();	
	
})();