// noprotect
let themes = [
	// "d72638-3f88c5-f49d37-140f2d-f22b29-fe4a49-fed766-7fbb8f-009fb7-e6e6ea-fff-102a54".split("-").map(a => "#" + a),
	// "0e131f-38405f-59546c-8b939c-ff0035-2c0735-fff".split("-").map(a => "#" + a),
	// "261447-f1e3f3-c2bbf0-8fb8ed-62bfed-3590f3-fff-FF8680".split("-").map(a => "#" + a),
	// "ffc854-000-ffc854-000-fff".split("-").map(a => "#" + a),
	// "07252F-7c6a0a-babd8d-ffdac6-fa9500-eb6424-FCFBF6".split("-").map(a => "#" + a),
	"000-71f79f-3dd6d0-15b097-28190e-fff".split("-").map(a => "#" + a)

]
// "0a369d-4472ca-5e7ce2-92b4f4-cfdee7-fff".split("-").map(a => "#" + a),
// "584d3d-9f956c-cbbf7a-f4e87c-ebf38b-fed766-fff-ffa856-000-e5dede".split("-").map(a => "#" + a),
// "e6e1c6-afac96-c0bda5-cc978e-f39c6b-f96a68-ff3864-261447-3a2958-fff".split("-").map(a => "#" + a),
// "daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-FF715B".split("-").map(a => "#" + a)
//"fff-9fa2b2-3c7a89-2e4756-16262e-000-fff-9fa2b2-3c7a89-2e4756-16262e-000-fff".split("-").map(a=>"#"+a),


var features = {}


