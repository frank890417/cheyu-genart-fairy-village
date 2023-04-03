
const frag_functions_default = `
  #define PI 3.141592653589793
  #define TAU 6.283185307179586
	
	float rand(vec2 c){
		return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
	}

	mat2 scale2d(vec2 _scale){
			return mat2(_scale.x,0.0,
									0.0,_scale.y);
	}

	vec2 tile (vec2 _st, float _zoom) {
			_st *= _zoom;
			return fract(_st);
	}
	mat4 brightnessMatrix( float brightness )
	{
		return mat4( 1, 0, 0, 0,
					 0, 1, 0, 0,
					 0, 0, 1, 0,
					 brightness, brightness, brightness, 1 );
	}
	
	mat4 contrastMatrix( float contrast )
	{
		float t = ( 1.0 - contrast ) / 2.0;
		
		return mat4( contrast, 0, 0, 0,
					 0, contrast, 0, 0,
					 0, 0, contrast, 0,
					 t, t, t, 1 );
	
	}
	
	mat4 saturationMatrix( float saturation )
	{
		vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
		
		float oneMinusSat = 1.0 - saturation;
		
		vec3 red = vec3( luminance.x * oneMinusSat );
		red+= vec3( saturation, 0, 0 );
		
		vec3 green = vec3( luminance.y * oneMinusSat );
		green += vec3( 0, saturation, 0 );
		
		vec3 blue = vec3( luminance.z * oneMinusSat );
		blue += vec3( 0, 0, saturation );
		
		return mat4( red,     0,
					 green,   0,
					 blue,    0,
					 0, 0, 0, 1 );
	}
	//	Classic Perlin 3D Noise 
	//	by Stefan Gustavson

	vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
	vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
	vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

	float cnoise(vec3 P){
		vec3 Pi0 = floor(P); // Integer part for indexing
		vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
		Pi0 = mod(Pi0, 289.0);
		Pi1 = mod(Pi1, 289.0);
		vec3 Pf0 = fract(P); // Fractional part for interpolation
		vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
		vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
		vec4 iy = vec4(Pi0.yy, Pi1.yy);
		vec4 iz0 = Pi0.zzzz;
		vec4 iz1 = Pi1.zzzz;

		vec4 ixy = permute(permute(ix) + iy);
		vec4 ixy0 = permute(ixy + iz0);
		vec4 ixy1 = permute(ixy + iz1);

		vec4 gx0 = ixy0 / 7.0;
		vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
		gx0 = fract(gx0);
		vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
		vec4 sz0 = step(gz0, vec4(0.0));
		gx0 -= sz0 * (step(0.0, gx0) - 0.5);
		gy0 -= sz0 * (step(0.0, gy0) - 0.5);

		vec4 gx1 = ixy1 / 7.0;
		vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
		gx1 = fract(gx1);
		vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
		vec4 sz1 = step(gz1, vec4(0.0));
		gx1 -= sz1 * (step(0.0, gx1) - 0.5);
		gy1 -= sz1 * (step(0.0, gy1) - 0.5);

		vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
		vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
		vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
		vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
		vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
		vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
		vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
		vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

		vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
		g000 *= norm0.x;
		g010 *= norm0.y;
		g100 *= norm0.z;
		g110 *= norm0.w;
		vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
		g001 *= norm1.x;
		g011 *= norm1.y;
		g101 *= norm1.z;
		g111 *= norm1.w;

		float n000 = dot(g000, Pf0);
		float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
		float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
		float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
		float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
		float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
		float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
		float n111 = dot(g111, Pf1);

		vec3 fade_xyz = fade(Pf0);
		vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
		vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
		float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
		return 2.2 * n_xyz;
	}
	
	
float noise(vec2 p, float freq ){
	float unit = 1./freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

	
	float pNoise(vec2 p, int res){
		// p+=u_noise_pan;
		float persistance = .5;
		float n = 0.;
		float normK = 0.;
		float f = 4.;
		float amp = 1.;
		int iCount = 0;
		//noprotect
		for (int i = 0; i<50; i++){
			n+=amp*noise(p, f);
			f*=2.;
			normK+=amp;
			amp*=persistance;
			if (iCount == res) break;
			iCount++;
		}
		float nf = n/normK;
		return nf*nf*nf*nf;
	}

	vec2 random2( vec2 p ) {
			return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
	}

`

