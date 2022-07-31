const frag = `
	precision highp float;

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform vec3 u_lightDir;
	uniform vec3 u_col;
	uniform vec3 u_bgColor;
	uniform mat3 uNormalMatrix;
	uniform float u_pixelDensity;
	uniform sampler2D u_tex;
	uniform sampler2D u_canvas_tex; 
	uniform float u_distortFactor;

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	${frag_functions_default}

	void main(){
		vec2 st = var_vertTexCoord.xy /u_resolution.xy*u_resolution.y;
		st.x*=u_resolution.x/u_resolution.y;
		vec2 stBorder =st;

		
		stBorder.x+=cnoise(vec3(st*1000.,100.))/500.;
		stBorder.y+=cnoise(vec3(st*1000.,1000.))/500.; 
		
		stBorder.x+=cnoise(vec3(st*100.,100.))/500.;
		stBorder.y+=cnoise(vec3(st*100.,1000.))/500.; 

	
		vec3 canvasOffset = texture2D(u_canvas_tex,st).rgb;
		st.x+=0.35/255.- canvasOffset.r/255.*3. ;
		st.y+=0.35/255.- canvasOffset.g/255.*3.  ;
		
		float distortFactor = u_distortFactor;
		st.x+=  cnoise(vec3(st*2.,${(random()*1000).toFixed(4)}))/(30.)*distortFactor  ;
		st.y+= cnoise(vec3(st*20.,${(random()*1000).toFixed(4)}))/(30.)*distortFactor 
					+ cnoise(vec3(st/2.,${(random()*1000).toFixed(4)}))/(100.)*distortFactor;
		
		vec4 texColor0 = texture2D(u_tex,st);


		
		//offset color Blocks
		float offsetColor = 1./300.;
		stBorder.x-= texColor0.r*offsetColor;
		stBorder.y-=texColor0.g*offsetColor+ texColor0.b*offsetColor;
		
		vec4 texColor1 = texture2D(u_tex,st);

		
		vec2 st2 = st;
		//brush feeling  
		float brushFactor = 500.;
		st2.x+=cnoise(vec3(st*1000.,100.))/brushFactor;
		st2.y+=cnoise(vec3(st*1000.,1000.))/brushFactor; 
 
		vec4 texColor2 = texture2D(u_tex,st2);
		vec2 st3 = st;
		st3.x += pNoise(st * 500., 10) / 2.;
		st3.y += pNoise(st * 500., 10) / 2.;
		vec4 texColor3 = texture2D(u_tex, st3);

		texColor2 = (texColor2*1. + texColor3*1.)/1.2;
		
		float d = distance(vec2(0.5) ,st);  
		// texColor*=1.-d+0.3;
		// gl_FragColor= vec4(color,1.0)+texColor2; 
		
		float borderWidth = 20.;
		bool isBorder = stBorder.x*u_resolution.x<borderWidth
		|| (1.-stBorder.x)*u_resolution.x<borderWidth 
		|| stBorder.y*u_resolution.y<borderWidth 
		|| (1.-stBorder.y)*u_resolution.y<borderWidth;


		
		vec4 result ;
		result = texColor1 * 0.8 + (texColor1 * texColor2 / 1.9 + texColor1 / 4. + texColor2 / 4.) / 5. ;
		if ( isBorder){
			result.rgb= vec3(u_bgColor);
		} else {

			// if ( distance(result.rgb, u_bgColor.rgb)<0.01 ){
			// 	result.a=0.;
			// }
		} 
		gl_FragColor =result;	
	}
`