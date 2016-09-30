'use strict';

function compileShader(shSource, shaderType, gl) {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shSource);						
	gl.compileShader(shader);									
	
	if ( ! gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		throw "could not compile shader:" + gl.getShaderInfoLog(shader);
	}
	
	return shader;
}

function getShader(id, gl) {
	var shScript = document.getElementById(id),
		line = shScript.firstChild,
		shSource = "";
		
	while (line) {			
		if (line.nodeType == 3) {
			shSource += line.textContent;
		}
		line = line.nextSibling;
	}
	//	or shSource = shScript.innerHTML, //	or shScript.textContent
	
	if (shScript.type == "x-shader/x-vertex")
		return compileShader(shSource, gl.VERTEX_SHADER, gl);
	else if (shScript.type == "x-shader/x-fragment")
		return compileShader(shSource, gl.FRAGMENT_SHADER, gl);
	
	return null;
}

function buildProgram(vshader, fshader, gl) {
	let shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);	
	gl.deleteShader(fshader);
	gl.deleteShader(vshader);
	return shaderProgram;
}