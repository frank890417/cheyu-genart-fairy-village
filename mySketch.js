
var features = {}
//#FEATURE_START
let projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
let mintNumber = parseInt(tokenData.tokenId) % (projectNumber * 1000000);
let seed = parseInt(tokenData.hash.slice(0, 16), 16);

class Random {
	constructor(seed = 0) {
		this.seed = seed;
	}
	random() {
		return this.random_dec();
	}
	random_dec() {
		//  return hashRand();
		/* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
		this.seed ^= this.seed << 13;
		this.seed ^= this.seed >> 17;
		this.seed ^= this.seed << 5;
		return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
	}
	random_num(a, b) {
		if (b === undefined) {
			b = a;
			a = 0;
		}
		return a + (b - a) * this.random_dec();
	}
	random_int(a, b) {
		if (b === undefined) {
			b = a;
			a = 0;
		}
		return Math.floor(this.random_num(a, b + 1));
	}
	random_bool(p) {
		return this.random_dec() < p;
	}
	random_choice(list) {
		return list[Math.floor(this.random_num(0, list.length * 0.99))];
	}

	random_choice_weight(obj) {
		let sum = Object.values(obj).reduce((a, b) => a + b, 0);
		let steps = Object.values(obj).reduce(
			(arr, num) => {
				arr.push((arr.slice(-1) || 0) * 1 + num);
				return arr;
			},
			[0]
		);
		let ran = this.random_num(0, sum);
		let result = 0;
		for (let i = steps.length - 1; i >= 1; i--) {
			result = i - 1;
			if (ran > steps[i - 1] && ran < steps[i]) {
				break;
			}
		}
		return Object.keys(obj)[result];
	}
}

let R = new Random(seed);

let random = (obj, obj2) => {
	//random()
	if (obj == undefined) {
		return R.random_dec()
	}
	//random([1,2,3])
	if (Array.isArray(obj)) {
		return R.random_choice(obj)
	}
	//random(50)
	if (typeof obj == 'number' && typeof obj2 == 'number') {
		return R.random_num(obj, obj2)
	}
	//random(50)
	if (typeof obj == 'number' && obj2 == undefined) {
		return R.random_num(0, obj)
	}
	if (typeof obj == 'object') {
		return R.random_choice_weight(obj)

	}
}



function calFeatures() {
	features.style = random({
		mix: 9,
		glow: 3,
		area: 8,
		pure: 1,
		level: 4,
		// stroke: 1000
	})
	features.mapScale = random(200, 1000)
	features.levelSpeed = random([15, 20, 30, 40])
	features.type3D = random(['static', 'sharp'])
	features.type3D = 'static'
	// features.style=random()<1?'stroke':'normal'
	// features.style=random()<0.2?'shape':features.style 
	features.rotateFactors = random([
		[0],
		[0],
		[0],
		[0],
		[0, 0.05],
		[0, -0.05],
		[0.05, 0, 0, 0, 0, 0, 0, -0.05]

	])
	features.minPairId = random({
		0: 30,
		1: 10,
		2: 5,
		3: 5,
	}) * 1
	features.maxPairId =
		random({
			5: 1,
			6: 10,
			7: 5,
			8: 5
		}) * 1
	features.layout = random({
		natural: 3,
		ring: 2,
		blocks: 1,
		spiral: 1,
		chess: 1,
		pie: 1,
	})

	features.vNoiseScale = random([40, 50, 75, 100, 120])
	features.hasGrid = false
	features.hasBorder = true
	features.wormholeCount = random([1, 2, 3])
	features.colorChangeFramSpan = random([30, 40, 60, 100])
	features.shapeType = random({
		'rect': 4,
		'ellipse': 5,
		'polygon': 3,
		'triangle': 1,
		'noise': 1
	})
	features.distortFactor = features.shapeType == 'ellipse' ? 0.8 : 0.1
	features.hasDeco = true

}
calFeatures()
//#FEATURE_END

let pushpop = (func) => {
	push()
	func()
	pop()
}
//%
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
//%
// noprotect
let themes = [
	{
		label: "Algae",
		colors: "d9ed92-b5e48c-76c893-52b69a-34a0a4-1a759f-1e6091-184e77-ffbf69-fff".split("-").map(a => "#" + a)
	},
	{
		label: "Forest",
		colors: "073b3a-0b6e4f-08a045-6bbf59-ddb771-fff".split("-").map(a => "#" + a)
	},

	{
		label: "Blackwhite",
		colors: "eee-eaeaea-fafafa-111-fff".split("-").map(a => "#" + a),
	},

	{
		label: "Carnival",
		colors: "d72638-3f88c5-f49d37-140f2d-f22b29-fe4a49-fed766-7fbb8f-009fb7-e6e6ea-fff-102a54".split("-").map(a => "#" + a),
	},

	{
		label: "Modern",
		colors: "0e131f-38405f-59546c-8b939c-ff2244-2c0735-fff".split("-").map(a => "#" + a),
	},

	{
		label: "Pastel",
		colors: "261447-f1e3f3-c2bbf0-8fb8ed-62bfed-3590f3-fff-FF8680".split("-").map(a => "#" + a),
	},

	{
		label: "Taxi",
		colors: "ffc854-000-ffc854-000-fff".split("-").map(a => "#" + a),
	},

	{
		label: "Breeze",
		colors: "07252F-7c6a0a-babd8d-ffdac6-fa9500-eb6424-FCFBF6".split("-").map(a => "#" + a),
	},

	{
		label: "Rainbow",
		colors: "e71d36-ffca3a-b5e48c-1982c4-03045e-fff".split("-").map(a => "#" + a),
	},
	{
		label: "Cold",
		colors: "0a369d-4472ca-5e7ce2-92b4f4-cfdee7-fff-000".split("-").map(a => "#" + a),
	},

	// {
	// 	label: "HoneyMustard",
	// 	colors: "584d3d-9f956c-cbbf7a-f4e87c-ebf38b-fed766-fff-ffa856-000-e5dede".split("-").map(a => "#" + a),
	// },

	{
		label: "Enchanted",
		colors: "e6e1c6-afac96-c0bda5-cc978e-f39c6b-f96a68-ff3864-261447-3a2958-fff".split("-").map(a => "#" + a),
	},

	{
		label: "Delicious",
		colors: "000-1b2618-daddd8-c7d59f-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-FF715B".split("-").map(a => "#" + a)
	},
	{
		label: "fire",
		colors: "a20021-f52f57-f79d5c-f3752b-ededf4-000".split("-").map(a => "#" + a)
	},
	{
		label: "",
		colors: "ebe9e9-f3f8f2-3581b8-fcb07e-dee2d6-181175".split("-").map(a => "#" + a)
	},
	{
		label: "Energetic",
		colors: "000000-1A4D2E-FF9F29-FAF3E3-FEE0C0-ff5c3f".split("-").map(a => "#" + a)
	}
]




let colors

//001427
//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144

class Wormhole {
	constructor(args) {
		let def = {
			p: createVector(0, 0),
			intensity: random([-5, 5]),
			r: 500,
			rotate: 1,
			attract: 1
		}
		Object.assign(def, args)
		Object.assign(this, def)
	}
	update() { }
}
class Particle {
	constructor(args) {
		let def = {
			p: createVector(0, 0),
			lastP: createVector(-1, -1),
			v: createVector(0, 0),
			a: createVector(0, 0),
			r: random(100),
			pointCount: random([3, 5, 6, 7, 8, 9]),
			followRotateFactor: random(features.rotateFactors),
			color: random(colors),
			altColor: random(colors),
			//200 is original (x moving a lot)
			steps: [int(random([2, 3, 10, 20, 30, 50, 120, 150])), int(random([2, 3, 4]))],
			shrinkRatio: random([0.995, 0.99, 0.99, 0.98, random(0.9, 0.95)]),
			vNoiseScale: features.vNoiseScale,
			color2: random([255, 255, random(colors)]),
			alive: true,
			randomId: int(random(10000)),
			xSpeedFactor: random([6, 8, 10, 12]),
			ySpeedFactor: random([6, 8, 10, 12])

		}
		def.maxR = def.r
		Object.assign(def, args)
		Object.assign(this, def)
		this.originalP = this.p.copy()
	}
	draw(g) {
		let useR = this.r
		if (useR < 0) return

		g.push()

		let clr = color(this.color)
		let shClr = color(0)
		g.fill(clr)
		shClr.setAlpha((12 - map(this.r, 100, 0, 0, 5, true)) * 0.7)
		g.drawingContext.shadowColor = shClr
		shClr.setAlpha(255)
		g.drawingContext.shadowOffsetY = 5
		g.drawingContext.shadowOffsetX = 5

		///----
		// g.drawingContext.shadowColor = color(0, 0)
		// g.drawingContext.shadowOffsetY = 0
		// g.drawingContext.shadowOffsetX = 0
		// g.blendMode(BLEND)
		//

		if (features.style == "glow") {
			if (frameCount % 16 == 1) {
				if (this.randomId % 400 != 0) {
					g.fill(bgColor)
				} else {
					clr.setAlpha(50)
					g.fill(clr)
					g.blendMode(SCREEN)
				}
				g.strokeWeight(2)
				if (frameCount == 1) g.strokeWeight(4)
				g.stroke(clr)
				let fogColor = color(this.color)
				fogColor.setAlpha(50)
				g.drawingContext.shadowColor = fogColor

			} else {
				g.strokeWeight(0.2)
				g.blendMode(SCREEN)
				g.fill(bgColor)
				g.noStroke()
			}
		}
		if (features.style == "pure" || features.style == "area") {
			if (frameCount % 50 == 1) {
				if (frameCount % 150 == 1 && useR > 36) {
					g.strokeWeight(3)
				} else {
					g.strokeWeight(3)
					g.drawingContext.setLineDash([1, 3])
				}
				// if (frameCount == 1) {
				// 	g.strokeWeight(8)
				// }
				// if (brightness(this.color) < 50) {
				// 	g.stroke(255, 100)
				// } else {
				g.stroke(0, 100)
				// g.stroke(0, 60)
				// }

				// g.fill(255)

			}

		}
		if (features.style == "pure") {
			g.drawingContext.shadowColor = color(0, 7)
		}
		g.translate(this.p.x, this.p.y)
		g.push()
		if (features.shapeType == "polygon") {
			g.translate(0, -frameCount / (6 + noise(10, seed) * 2))
			g.rotate(frameCount / 500)
			if (this.randomId % 40 == 0) {
				g.rotate(frameCount / 100 + this.randomId % 2)
			}
			// g.drawingContext.shadowColor = color(0, 4)
			g.beginShape()
			let lines = []
			for (let i = 0; i < this.pointCount; i++) {
				let ang = i / this.pointCount * 2 * PI
				let rr = useR * 0.8
				g.vertex(cos(ang) * rr, sin(ang) * rr)
				if (this.randomId % 200 == 0) {
					lines.push([cos(ang) * rr, sin(ang) * rr])
				}
			}
			g.endShape(CLOSE)

			lines.forEach(line => {
				g.line(-useR / 5, 0, line[0], line[1])
			})


		} else if (features.shapeType == "triangle") {

			g.translate(0, -frameCount / (8 + noise(10, seed) * 2))
			g.rotate(frameCount / 2000)
			if (this.randomId % 40 == 0) {
				g.rotate(frameCount / 1200 + this.randomId % 2)
			}
			g.drawingContext.shadowOffsetY = 5
			g.drawingContext.shadowOffsetX = 5
			g.drawingContext.shadowColor = color(0, 5)

			g.beginShape()
			let lines = []
			for (let i = 0; i < 3; i++) {
				let ang = i / (this.pointCount) * 2 * PI
				let rr = useR * 1.25
				g.vertex(cos(ang) * rr, sin(ang) * rr)
				if (this.randomId % 200 == 0) {
					lines.push([cos(ang) * rr, sin(ang) * rr])
				}
			}
			g.endShape(CLOSE)

			lines.forEach(line => {
				g.line(-useR / 5, 0, line[0], line[1])
			})


		} else if (features.shapeType == "rect" || features.shapeType == "squiggle") {
			g.translate(frameCount / 20, frameCount / 20)
			let rd = [0, 0, 0, 0]

			if (features.shapeType == "squiggle") {
				rd = [
					int(noise(this.randomId) * useR),
					int(noise(this.randomId * 2) * useR),
					int(noise(this.randomId * 3) * useR),
					int(noise(this.randomId * 4) * useR)
				]
			}
			if (features.shapeType == "squiggle") {
				g.rotate(map(noise(this.randomId * 10), 0, 1, -3, 3) * frameCount / (30 + 100 * noise(this.p.x / 100, this.p.y / 100)) + noise(this.randomId))
			}
			if (frameCount == 1) {

				g.push()
				g.stroke(this.color)
				g.fill(bgColor)
				g.strokeWeight(2)
				g.rect(0, 0, useR * 1.1 * 1., useR * 1.1 * 1., rd[0], rd[1], rd[2], rd[3])
				g.pop()
			}
			g.drawingContext.shadowOffsetY = 5
			g.drawingContext.shadowOffsetX = 5
			if (this.randomId % 3 == 0 && frameCount > 400 + noise(this.randomId * 5) * 300) {
				g.rect(0, 0, useR / 3, useR / 3)
				g.rect(useR * 2 / 3, 0, useR / 3, useR / 3)
				g.rect(0, useR * 2 / 3, useR / 3, useR / 3)
				g.rect(useR * 2 / 3, useR * 2 / 3, useR / 3, useR / 3)
			} else {
				g.rect(0, 0, useR * 1., useR * 1., rd[0], rd[1], rd[2], rd[3])

			}

			if (this.randomId % 80 == 0) {
				g.line(0, 0, useR, useR)
				g.line(0, useR, useR, 0)
			}

			if (frameCount % 80 == 1 && this.randomId % 3 == 0) {
				g.strokeWeight(1)
				for (var y = 0; y < useR - 15; y += 10) {
					g.push()
					g.translate(useR, y + 10)
					g.rotate(-PI / 4)
					g.fill(this.color)
					g.ellipse(0, 0, 1, y % 100 == 0 ? 20 : 5)
					g.pop()
				}
				for (var x = 0; x < useR; x += 10) {
					g.push()
					g.translate(x, useR)
					g.rotate(-PI / 4)
					g.fill(this.color)
					g.rect(0, 0, 1, x % 100 == 0 ? 20 : 5)
					g.pop()
				}
			}


		} else if (features.shapeType == "ellipse") {
			if (frameCount == 1) {

				g.push()
				g.stroke(this.color)
				g.fill(bgColor)
				g.strokeWeight(2)
				g.ellipse(0, 0, useR, useR)

				g.pop()
			}
			g.drawingContext.shadowColor = color(0, 5)
			g.translate(-frameCount / (60 + noise(10, this.randomId) * 20), -frameCount / (60 + noise(10, this.randomId) * 20))
			g.drawingContext.shadowOffsetY = 5
			g.drawingContext.shadowOffsetX = 5
			g.ellipse(0, 0, useR, useR)

			// if (frameCount%50==0 && useR > 10){
			// 	for(let i=0;i<2*PI;i+=2*PI/10){
			// 		g.push()
			// 		g.translate(useR/2*cos(i),useR/2*sin(i) )
			// 		g.fill(bgColor)
			// 		g.rotate(random(-0.3,0.3))
			// 		g.rect(0,0,1,random(20))
			// 		g.pop()
			// 	}
			// }


		} else if (features.shapeType == "noise") {
			if (this.randomId % 3 == 0 || this.randomId % 4 == 0) {

				// g.noStroke()

				let d = dist(this.p.x, this.p.y, width / 2, height / 2) + 5
				let ang = atan2(this.p.y - height / 2, this.p.x - width / 2)
				// g.drawingContext.shadowColor = color(0, 10)
				// g.drawingContext.shadowOffsetX = -d * cos(ang) / 40
				// g.drawingContext.shadowOffsetY = -d * sin(ang) / 40
				let angSpan = noise(this.randomId) * 0.4 + 0.03
				g.beginShape()
				for (let ang = 0; ang < 2 * PI; ang += angSpan) {
					let freq = noise(this.randomId) * 300 + 100
					let useAng = ang + noise(frameCount / freq, ang, this.randomId) + this.randomId % 360
					let useR = 1.2 * this.r * noise(frameCount / freq, ang, this.randomId)
					let xx = cos(useAng) * useR
					let yy = sin(useAng) * useR
					vertex(xx, yy)
				}
				g.endShape(CLOSE)
			}
		}
		g.pop()


		if (features.hasDeco) {

			// stroke decos
			let verticalLineSpan = 40
			if (features.style == "shape") verticalLineSpan = 30

			if (features.style == "stroke") verticalLineSpan = 35
			// vertical lines

			// //grass
			// if (this.randomId % 50 == 0 && frameCount % 120 == 0 && useR > 2) {

			// 	// g.fill(bgColor)
			// 	g.push()
			// 	g.translate(useR + 20, 0)
			// 	g.stroke(this.color2)
			// 	g.translate(0, random([-this.r, this.r]))
			// 	g.line(0, 0, 0, -5)
			// 	g.line(0, 0, -3, -5)
			// 	g.line(0, 0, 3, -5)
			// 	g.pop()
			// }

			if (this.randomId % verticalLineSpan == 0) {
				g.fill(0)
				g.ellipse(0, useR + 10, 2, 2)
			}

			if (this.randomId % 25 == 0) {

				g.fill(bgColor)
				g.ellipse(useR / 2, 0, 2, 2)
			}
			if (this.randomId % 80 == 0) {

				g.fill(255)
				let whiteR = (noise(this.randomId, this.p.x / 40, this.p.y / 40) * 2) + 1
				g.ellipse(-useR - 10, useR + 10, whiteR, whiteR)
			}
			if (useR > 10 && (this.randomId + frameCount) % 60 == 0 && this.randomId % 4 == 0) {
				g.fill(this.color2)
				g.ellipse(-this.r, 4, 4)
			}
			if (random() < 0.001 && frameCount % 10 == 0) {
				g.stroke(0)
				g.noFill()
				g.ellipse(0, useR + 10, random(this.r))
			}

		}

		g.pop()

	}
	update() {
		if (abs(brightness(color(this.altColor)) - brightness(color(this.color))) < 85) {
			this.color = lerpColor(color(this.color), color(this.altColor), 0.005)
		}
		if (this.randomId % 40 == 0 && frameCount % 50 == 0) {
			this.r -= 10
			this.p.x += 5
			this.p.y += 5
		}
		if (this.randomId % 77 == 0 && frameCount % 50 == 0) {
			this.r *= 1.05
			this.p.x += 5
			this.p.y += 5
		}
		this.p.add(this.v)
		this.v.add(this.a)
		// if (features.type3D == 'static') {
		// this.r -= this.shrinkRatio
		// } else if (features.type3D == 'sharp') {
		if (this.r * this.shrinkRatio < 1) {
			this.r -= 1
		} else {
			this.r *= this.shrinkRatio
		}
		// }



		if (this.shrinkRatio >= 1) {
			if (frameCount > 50 + 100 * noise(this.randomId)) {
				this.alive = false
			}
		}


		if (this.r <= 4) {
			this.alive = false
		}
		if (frameCount > 650 && random() < 0.04 && this.randomId % 6 <= 3) {
			this.alive = false
		}
		if (features.style == 'level' && frameCount > 300 && random() < 0.03) {
			this.alive = false
		}
		if (this.p.x + this.r > width + this.r * 5 || this.p.x - this.r < -this.r * 5 || this.p.y + this.r > height + this.r * 5 || this.p.y - this.r < -this.r * 5) {
			this.alive = false
		}
		if (features.style != 'pure' && features.style != 'level' && features.style != 'area' &&
			random() < 0.25 && frameCount % features.colorChangeFramSpan == 0 && this.randomId % 5 == 0) {
			this.color = random(colors)
			this.color2 = lerpColor(color(random(colors)), color(this.color), 0.6)
		}

		let steplize = (n, l) => int(n * l) / l
		// if (this.randomId%25==0){
		this.v.x = (steplize(noise(this.p.x / this.vNoiseScale, this.p.y / this.vNoiseScale) - 0.5, this.steps[0])) * this.xSpeedFactor
		this.v.y = (steplize(noise(this.p.y / this.vNoiseScale, this.p.x / this.vNoiseScale) - 0.5, this.steps[1])) * this.ySpeedFactor

		let ang = atan2(this.p.y - height / 2, this.p.x - width / 2)
		let r = dist(this.p.x, this.p.y, width / 2, height / 2)

		//rotate center
		this.v.x += cos(ang + PI / 2) * this.followRotateFactor;
		this.v.y += sin(ang + PI / 2) * this.followRotateFactor;


		// // go away from center
		// this.v.x += -cos(ang) * 0.2
		// this.v.y += -sin(ang) * 0.2;


		wormholes.forEach(w => {
			let ang = atan2(this.p.y - w.p.y, this.p.x - w.p.x)
			let dd = dist(this.p.x, this.p.y, w.p.x, w.p.y)
			let ratio = map(dd, 0, w.r, 1, 0, true)
			let force = w.intensity * ratio * ratio

			//rotate center
			this.v.x += w.rotate * force * cos(ang + PI / 2) + w.attract * force * cos(ang);
			this.v.y += w.rotate * force * sin(ang + PI / 2) + w.attract * force * sin(ang);
		})



		//test

		// 		if (noise(this.p.x/120,this.p.y/120)<0.2){

		// 			// originalGraphics.fill('red')
		// 			// originalGraphics.ellipse(this.p.x,this.p.y,5,5)
		// 			this.v.x+=sin(this.p.y/50)*50
		// 			this.v.y+=cos(this.p.x/50)*50
		// 		}


		//quantize angle
		if (noise(this.p.x / 60, this.p.y / 60) < 0.2) {
			let ang = atan2(this.v.x, this.v.y)
			let amp = this.v.mag()
			let angStepCount = 8
			let newAng = int(ang / 2 / PI * angStepCount) / angStepCount * 2 * PI
			this.v.x = amp * cos(newAng)
			this.v.y = amp * sin(newAng)

		}


		if (features.style == 'pure') {
			this.color = colors[2]
			this.color2 = colors[2]
		}
		if (features.style == 'area') {
			let colorId = int(noise(this.p.x / features.mapScale, this.p.y / features.mapScale) * colors.length * 2) % colors.length
			let c1 = colors[colorId]
			let c2 = colors[(colorId + 1) % colors.length]
			this.color = lerpColor(color(c1), color(c2), map(frameCount, 0, 600 * (0.5 + noise(this.p.x / 50, this.p.y / 50) / 2), 0, 1, true))
		}

		if (features.style == "level") {
			let colorId = int(noise(this.p.x / 800, this.p.y / 800) * colors.length * 2 + 1 + (0.5 + noise(this.p.x / 50, this.p.y / 50) / 2) * frameCount / features.levelSpeed) % colors.length
			this.color = colors[colorId]

		}

	}

}

let sh1, shTxt;
//wC
let wC
//Original Graphics
let oG
// overlay Graphics
let olayG
let particles = []
let wormholes = []
let overallTexture
let bgColor
let sortedColors = []
let selectedTheme
function preload() {
	noiseSeed(random() * 10000)

	sh1 = new p5.Shader(this.renderer, vert, frag)
	shTxt = new p5.Shader(this.renderer, vert, frag_texture)

	selectedTheme = random(themes)
	colors = selectedTheme.colors

	if (selectedTheme.label != 'Rainbow') {
		colors = colors.sort((a, b) => random([-0.5, 0.5]))
	}

	sortedColors = colors.sort((a, b) => brightness(color(b)) - brightness(color(a)))

}
//%

let cnv
let minW = Math.min(window.innerWidth, window.innerHeight)
let originalW = 1400
let ratio = 1400/1200
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = HEIGHT;
// var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE;
console.log("hw", HEIGHT / WIDTH, ratio)
// if (HEIGHT / WIDTH > 1 / ratio) {
// 	DIM = WIDTH / ratio
// 	M = DIM / DEFAULT_SIZE
// }
console.log('dim', DIM, WIDTH, HEIGHT, M)

function windowResized() {
	let minW = window.innerWidth
	let minH = minW / ratio;

	if (minH > window.innerHeight) {
	  minH = window.innerHeight;
	  minW = minH * ratio;
	}
	// resizeCanvas(minW, minH);
	cnv.elt.style.width = minW + "px"
	cnv.elt.style.height = minH + "px"
} 
function setup() {
	pixelDensity(2);
	noiseSeed(random() * 50000)
	randomSeed(random() * 5000)
	cnv = createCanvas(originalW, originalW/ratio); 
	background(0)

	//prepare texture
	overallTexture = createGraphics(width, height, WEBGL)
	overallTexture.shader(shTxt)
	shTxt.setUniform('u_resolution', [width, height])
	// theShaderTexture.setUniform('u_canvas_tex',overallTexture)
	overallTexture.rect(-width / 2, -height / 2, width, height)

	wC = createGraphics(width, height, WEBGL)
	oG = createGraphics(width, height)
	olayG = createGraphics(width, height)

	wC.noStroke()
	olayG.noStroke()
	oG.noStroke()

	let rx = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * width;
	let ry = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * height
	let ra = random([-0.2, -0.1, 0.1, 0.2])
	let rscale = random([0.95, 1, 1.05, 1.1])

	for (let g of [oG, olayG]) {
		// console.log(g)
		g.translate(rx, ry)
		g.translate(width / 2, height / 2)
		g.rotate(ra)
		g.scale(rscale)
		g.scale(0.9)
		g.translate(-width / 2, -height / 2)

	}


	background(100)

	oG.noStroke()

	// bgColor = color(20)
	bgColor = color(random(colors))
	if (random() < 0.5) {
		bgColor = color(random([sortedColors[0], sortedColors.slice(-1)[0]]))
	}
	if (features.style == "glow") {
		bgColor = color(0)
	}
	if (features.style == "pure") {
		bgColor = color(colors[2])
	}



	let pairId = int(random(7))

	let spanOptions = [12, 14, 16, 20, 32, 44, 60, 68, 72]
	let maxSizeOptions = [240, 280, 340, 380, 520, 560, 700, 760, 820]

	let minPairId = features.minPairId
	let maxPairId = features.maxPairId
	let span = spanOptions[pairId]
	let maxSize = maxSizeOptions[pairId]
	let pairNoiseScale = random([10, 20, 100, 200])

	let ignorePossibility = random([0.05, 0.3])
	let gapScale = random([150, 200, 250, 300])
	let gapRatio = random([0.35, 0.4, 0.45, 0.5])
	let panScale = random([0, 1, 2, 5, 10, 15, 20, 25])
	let panRatio = random([0, 0, random([0, 5, 10, 15])])

	if (features.layout == "natural") {

		for (let x = 0; x <= width; x += span) {
			if (noise(x / 2) < ignorePossibility) continue
			let skipRatio = features.shapeType == 'rect' ? -0.8 : -0.85
			// if (features.shapeType == 'rect') {
			if (sin(x + seed * PI) < skipRatio) continue
			// }
			//noprotect
			for (let y = 0; y <= height; y += span) {
				// if (cos(y + seed * 2 + PI) < skipRatio) continue

				// if (noise(x,y)<ignorePossibility) continue
				if (noise(x / gapScale, y / gapScale) <= gapRatio) continue
				particles.push(new Particle({
					p: createVector(x, y),
					r: noise(x, y) * maxSize * random(1),
					color: colors[int(noise(x / gapScale * 2, y / gapScale * 2) * colors.length * 2) % colors.length],
				}))

				let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
				span = spanOptions[pairId]
				maxSize = maxSizeOptions[pairId]
			}
		}

	} else if (features.layout == "ring" || features.layout == "pie") {
		let minRingR = map(noise(seed), 0, 1, 0.25, 0.4) * width
		let maxRingR = map(noise(seed + 1), 0, 1, 0.5, 0.7) * width
		let baseX = width / 2,
			baseY = height / 2
		if (features.layout == "pie") {
			manRingR = 0
			baseX = random([0, 1]) * width
			baseY = random([0, 1]) * height
			minRingR =map(noise(100,seed ), 0, 1, 1/3, 1/2) * width
			maxRingR = map(noise(seed + 1), 0, 1, 1, 1.2) * width
			span *= 0.9
		}

		for (var ang = 0; ang <= 2 * PI; ang += 0.1) {
			for (var r = minRingR; r < maxRingR; r += span) {
				let x = r * cos(ang) + baseX
				let y = r * sin(ang) + baseY
				let size = sqrt(r) * 1.5 + noise(x, y) * maxSize / 1.5 * random(1)
				// if (features.layout == "radio") {
				// 	x = width / 2
				// 	y = height / 2
				// 	size = random(width / 2)
				// }
				if (noise(x / gapScale, y / gapScale) <= gapRatio / 1.5) continue
				particles.push(new Particle({
					p: createVector(x, y),
					r: size,
					color: colors[int(noise(r / gapScale * 1.5, ang * 1.5) * colors.length * 2) % colors.length],
				}))
				let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
				span = spanOptions[pairId]
				maxSize = maxSizeOptions[pairId]
			}
		}

		for (let i = 0; i < 50; i++) {
			particles.push(new Particle({
				p: createVector(width / 2 + random(-minRingR * 0.3, minRingR * 0.3), height / 2 + random(-minRingR * 0.3, minRingR * 0.3)),
				r: random(minRingR / 1.9),
				color: random(colors)
			}))
		}
	} else if (features.layout == "blocks") {
		let useMaxSize = features.shapeType == 'rect' ? (maxSize * 1) : features.shapeType == 'polygon' ? (maxSize * 1.3) : maxSize
		let direction = random() < 0.5
		let blockWidth = map(noise(seed), 0, 1, 0.1, 0.15) * (direction ? height : width)
		let blockHeight = map(noise(seed + 1), 0, 1, 0.3, 0.5) * (direction ? width : height)
		for (let pan = -1; pan <= 1; pan++) {
			for (var x = -blockWidth; x < blockWidth; x += span) {
				for (var y = -blockHeight; y < blockHeight; y += span) {
					let xx = x + pan * blockWidth * 3 + (direction ? width : height) / 2
					let yy = y + pan * blockHeight / 2 + (direction ? width : height) / 2
					if (direction) {
						let temp = xx
						xx = yy
						yy = temp
					}
					particles.push(new Particle({
						p: createVector(xx, yy),
						r: noise(x, y) * useMaxSize * random(1) * random(1),
						color: colors[int(noise(xx / gapScale, yy / gapScale, pan * 500) * colors.length * 4) % colors.length],
					}))
					let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
					span = spanOptions[pairId]
					maxSize = maxSizeOptions[pairId]
				}

			}
		}
	} else if (features.layout == "spiral") {
		let sprialScale = map(noise(seed * 5), 0, 1, 0.65, 1.05)
		let blockWidth = map(noise(seed), 0, 1, 0.1, 0.15) * width
		let blockHeight = map(noise(seed + 1), 0, 1, 0.3, 0.5) * height
		let useMaxSize = features.shapeType == 'rect' ? (maxSize * 1.2) : features.shapeType == 'polygon' ? (maxSize * 1.25) : maxSize * 1.25

		let pan = 0
		for (let r = 0; r < width * 0.6; r += span / 2) {
			for (let ang = 0; ang <= PI * 0.15; ang += 0.05) {
				let useR = sprialScale * (r + noise(ang * 500) * r * 0.6 + map(ang, PI / 2, PI, 0, 1, true) * noise(r * 100) * width / 1.2)
				let xx = useR * cos(ang + pan * PI + r / 40) + width / 2
				let yy = useR * sin(ang + pan * PI + r / 40) + height / 2
				particles.push(new Particle({
					p: createVector(xx, yy),
					r: sqrt(r) * 1.5 + noise(r / 4, ang / 4) * useMaxSize * random(1) * random(1),
					color: colors[int(noise(r / gapScale, ang * 2) * colors.length * 3) % colors.length],
				}))
				let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
				span = spanOptions[pairId]
				maxSize = maxSizeOptions[pairId]
			}
		}

		// }
	} else if (features.layout == "chess") {
		let chessPan = random([0, 1])
		//noprotect
		for (let x = 0; x <= width; x += span) {
			if (noise(x / 2) < ignorePossibility) continue
			let skipRatio = features.shapeType == 'rect' ? -0.75 : -0.8
			// if (features.shapeType == 'rect') { 
			// }
			//noprotect
			for (let y = 0; y <= height; y += span) {
				// if (cos(y + seed * 2 + PI) < skipRatio) continue
				let chessCount = random([2, 3])
				let chessX = int(x / (width / chessCount))
				let chessY = int(y / (height / chessCount))
				if ((chessX + chessY + chessPan) % 2 == 1) continue
				if (noise(x, y) < ignorePossibility) continue
				particles.push(new Particle({
					p: createVector(x, y),
					r: (0.5 + noise(x, y) / 2) * maxSize / 2 * random(1),
					color: colors[max(int(chessX * colors.length / 3 + chessY * colors.length / 3 + noise(x / gapRatio, y / gapRatio) * colors.length), 0) % colors.length]
				}))

				let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
				span = spanOptions[pairId]
				maxSize = maxSizeOptions[pairId]
			}
		}
	}
	// particles.sort((a, b) => random() < 0.5)

	for (let i = 0; i < features.wormholeCount; i++) {
		let w = new Wormhole({
			p: createVector(random(-width * 0.2, width * 1.2), random(-height * 0.2, height * 1.2)),
			r: random(100, 600),
			intensity: random([-1, 1]) / 10,
			rotate: random([-1, 1]),
			attract: random([-1, 1])
		})
		wormholes.push(w)
		// overlayGraphics.push()
		// overlayGraphics.stroke('blue')
		// overlayGraphics.strokeWeight(5)
		// overlayGraphics.translate(w.p.x,w.p.y)
		// overlayGraphics.line(-10,-10,10,10)
		// overlayGraphics.line(-10,10,10,-10)
		// overlayGraphics.pop()
		// originalGraphics.ellipse(w.p.x,w.p.y,50,50)	
	}


	noLoop()
	// while (particles.length >= 100) 
	let renderCount = 1000
	let counter = renderCount

	let signPoints = [
		[126.7180202224328, 74.62338403438254],
		[125.71668153434713, 73.62238102535545],
		[117.70597202966172, 70.61937199827422],
		[112.69927858923334, 69.61836898924713],
		[100.68321433220522, 69.61836898924713],
		[91.67116613943413, 71.62037500730129],
		[87.66581138709144, 72.62137801632838],
		[69.64171500154927, 79.62839907951795],
		[62.63234418494954, 87.63642315173459],
		[57.62565074452115, 96.64545023297832],
		[56.62431205643548, 99.64845926005957],
		[57.62565074452115, 108.6574863413033],
		[58.626989432606834, 109.65848935033038],
		[69.64171500154927, 113.6625013864387],
		[98.68053695603388, 110.65949235935746],
		[112.69927858923334, 105.65447731422206],
		[136.73140710328957, 96.64545023297832],
		[166.77156774585984, 79.62839907951795],
		[170.77692249820254, 75.62438704340963],
		[173.78093856245957, 73.62238102535545],
		[173.78093856245957, 74.62338403438254],
		[169.77558381011687, 78.62739607049086],
		[169.77558381011687, 79.62839907951795],
		[168.7742451220312, 81.63040509757211],
		[168.7742451220312, 81.63040509757211],
		[169.77558381011687, 80.62940208854502],
		[171.77826118628823, 78.62739607049086],
		[177.7862933148023, 76.6253900524367],
		[178.78763200288796, 76.6253900524367],
		[183.79432544331632, 81.63040509757211],
		[183.79432544331632, 82.6314081065992],
		[185.7970028194877, 84.63341412465336],
		[185.7970028194877, 84.63341412465336],
		[202.81976051694417, 79.62839907951795],
		[209.82913133354393, 74.62338403438254],
		[210.8304700216296, 74.62338403438254],
		[210.8304700216296, 76.6253900524367],
		[209.82913133354393, 78.62739607049086],
		[209.82913133354393, 79.62839907951795],
		[226.8518890310004, 79.62839907951795],
		[231.85858247142878, 77.62639306146379],
		[236.86527591185717, 72.62137801632838],
		[237.86661459994284, 72.62137801632838],
		[237.86661459994284, 72.62137801632838],
		[237.86661459994284, 73.62238102535545],
		[241.87196935228556, 73.62238102535545],
		[259.8960657378277, 72.62137801632838],
		[260.8974044259134, 71.62037500730129],
		[260.8974044259134, 71.62037500730129],
		[261.89874311399905, 72.62137801632838],
		[269.9094526186845, 74.62338403438254],
		[275.91748474719856, 74.62338403438254],
		[281.9255168757126, 74.62338403438254],
		[310.9643388301972, 68.61736598022006],
		[326.985757839568, 64.61335394411172],
		[345.0098542251102, 59.60833889897632],
		[366.0379666749094, 54.60332385384092],
		[369.04198273916643, 53.60232084481383],
		[371.04466011533776, 51.60031482675967]
	]
	let render = () => {
		draw()
		frameCount = renderCount - counter

		pushpop(() => {

			

			background(0)
			translate(width / 2, height / 2)
			textSize(200)
			// fill(0)
			// circle(0, 0, 200, 200)
			noStroke()
			fill(255)
			arc(0, 0, 100, 100, 0, counter / renderCount * PI * 2)

			let useSignPoints = signPoints.slice(0, int(signPoints.length * (1 - counter / renderCount)))
			// let useSignPoints = []
			pushpop(() => {
				beginShape()
				noFill()
				stroke(255)
				scale(0.6)
				rotate(0.05)
				translate(-200, 100)
				for (let p of useSignPoints) {
					curveVertex(p[0], p[1])
				}
				strokeWeight(2.5)
				endShape()
			})

		})
		// console.log(counter)
		if (counter > 0) {

			requestAnimationFrame(render)
		} else {
			drawToMainCanvas()
		}
		// if (frameCount % 3 == 0) {
		drawToMainCanvas()
		// }

		counter -= 1
	}
	requestAnimationFrame(render)

	windowResized()
}

function drawToMainCanvas() {
	console.log("Draw To main")

	pushpop(() => {
		wC.shader(sh1)
		sh1.setUniform('u_resolution', [width, height])
		sh1.setUniform('u_time', millis() / 1000)
		sh1.setUniform('u_mouse', [mouseX / width, mouseY / height])
		sh1.setUniform('u_tex', oG)
		sh1.setUniform('u_bgColor', [bgColor._getRed() / 255., bgColor._getGreen() / 255., bgColor._getBlue() / 255.])
		sh1.setUniform('u_canvas_tex', overallTexture)
		sh1.setUniform('u_distortFactor', features.distortFactor)
		sh1.setUniform('u_hasBorder', features.hasBorder)
		wC.clear()


		// webGLCanvas.background(bgColor)
		background(100)
		fill(0)
		rect(0, 0, width * 2, height * 2)

		wC.rect(-width / 2, -height / 2, width, height)


		fill(bgColor);
		rect(0, 0, width, height)
		let gridSpan = 20


		pushpop(() => {
			if (features.hasGrid) {
				if (features.shapeType == 'rect') {
					push()
					blendMode(MULTIPLY)

					//test grid
					for (let x = -gridSpan * 2; x <= width + gridSpan; x += gridSpan) {
						stroke(0, 20)
						line(x, 0, x, height)
					}
					for (let y = -gridSpan * 2; y <= height + gridSpan; y += gridSpan) {
						stroke(0, 20)
						line(0, y, width, y)
					}
					pop()
				}
				if (features.shapeType == 'ellipse') {
					blendMode(BLEND)
					for (var i = 0; i < 3; i++) {

						push()
						strokeWeight(1)
						translate(width / 2, height / 2)
						rotate(i / 3 * PI * 2)
						translate(-width / 2, -height / 2)
						for (let x = -gridSpan * 8; x <= width + gridSpan * 4; x += 50) {
							stroke(255, 80)
							line(x, 0, x, height + gridSpan * 10)
						}
						pop()
					}
				}

			}
		})

		pushpop(() => {
			drawingContext.filter = ""
			image(wC, 0, 0)
			if (features.style == 'glow') {
				blendMode(SCREEN)
				drawingContext.globalAlpha = 0.3
				drawingContext.filter = "blur(100px)"
				image(wC, 20, 20) 
			}
			blendMode(BURN)
			drawingContext.globalAlpha = 0.3
			image(wC, 0, 0)

		})

		pushpop(() => {
			image(olayG, 0, 0,width,height) 
			
		})

		pushpop(() => {
			blendMode(MULTIPLY)
			noStroke()
			image(overallTexture, 0, 0,width,height)

		})

	})
}

function draw() {
	oG.noStroke()

	particles.forEach(p => {
		p.update()
		p.draw(oG)
	})
	particles = particles.filter(p => p.alive)

}

function keyPressed() {
	if (key == 's') {
		saveCanvas(tokenData.hash + '.png')
	}
	if (key == 'b') {
		features.hasBorder = !features.hasBorder
	}

}