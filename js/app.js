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
		projection = perspective(projection, fov*degToRad, cnv.width/cnv.height, 1, 1000);
		renderScene();
	}
	
	function setUpInteractivities() {
		addEventListener("resize", onresize);
		
		let touchOrDown = new Vec2();
		let touchOrMove = new Vec2();
		let phi = 0, theta = 0,
				phim = 0, thetam = 0;
		
		function onStart(e) {
			touchOrDown.set(e.clientX, e.clientY);
			phim = phi; 
			thetam = theta;
			document.onmousemove = onMove;
		}
		
		function onMove(e) {
			touchOrMove.set(e.clientX, e.clientY);	
			
			let diff = touchOrMove.sub(touchOrDown);
			
			theta += diff.x;
			phi += diff.y;
			
			Ry = rotateY(Ry, phi * degToRad * 0.5);
			
			// theta = -(touchOrMove.x - touchOrDown.x) * 0.002 + thetam;
			// phi = (touchOrMove.y - touchOrDown.y) * 0.002 + phim;
			
			// phi = Math.min( 180, Math.max( 0, phi ) );
				
		
			// cameraPosition.x =   Math.sin(theta) * Math.cos(phi);
			// cameraPosition.y =   Math.sin(phi);
			// cameraPosition.z =   Math.cos(theta) * Math.cos(phi);	
			
			// target.set(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
			
			// view = lookAt(view, cameraPosition, target, up);
			
			
			renderScene();
			
			touchOrDown.set(touchOrMove.x, touchOrMove.y);
		}
		
		function onEnd(e) {
			document.onmousemove = null;
		}
		
		
		document.onmousedown = onStart;
		document.onmouseup = onEnd;
		window.onmouseup = onEnd;
  }
	
	function setUpGL() {
		cnv.width = cnv.offsetWidth;
		cnv.height = cnv.offsetHeight;
		gl.viewport(0, 0, cnv.width, cnv.height);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	}
	
	function isPowerOf2(x) {
		return (x & (x - 1)) == 0;
    }
	
	function load360View(r, center, lats, longs, textureImage) {
		let	vertexBuffer = gl.createBuffer(),
			uvBuffer = gl.createBuffer(),
			indexBuffer = gl.createBuffer(),
			texture = gl.createTexture(),
			vertices = [],
			texCoords = [],
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
					texCoords.push( (j / longs) );
					texCoords.push( (i / lats) );
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
			gl.enableVertexAttribArray(vPositionLoc);
			gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0);					
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
			gl.enableVertexAttribArray(vtexCoordLoc);
			gl.vertexAttribPointer(vtexCoordLoc, 2, gl.FLOAT, false, 0, 0);			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords),	gl.STATIC_DRAW);
				
			
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
			
			
			if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			

		return {
			vertexBuffer: vertexBuffer,
			indexBuffer: indexBuffer,
			uvBuffer: uvBuffer,
			indices: indices,
			texture : texture
		}
	}
	
	function renderScene() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);			
		
		//Ry = rotateY(Ry, alpha*degToRad * 0.1);		
		model = T.mult( S.mult( Rz.mult(Ry).mult(Rx) ) );
		mvp = projection.mult( view.mult(model) );								
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, sphereView.texture);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "texture"), 0);
		
		gl.uniformMatrix4fv(mvpLoc, false, mvp.elements);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereView.indexBuffer);
		gl.drawElements(gl.TRIANGLE_STRIP, sphereView.indices.length, gl.UNSIGNED_SHORT, 0);	
	
		//alpha++;		
		//if (Math.abs(alpha) > 360) {
		//	alpha = 0;
		//	
		//	if (timerID) {
		//		cancelAnimationFrame(timerID);				
		//	}
		//}			
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
		vtexCoordLoc = gl.getAttribLocation(shaderProgram, "vtexCoord"),
		mvpLoc	= gl.getUniformLocation(shaderProgram, "mvp"),
		
		cameraPosition = new Vec3(0, 0, 0),		
		target = new Vec3(0, 0, -1),
		up = new Vec3(0, 1, 0),
	
		Rx = rotateX(new Mat4(), 0),
		Ry = rotateY(new Mat4(), 0),
		Rz = rotateZ(new Mat4(), 0),
		
		T = translate(new Mat4(), new Vec3(0, 0, 0)),	
		S = scale(new Mat4(), new Vec3(1, 1, 1)),
		
		fov = 90,
		
		projection = perspective(new Mat4(), fov*degToRad, cnv.width/cnv.height, 1, 1000),		
		view = lookAt(new Mat4(), cameraPosition, target, up),
		mvp,
		model,
		alpha = 0,
		timerID  = 0,
		sphereView;
		
		
	let image = new Image();
	image.src = "media/textures/img1.jpg";
	
	image.onload = function() {
		sphereView = load360View(5, new Vec3(0, 0, 0), 50, 50, image);
			
		setUpGL();
		onresize();
		setUpInteractivities();
		//mainLoop();
	}

	
})();