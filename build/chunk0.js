
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
