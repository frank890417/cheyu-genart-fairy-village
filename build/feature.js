
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

