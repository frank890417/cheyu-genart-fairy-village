const frag_texture = ` 
	precision highp float;

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform vec3 u_lightDir;
	uniform vec3 u_col;
	uniform mat3 uNormalMatrix;
	uniform float u_pixelDensity;
	uniform sampler2D u_tex; 

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord; 

	${frag_functions_default}

	void main(){
		vec2 st = var_vertTexCoord.xy /u_resolution.xy*min(u_resolution.x,u_resolution.y);
		st.x*=u_resolution.x/u_resolution.y;
			st.x*=u_resolution.x/u_resolution.y;
			float sc = 1.*u_resolution.x/100.;
			st*=sc;
			st*=vec2(8.,1.);
		
			// st.y = 1.0 - st.y;
			vec3 color = vec3(0.);
			color+=cnoise(vec3(st*20.,10.))/7./2.;
			color+=cnoise(vec3(st*30.,10.))/9./2.;
			color+=cnoise(vec3(st*10.,10.))/9./2.;
		
			color+=cnoise(vec3(st*200.,10.))/8.;
			color+=cnoise(vec3(st*300.,10.))/10.;
			color+=cnoise(vec3(st*100.,10.))/10.;
		
			color+=cnoise(vec3(st*200.,10.))/8.;
			color+=cnoise(vec3(st*300.,10.))/10.;
			color+=cnoise(vec3(st*100.,10.))/10.;
			color+=pNoise(st*10.,5)*pNoise(st*10.+2.,10)/2.;
			color+=pNoise(st*30.,5)*pNoise(st*40.+2.,10)/2.; 
			color/=2.;
		
			color = 1.-color;
			color*=vec3(1.,1.,0.96);
		
		// vec3 color = vec3(st.x,st.y,1.);
		gl_FragColor= vec4(color,1.0);
	}
`