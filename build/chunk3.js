

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
	let rscale = random([1.05, 1.1, 1.15, 1.2])

	for (let g of [oG, olayG]) {
		// console.log(g)
		g.translate(rx, ry)
		g.translate(width / 2, height / 2)
		g.rotate(ra)
		g.scale(rscale)
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


	// particles.forEach(p => {
	// 	p.color = bgColor
	// 	// p.color2 = bgColor
	// })
}


function draw() {
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
		p.draw(oG)

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

	oG.noStroke()
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


	image(wC, 0, 0)

	push()

	image(olayG, 0, 0)
	pop()
	pop()
	push()
	blendMode(MULTIPLY)
	noStroke()
	image(overallTexture, 0, 0)
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