let colors
var DEFAULT_SIZE = 1250;
let ratio = 1250 / 1000
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
	update() {}
}
class Particle {
	constructor(args) {
		let def = {
			p: createVector(0, 0),
			lastP: createVector(-1, -1),
			v: createVector(0, 0),
			a: createVector(0, 0),
			r: random(100),
			followRotateFactor: random(features.rotateFactors),
			color: random(colors),
			altColor: random(colors),
			//200 is original (x moving a lot)
			steps: [int(random([2, 3, 10, 20, 30, 50, 120, 150])), int(random([2, 3, 4]))],
			shrinkRatio: random([0.995, 0.99, 0.99, 0.98, 0.95]),
			vNoiseScale: features.vNoiseScale,
			color2: random([255, 255, random(colors)]),

			randomId: int(random(10000)),
			xSpeedFactor: random([6, 8, 10, 12]),
			ySpeedFactor: random([6, 8, 10, 12])

		}
		Object.assign(def, args)
		Object.assign(this, def)
	}
	draw(g) {
		g.push()
		// g.blendMode(MULTIPLY)
		let clr = color(this.color)
		// 			clr.setAlpha(500*map(this.r,200,0,0.02,0,true))
		// 			let colorVar = 30
		// 			clr.setRed(clr._getRed()+noise(this.p.x/5,this.p.y/5)*colorVar-colorVar/2)
		// 			clr.setGreen(clr._getGreen()+noise(1000,this.p.x/5,this.p.y/5)*colorVar-colorVar/2)
		// 			clr.setBlue(clr._getBlue()+noise(this.p.x/5,1000,this.p.y/5)*colorVar-colorVar/2)


		// 			if (
		// 			g.stroke(clr)
		// 			g.blendMode(MULTIPLY)
		// 			if (frameCount>10) return
		// 			g.noFill()
		g.fill(clr)

		g.translate(this.p)
		if (features.style == "normal") {
			g.push()

			if (features.shapeType == "triangle") {
				g.rotate(frameCount / 50)
				g.triangle(0, -this.r / 2, this.r / 2, this.r / 2, 0, this.r / 2)

			} else if (features.shapeType == "rect") {
				// if (frameCount % 500 == 30) {
				// 	g.strokeWeight(1)
				// 	g.stroke(bgColor)
				// } 
				g.rect(0, 0, this.r, this.r)
			} else if (features.shapeType == "ellipse") {
				g.ellipse(0, 0, this.r, this.r)
			}
			g.pop()
			// //fill 
			// if (features.shapeType=="ellipse"){
			// }
			// // g.ellipse(0, 0, this.r, this.r)
			// // g.triangle(0, 0, this.r, this.r, 0, this.r)
			// g.rect(0, 0, this.r, this.r)



			// if (noise(this.p.x/300,this.p.y/300)<0.3 && random()<0.02){
			// 	overlayGraphics.push()
			// 		overlayGraphics.noStroke()
			// 		overlayGraphics.fill(clr)
			// 		overlayGraphics.rect(this.p.x+random(-this.r,this.r),this.p.y+random(-this.r,this.r),20,-20,10)
			// 	overlayGraphics.pop()
			// }
		}


		// g.ellipse(this.r*2+10,0,3,3)

		//grass
		if (this.randomId % 50 == 0 && frameCount % 120 == 0 && this.r > 2) {

			// g.fill(bgColor)
			g.push()
			g.translate(this.r + 20, 0)
			g.stroke(this.color2)
			g.translate(0, random([-this.r, this.r]))
			g.line(0, 0, 0, -5)
			g.line(0, 0, -3, -5)
			g.line(0, 0, 3, -5)
			g.pop()
		}

		let verticalLineSpan = 40
		if (features.style == "shape") verticalLineSpan = 30

		if (features.style == "stroke") verticalLineSpan = 35
		// vertical lines
		if (this.randomId % verticalLineSpan == 0) {
			g.fill(0)
			g.ellipse(0, this.r + 10, 2, 2)
		}

		if (this.randomId % 25 == 0) {

			g.fill(bgColor)
			g.ellipse(this.r / 2, 0, 2, 2)
		}
		if (this.randomId % 60 == 0) {

			g.fill(255)
			let whiteR = (noise(this.randomId, this.p.x / 40, this.p.y / 40) * 2) + 1
			g.ellipse(-this.r - 10, this.r + 10, whiteR, whiteR)
		}
		if (this.r > 10 && (this.randomId + frameCount) % 60 == 0 && this.randomId % 4 == 0) {
			g.fill(this.color2)
			g.ellipse(-this.r, 4, 4)
		}
		// if (features.style == 'normal' && frameCount % 50 == 0 && this.randomId % 100 == 0 && random() < 0.6) {
		// 	g.push()
		// 	let lineSp = random([5, 10, 20, 30, 40])
		// 	let lineCount = random(20)
		// 	for (var i = 0; i < random(lineCount); i++) {
		// 		let lLan = 5
		// 		g.stroke(0, 100)
		// 		g.line(-this.r - 10 - lLan, -i * lineSp, -this.r - 10 + lLan, -i * lineSp)
		// 	}
		// 	g.pop()
		// }
		// g.ellipse(this.r+10,this.r+10,2,2)
		if (random() < 0.001 && frameCount % 10 == 0) {
			g.stroke(0)
			g.noFill()
			g.ellipse(0, this.r + 10, random(this.r))
		}



		// g.rotate(PI/4-PI/2)
		// g.rect(0,0,-this.r*2,2)
		g.pop()
	}
	update() {
		if (abs(brightness(color(this.altColor)) - brightness(color(this.color))) < 90) {
			this.color = lerpColor(color(this.color), color(this.altColor), 0.005)
		}
		this.p.add(this.v)
		this.v.add(this.a)
		this.r *= this.shrinkRatio
		this.alive = this.r > 0.1
		if (random() < 0.25 && frameCount % 30 == 0 && this.randomId % 5 == 0) {
			this.color2 = random(colors)
			this.color = random(colors)
			// this.color = lerpColor(color(this.color), color(this.altColor), random([0.1]))
			// this.color2 = random(colors)
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
		// 		}else{
		// 			this.v.x = (steplize(noise(this.p.x/50,this.p.y/50)-0.5,this.steps[0]))*this.xSpeedFactor
		// 			this.v.y = (steplize(noise(this.p.y/50,this.p.x/50)-0.5,this.steps[1]))*this.ySpeedFactor

		// 		}

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
			// originalGraphics.fill('red')
			// originalGraphics.ellipse(this.p.x,this.p.y,5,5)

		}


		// this.v.add(this.p.copy().sub(createVector(width/2,height/2)).mult(-0.002))
	}

}

let theShader, theShaderTexture;
let webGLCanvas
let originalGraphics
let overlayGraphics
let particles = []
let wormholes = []
let overallTexture
let bgColor
let sortedColors = []

