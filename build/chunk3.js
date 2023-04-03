

function setup() {

	pixelDensity(2);

	noiseSeed(random() * 50000)
	randomSeed(random() * 5000)
	cnv = createCanvas(DIM * ratio, DIM);
	width = DEFAULT_SIZE * ratio;
	height = DEFAULT_SIZE;
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
			minRingR = width / 3
			maxRingR = map(noise(seed + 1), 0, 1, 1, 0.75) * width
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
	let renderCount = 500
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

			scale(M)

			// background(0)
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
}

function drawToMainCanvas() {
	console.log("Draw To main")

	pushpop(() => {
		scale(M)
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
				pop()
			}
		})

		pushpop(() => {
			image(olayG, 0, 0)
		})

		pushpop(() => {
			blendMode(MULTIPLY)
			noStroke()
			image(overallTexture, 0, 0)

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