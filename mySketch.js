// noprotect
let themes = [{
		label: "Forest",
		colors: "073b3a-0b6e4f-08a045-6bbf59-ddb771-fff".split("-").map(a => "#" + a)
	},

	{
		label: "Blackwhite",
		colors: "fff-eee-eaeaea-fafafa-111".split("-").map(a => "#" + a),
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
		label: "cyber",
		colors: "000-28190e-71f79f-3dd6d0-15b097-fff".split("-").map(a => "#" + a),
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
	}
]

// {
// 	label: "Sunset",
// 	colors: "61210f-ea2b1f-edae49-f9df74-f9edcc-3d1212-fff".split("-").map(a => "#" + a)
// }
//"fff-9fa2b2-3c7a89-2e4756-16262e-000-fff-9fa2b2-3c7a89-2e4756-16262e-000-fff".split("-").map(a=>"#"+a),


var features = {}


let colors
var DEFAULT_SIZE = 1440;
let ratio = 1000 / 1000
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
			pointCount: random([3, 5, 6, 7, 8, 9]),
			followRotateFactor: random(features.rotateFactors),
			color: random(colors),
			altColor: random(colors),
			//200 is original (x moving a lot)
			steps: [int(random([2, 3, 10, 20, 30, 50, 120, 150])), int(random([2, 3, 4]))],
			shrinkRatio: random([0.995, 0.99, 0.99, 0.98, 0.95]),
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
	}
	draw(g) {
		let useR = this.r
		if (useR < 0) return
		g.push()
		// g.blendMode(MULTIPLY)
		let clr = color(this.color)
		g.fill(clr)
		g.drawingContext.shadowColor = color(0, 6)
		g.drawingContext.shadowOffsetY = 10
		g.drawingContext.shadowOffsetX = 10
		// let dir = this.p.copy().sub(createVector(width / 2, height / 2)).heading()
		// let shadowPanBase = 20
		// g.drawingContext.shadowOffsetY = cos(dir) * shadowPanBase
		// g.drawingContext.shadowOffsetX = sin(dir) * shadowPanBase

		if (features.style == "glow") {
			if (frameCount % 16 == 1) {
				if (this.randomId % 500 != 0 || useR > 50) {
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
				g.blendMode(SCREEN)
				g.fill(bgColor)
				g.noStroke()
			}
		}
		if (features.style == "pure") {
			if (frameCount % 30 == 1) {
				if (frameCount % 150 == 1 && useR > 36) {
					g.strokeWeight(3)
				} else {
					g.drawingContext.setLineDash([1.5, 3])
				}
				if (frameCount == 1) {
					g.strokeWeight(8)
				}
				// if (brightness(this.color) < 50) {
				// 	g.stroke(255, 100)
				// } else {
				g.stroke(0, 200)
				// g.stroke(0, 60)
				// }

				// g.fill(255)

			}

		}
		if (features.style == "pure") {
			g.drawingContext.shadowColor = color(0, 7)
		}
		if (features.style == "squiggle") {
			g.drawingContext.shadowColor = color(0, 20)
		}

		g.translate(this.p.x, this.p.y)
		// g.scale(map(this.p.y, 0, height, 0, 2))
		// g.translate((this.p.x - width / 2) * map(this.p.y, 0, height, 0.5, 2) + width / 2, (this.p.y - width / 2) / 1.2 + width / 2)


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
			g.drawingContext.shadowOffsetY = 10
			g.drawingContext.shadowOffsetX = 10
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
			g.drawingContext.shadowOffsetY = 10
			g.drawingContext.shadowOffsetX = 10
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
			g.translate(0, -frameCount / (30 + noise(10, this.randomId) * 20))
			g.drawingContext.shadowOffsetY = 10
			g.drawingContext.shadowOffsetX = 10
			g.ellipse(0, 0, useR, useR)
		}
		g.pop()


		//grass
		if (this.randomId % 50 == 0 && frameCount % 120 == 0 && useR > 2) {

			// g.fill(bgColor)
			g.push()
			g.translate(useR + 20, 0)
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


		g.pop()

	}
	update() {
		if (this.randomId % 1 == 0 && abs(brightness(color(this.altColor)) - brightness(color(this.color))) < 85) {
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
		this.r *= this.shrinkRatio


		if (this.r < 0.1) {
			this.alive = false
		}
		if (frameCount > 650 && random() < 0.04 && this.randomId % 6 <= 3) {
			this.alive = false
		}
		if (features.style == 'level' && frameCount > 300 && random() < 0.03) {
			this.alive = false
		}
		if (features.style != 'pure' && features.style != 'level' &&
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
		}
		if (features.style == "level") {

			let colorId = int(noise(this.p.x / 800, this.p.y / 800) * colors.length * 2 + 1 + (0.5 + noise(this.p.x / 50, this.p.y / 50) / 2) * frameCount / features.levelSpeed) % colors.length
			this.color = colors[colorId]

		}

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
	noiseSeed(random() * 10000)

	theShader = new p5.Shader(this.renderer, vert, frag)
	theShaderTexture = new p5.Shader(this.renderer, vert, frag_texture)

	features = calFeatures()
	colors = random(themes).colors

	colors = colors.sort((a, b) => random([-0.5, 0.5]))
	sortedColors = colors.sort((a, b) => brightness(color(b)) - brightness(color(a)))
	console.log(features)
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
	let rscale = random([1.05, 1.1, 1.15, 1.2])

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

	let spanOptions = [10, 12, 16, 20, 32, 44, 60, 68, 72]
	let maxSizeOptions = [250, 300, 350, 400, 550, 600, 740, 800, 900]

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


		//noprotect
		for (let x = 0; x <= width; x += span) {
			if (noise(x / 2) < ignorePossibility) continue
			let skipRatio = features.shapeType == 'rect' ? -0.75 : -0.8
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
			minRingR = width / 3
			maxRingR = map(noise(seed + 1), 0, 1, 1, 1.1) * width
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
		let blockWidth = map(noise(seed), 0, 1, 0.1, 0.15) * width
		let blockHeight = map(noise(seed + 1), 0, 1, 0.3, 0.5) * height
		let useMaxSize = features.shapeType == 'rect' ? (maxSize * 1) : features.shapeType == 'polygon' ? (maxSize * 1) : maxSize
		let direction = random() < 0.5
		for (let pan = -1; pan <= 1; pan++) {
			for (var x = -blockWidth; x < blockWidth; x += span) {
				for (var y = -blockHeight; y < blockHeight; y += span) {
					let xx = x + pan * blockWidth * 3 + width / 2
					let yy = y + pan * blockHeight / 2 + height / 2
					if (direction) {
						let temp = xx
						xx = yy
						yy = temp
					}
					particles.push(new Particle({
						p: createVector(xx, yy),
						r: noise(x, y) * useMaxSize * random(1) * random(1),
						color: colors[int(noise(xx / gapScale, yy / gapScale) * colors.length * 4) % colors.length],
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


	// particles.forEach(p => {
	// 	p.color = bgColor
	// 	// p.color2 = bgColor
	// })
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
	theShader.setUniform('u_hasBorder', features.hasBorder)
	webGLCanvas.clear()


	// webGLCanvas.background(bgColor)
	background(100)
	fill(0)
	rect(0, 0, width * 2, height * 2)

	webGLCanvas.rect(-width / 2, -height / 2, width, height)
	// webGLCanvas.push()
	// webGLCanvas.rotateY(frameCount / 100)
	// // webGLCanvas.box(800, 800, 800)
	// webGLCanvas.pop()

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
	let gridSpan = 20
	push()
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

	// for (let x = 0; x < width; x += gridSpan) {
	// 	for (let y = 0; y < height; y += gridSpan) {
	// 		if (noise(x / 10, y) > 0.6) {
	// 			stroke(200, 200)
	// 			arc(x - gridSpan / 2 + sin(y) * gridSpan, y + gridSpan / 2, gridSpan, gridSpan, PI, PI * 3 / 2)
	// 			arc(x + sin(y) * gridSpan, y, gridSpan, gridSpan, PI / 2, PI)
	// 		}
	// 	}
	// }

	image(webGLCanvas, 0, 0)
	// blendMode(ADD)
	// image(webGLCanvas, 0, 0)

	push()

	// image(webGLCanvas,0,0)
	image(overlayGraphics, 0, 0)
	pop()
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
}

function keyPressed() {
	if (key == 's') {
		saveCanvas(tokenData.hash + '.png')
	}
	if (key == 'b') {
		features.hasBorder = !features.hasBorder
	}

}