function preload() {
	// console.log(random)
	// randomSeed(3390)
	noiseSeed(random() * 10000)
	colors = random(themes)

	sortedColors = colors.sort((a, b) => brightness(color(b)) - brightness(color(a)))


	theShader = new p5.Shader(this.renderer, vert, frag)
	theShaderTexture = new p5.Shader(this.renderer, vert, frag_texture)
	// overallTexture = loadImage("canvas-light.jpeg") 


	features.style = 'normal'
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
	features.vNoiseScale = random([40, 50, 75, 100, 120])
	features.hasGrid = false
	features.wormholeCount = random([1, 2, 3])
	features.shapeType = random(['rect', 'ellipse'])
	features.distortFactor = features.shapeType == 'ellipse' ? 0.8 : 0.0
}

function setup() {

	pixelDensity(4);

	noiseSeed(random() * 50000)
	randomSeed(random() * 5000)
	cnv = createCanvas(DIM * ratio, DIM);
	width = DEFAULT_SIZE * ratio;
	height = DEFAULT_SIZE;
	background(0)

	//prepare texture
	overallTexture = createGraphics(width, height, WEBGL)
	overallTexture.shader(theShaderTexture)
	theShaderTexture.setUniform('u_resolution', [width, height])
	// theShaderTexture.setUniform('u_canvas_tex',overallTexture)
	overallTexture.rect(-width / 2, -height / 2, width, height)


	webGLCanvas = createGraphics(width, height, WEBGL)
	originalGraphics = createGraphics(width, height)
	overlayGraphics = createGraphics(width, height)

	webGLCanvas.noStroke()
	overlayGraphics.noStroke()
	originalGraphics.noStroke()

	let rx = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * width;
	let ry = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * height
	let ra = random([-0.2, -0.1, 0.1, 0.2])
	let rscale = random([1.05])

	for (let g of [originalGraphics, overlayGraphics]) {
		// console.log(g)
		g.translate(rx, ry)
		g.translate(width / 2, height / 2)
		g.rotate(ra)
		// if (!features.style=="normal"){
		g.scale(rscale)
		// }
		g.translate(-width / 2, -height / 2)
	}


	background(100)

	originalGraphics.noStroke()

	// bgColor = color(240)
	bgColor = color(random(colors))

	// if (features.style == "normal") {
	// 	bgColor = color(random(sortedColors))
	// } else {
	// 	bgColor = color(random(sortedColors.slice(0, 2).concat(['#fff'])))
	// }
	if (features.style == "stroke") bgColor = color(255)
	if (features.style == "shape") bgColor = color(255)

	// bgColor = color('#f9f9f7')
	// bgColor=color(255)


	// originalGraphics.background(bgColor); 

	let pairId = int(random(7))

	let spanOptions = [8, 10, 12, 20, 32, 44, 60, 68]
	let maxSizeOptions = [160, 200, 300, 400, 500, 600, 840, 900]

	let minPairId = 0
	let maxPairId = 7
	let span = spanOptions[pairId]
	let maxSize = maxSizeOptions[pairId]
	let pairNoiseScale = random([10, 20, 100, 200])

	let ignorePossibility = random([0.05, 0.3])
	let gapScale = random([150, 200, 250, 300])
	let gapRatio = random([0.35, 0.4, 0.45, 0.5])
	let panScale = random([0, 1, 2, 5, 10, 15, 20, 25])
	let panRatio = random([0, 0, random([0, 5, 10, 15])])
	// console.log(span,maxSize)
	//noprotect
	for (let x = 0; x <= width; x += span) {
		if (noise(x / 2) < ignorePossibility) continue
		if (features.shapeType == 'rect') {
			if (sin(x + seed) < 0.2) continue
		}
		//noprotect
		for (let y = 0; y <= height; y += span) {
			// if (noise(x,y)<ignorePossibility) continue
			if (noise(x / gapScale, y / gapScale) <= gapRatio) continue
			particles.push(new Particle({
				p: createVector(x, y),
				r: noise(x, y) * maxSize * random(1),
				color: random(colors)
			}))

			let pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId))
			span = spanOptions[pairId]
			maxSize = maxSizeOptions[pairId]

		}
	}

	// particles.sort((a,b)=>random()<0.5)

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
}


