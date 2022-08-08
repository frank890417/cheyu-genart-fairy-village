
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
	}
]

//#FEATURE_START
var features = {}

function calFeatures() {
	features.style = random({
		mix: 3,
		glow: 1,
		area: 9,
		pure: 1,
		level: 1
		// stroke: 1000
	})
	features.mapScale = random(500, 2800)
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
		2: 1,
		3: 1,
		4: 1
	}) * 1
	features.maxPairId =
		random({
			5: 1,
			6: 5,
			7: 10,
			8: 5
		}) * 1
	features.layout = random({
		natural: 4,
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
		'triangle': 1
	})
	features.distortFactor = features.shapeType == 'ellipse' ? 0.8 : 0.1

}
calFeatures()

//#FEATURE_END

let colors
var DEFAULT_SIZE = 1400;
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
	}
	draw(g) {
		let useR = this.r
		if (useR < 0) return
		g.push()
		// g.blendMode(MULTIPLY)
		let clr = color(this.color)
		let shClr = color(0)
		g.fill(clr)
		shClr.setAlpha(10 - map(this.r, 100, 0, 0, 4, true))

		g.drawingContext.shadowColor = shClr
		shClr.setAlpha(255)
		g.drawingContext.shadowOffsetY = 10
		g.drawingContext.shadowOffsetX = 10
		// let dir = this.p.copy().sub(createVector(width / 2, height / 2)).heading()
		// let shadowPanBase = 20
		// g.drawingContext.shadowOffsetY = cos(dir) * shadowPanBase
		// g.drawingContext.shadowOffsetX = sin(dir) * shadowPanBase

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
				g.blendMode(SCREEN)
				g.fill(bgColor)
				g.noStroke()
			}
		}
		if (features.style == "pure" || features.style == "area") {
			if (frameCount % 30 == 1) {
				if (frameCount % 150 == 1 && useR > 36) {
					g.strokeWeight(3)
				} else {
					g.drawingContext.setLineDash([1.5, 3])
				}
				// if (frameCount == 1) {
				// 	g.strokeWeight(8)
				// }
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


		// stroke decos
		let verticalLineSpan = 40
		if (features.style == "shape") verticalLineSpan = 30

		if (features.style == "stroke") verticalLineSpan = 35
		// vertical lines

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


		if (this.r <= 2) {
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