const vert = `
	precision highp float;

    // attributes, in
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;

    // attributes, out
    varying vec3 var_vertPos;
    varying vec3 var_vertNormal;
    varying vec2 var_vertTexCoord;
		varying vec4 var_centerGlPosition;//原点
    
    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;
	uniform float u_time;
	uniform sampler2D u_tex;

	${frag_functions_default}

    void main() {
      vec3 pos = aPosition;
			
			
			// vec4 texColor = texture2D(u_tex,aTexCoord);
			// pos.x += (texColor.r-0.5)/4.;
			// pos.y += (texColor.g-0.5)/4.;
			// pos.z += (texColor.b-0.5)/4.;
			
			vec4 posOut = uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
			
			
			
      gl_Position = posOut;

      // set out value
      var_vertPos      = pos;
      var_vertNormal   =  aNormal;
      var_vertTexCoord = aTexCoord;
			var_centerGlPosition = uProjectionMatrix * uModelViewMatrix * vec4(0., 0., 0.,1.0);
    }
`;

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
	uniform bool u_hasBorder;

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	${frag_functions_default}

	void main(){
		vec2 st = var_vertTexCoord.xy /u_resolution.xy*u_resolution.y;
		vec2 originalSt = st;
		st.x*=u_resolution.x/u_resolution.y;
		vec2 stBorder =st;
 
	
		vec3 canvasOffset = texture2D(u_canvas_tex,st).rgb;
		st.x+= canvasOffset.r/80. ;
		st.y+= canvasOffset.g/80.  ;


		if (u_distortFactor>0.){
			float distortFactor = u_distortFactor;
			st.x+=  cnoise(vec3(st*2.,30.))/(30.)*distortFactor  ;
			st.y+= cnoise(vec3(st*20.,30.))/(30.)*distortFactor   
				+ cnoise(vec3(st/2.,30.))/(100.)*distortFactor;
			
		}
		vec4 texColor0 = texture2D(u_tex,st);
		
		//offset color Blocks
		float offsetColor = 1./200.;
		stBorder.x-=(0.5-texColor0.r-texColor0.b/2.)*offsetColor;
		stBorder.y-=(0.5- texColor0.g)*offsetColor+ texColor0.b*offsetColor;
		
		vec4 texColor1 = texture2D(u_tex,st);

		
		vec2 st2 = st;
		//brush feeling  
		float brushFactor = 5000.;
		// st2.x+=cnoise(vec3(st*1000.,100.))/brushFactor;
		// st2.y+=cnoise(vec3(st*1000.,1000.))/brushFactor; 
 
		vec4 texColor2 = texture2D(u_tex,st2);
		vec2 st3 = st;
		// st3.x += pNoise(st * 500., 10) / 2.;
		// st3.y += pNoise(st * 500., 10) / 2.;
		vec4 texColor3 = texture2D(u_tex, st3);

		texColor2 = (texColor2*1. + texColor3*1.)/1.2;
		
		float d = distance(vec2(0.5) ,st);  
		// texColor*=1.-d+0.3;
		// gl_FragColor= vec4(color,1.0)+texColor2; 
		
		float borderWidth = 30.;
		bool isBorder = stBorder.x*u_resolution.x<borderWidth
		|| (1.-stBorder.x)*u_resolution.x<borderWidth 
		|| stBorder.y*u_resolution.y<borderWidth 
		|| (1.-stBorder.y)*u_resolution.y<borderWidth;
		// isBorder=false;
		if (!u_hasBorder){
			isBorder=false;
		}
		float fade = 1.-distance(st,vec2(0.5))/5.;
		
		float modLen = 0.01;
		vec2 modSt = mod(st, vec2(modLen, modLen));
		vec2 stStroke = st - modSt;
		
		vec4 texColor4 = texture2D(u_tex,stStroke);
		if (abs(modSt.x - modSt.y) > modLen/3.) {
			texColor4 = vec4(255.);
		}

		vec4 result ;
		result = texColor1 * 0.8 + (texColor1 * texColor2 / 1.9 + texColor1 / 4. + texColor2 / 4.) / 5. ;
		// result = texColor4;
		// result.r*=fade;
		// result.g *= fade;
		// result.b *= fade;

		result*=0.95+texColor0/10.;
		result*=0.95+ vec4(canvasOffset,1.)/50.;
		// result = mix(result-mod(result,0.04),result,0.1  );

		
		result = mix(result ,result*result,0.05  );

		float ps = pNoise(st*50.,5);
		result.b *= 0.95+pNoise(st*3.+result.b + ps,3)/5.;
		result.g *= 0.95+pNoise(st*3.+result.g+ ps,3)/5.;
		result.r *= 0.95+pNoise(st*3.+result.r+ ps,3)/5.;


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
			st*=vec2(4.,1.);
		
			// st.y = 1.0 - st.y;
			vec3 color = vec3(0.); 
		  
			color+= pNoise(st*vec2(600. ,1.) + vec2(0, pNoise(st*vec2(400.,1.),10)*50.),10)/2.; 
			color/=1.5;
		
			
			
			color = 1.-color;
			color*= 1.+pNoise(st*10. + pNoise(st*50.,5),3); 


			color*=vec3(1.,1.,0.96);
		
		// vec3 color = vec3(st.x,st.y,1.);
		gl_FragColor= vec4(color,1.0);
	}
`