function draw() {
	scale(M)


	webGLCanvas.shader(theShader)
	theShader.setUniform('u_resolution', [width, height])
	theShader.setUniform('u_time', millis() / 1000)
	theShader.setUniform('u_mouse', [mouseX / width, mouseY / height])
	theShader.setUniform('u_tex', originalGraphics)
	theShader.setUniform('u_bgColor', [bgColor._getRed() / 255., bgColor._getGreen() / 255., bgColor._getBlue() / 255.])
	theShader.setUniform('u_canvas_tex', overallTexture)
	theShader.setUniform('u_distortFactor', features.distortFactor)

	webGLCanvas.clear()


	// webGLCanvas.background(bgColor)
	background(100)
	fill(0)
	rect(0, 0, width * 2, height * 2)

	webGLCanvas.rect(-width / 2, -height / 2, width, height)
	// webGLCanvas.noStroke()
	// webGLCanvas.push()
	// webGLCanvas.rotateY(frameCount/300)
	// webGLCanvas.sphere(500-frameCount/2)
	// webGLCanvas.pop()

	particles.forEach(p => {
		p.update()
		p.draw(originalGraphics)

		// if (random()<0.005 && frameCount<5000){
		// 	let p1 = random(particles), p2 = random(particles)
		// 	overlayGraphics.push()
		// 	overlayGraphics.blendMode(MULTIPLY)
		// 	overlayGraphics.stroke(0,2)
		// 	overlayGraphics.strokeWeight(0.4)
		// 	overlayGraphics.line(p1.p.x,p1.p.y,p2.p.x,p2.p.y)
		// 	overlayGraphics.pop()
		// }

	})
	particles = particles.filter(p => p.alive)

	originalGraphics.noStroke()
	// originalGraphics.fill(255)
	// originalGraphics.noStroke()
	// originalGraphics.ellipse(mouseX, mouseY, 10, 10);


	fill(bgColor);
	rect(0, 0, width, height)

	push()
	// if (features.hasGrid) {
	// 	blendMode(MULTIPLY)
	// 	//test grid
	// 	for (let x = 0; x < width; x += gridSpan) {
	// 		stroke(0, 20)
	// 		line(x, 0, x, height)
	// 	}
	// 	for (let y = 0; y < height; y += gridSpan) {
	// 		stroke(0, 20)
	// 		line(0, y, width, y)
	// 	}
	// }
	blendMode(BLEND)

	let gridSpan = 20
	// for (let x = 0; x < width; x += gridSpan) {
	// 	for (let y = 0; y < height; y += gridSpan) {
	// 		if (noise(x / 10, y) > 0.6) {
	// 			stroke(200, 200)
	// 			arc(x - gridSpan / 2 + sin(y) * gridSpan, y + gridSpan / 2, gridSpan, gridSpan, PI, PI * 3 / 2)
	// 			arc(x + sin(y) * gridSpan, y, gridSpan, gridSpan, PI / 2, PI)
	// 		}
	// 	}
	// }

	if (features.style == 'normal') {
		image(webGLCanvas, 0, 0)
		// blendMode(ADD)
		// image(webGLCanvas, 0, 0)

		push()

		// image(webGLCanvas,0,0)
		image(overlayGraphics, 0, 0)
		pop()
	}
	pop()
	// pop()
	// 	push()
	// 		blendMode(MULTIPLY)

	// image(originalGraphics,0,0)
	// 	pop()
	// push()
	// 	// blendMode(ADD)
	// 	stroke(bgColor)
	// 	noFill()
	// 	strokeWeight(40)
	// 	rect(0,0,width,height)
	// pop()

	push()
	blendMode(MULTIPLY)
	noStroke()
	image(overallTexture, 0, 0)
	// blendMode(SCREEN)
	// image(overallTexture,0,0,1920,1080)
	// image(overallTexture,0,0,height/1080*1920 ,height)
	pop()
	// if (frameCount % 500 == 1) {
	// 	for (var i = 0; i < height; i += 200) {
	// 		overlayGraphics.stroke(bgColor)
	// 		overlayGraphics.strokeWeight(10)
	// 		overlayGraphics.line(0, i, width, i)
	// 	}
	// }

	// if (features.style != 'normal') {
	// 	push()
	// 	blendMode(MULTIPLY)

	// 	image(webGLCanvas, 0, 0)
	// 	image(overlayGraphics, 0, 0)
	// 	pop()
	// }
}