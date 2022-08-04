"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// noprotect
var themes = [{
  label: "Forest",
  colors: "073b3a-0b6e4f-08a045-6bbf59-ddb771-fff".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Blackwhite",
  colors: "fff-eee-eaeaea-fafafa-111".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Carnival",
  colors: "d72638-3f88c5-f49d37-140f2d-f22b29-fe4a49-fed766-7fbb8f-009fb7-e6e6ea-fff-102a54".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Modern",
  colors: "0e131f-38405f-59546c-8b939c-ff2244-2c0735-fff".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Pastel",
  colors: "261447-f1e3f3-c2bbf0-8fb8ed-62bfed-3590f3-fff-FF8680".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Taxi",
  colors: "ffc854-000-ffc854-000-fff".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Breeze",
  colors: "07252F-7c6a0a-babd8d-ffdac6-fa9500-eb6424-FCFBF6".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "cyber",
  colors: "000-28190e-71f79f-3dd6d0-15b097-fff".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Cold",
  colors: "0a369d-4472ca-5e7ce2-92b4f4-cfdee7-fff-000".split("-").map(function (a) {
    return "#" + a;
  })
}, // {
// 	label: "HoneyMustard",
// 	colors: "584d3d-9f956c-cbbf7a-f4e87c-ebf38b-fed766-fff-ffa856-000-e5dede".split("-").map(a => "#" + a),
// },
{
  label: "Enchanted",
  colors: "e6e1c6-afac96-c0bda5-cc978e-f39c6b-f96a68-ff3864-261447-3a2958-fff".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "Delicious",
  colors: "000-1b2618-daddd8-c7d59f-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-FF715B".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "fire",
  colors: "a20021-f52f57-f79d5c-f3752b-ededf4-000".split("-").map(function (a) {
    return "#" + a;
  })
}, {
  label: "",
  colors: "ebe9e9-f3f8f2-3581b8-fcb07e-dee2d6-181175".split("-").map(function (a) {
    return "#" + a;
  })
}]; // {
// 	label: "Sunset",
// 	colors: "61210f-ea2b1f-edae49-f9df74-f9edcc-3d1212-fff".split("-").map(a => "#" + a)
// }
//"fff-9fa2b2-3c7a89-2e4756-16262e-000-fff-9fa2b2-3c7a89-2e4756-16262e-000-fff".split("-").map(a=>"#"+a),

var features = {};
var colors;
var DEFAULT_SIZE = 1440;
var ratio = 1000 / 1000;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = HEIGHT; // var DIM = Math.min(WIDTH, HEIGHT);

var M = DIM / DEFAULT_SIZE;
console.log("hw", HEIGHT / WIDTH, ratio); // if (HEIGHT / WIDTH > 1 / ratio) {
// 	DIM = WIDTH / ratio
// 	M = DIM / DEFAULT_SIZE
// }

console.log('dim', DIM, WIDTH, HEIGHT, M); //001427
//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144

var Wormhole =
/*#__PURE__*/
function () {
  function Wormhole(args) {
    _classCallCheck(this, Wormhole);

    var def = {
      p: createVector(0, 0),
      intensity: random([-5, 5]),
      r: 500,
      rotate: 1,
      attract: 1
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  _createClass(Wormhole, [{
    key: "update",
    value: function update() {}
  }]);

  return Wormhole;
}();

var Particle =
/*#__PURE__*/
function () {
  function Particle(args) {
    _classCallCheck(this, Particle);

    var def = {
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
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  _createClass(Particle, [{
    key: "draw",
    value: function draw(g) {
      var _this = this;

      g.push(); // g.blendMode(MULTIPLY)

      var clr = color(this.color);
      g.fill(clr);
      g.drawingContext.shadowColor = color(0, 6);
      g.drawingContext.shadowOffsetY = 10;
      g.drawingContext.shadowOffsetX = 10; // let dir = this.p.copy().sub(createVector(width / 2, height / 2)).heading()
      // let shadowPanBase = 20
      // g.drawingContext.shadowOffsetY = cos(dir) * shadowPanBase
      // g.drawingContext.shadowOffsetX = sin(dir) * shadowPanBase

      if (features.style == "glow") {
        if (frameCount % 16 == 1) {
          if (this.randomId % 500 != 0 || this.r > 50) {
            g.fill(bgColor);
          } else {
            clr.setAlpha(50);
            g.fill(clr);
            g.blendMode(SCREEN);
          }

          g.strokeWeight(2);
          if (frameCount == 1) g.strokeWeight(3);
          g.stroke(clr);
          var fogColor = color(this.color);
          fogColor.setAlpha(50);
          g.drawingContext.shadowColor = fogColor;
        } else {
          g.blendMode(SCREEN);
          g.fill(bgColor);
          g.noStroke();
        }
      }

      if (features.style == "pure") {
        if (frameCount % 30 == 1) {
          if (frameCount % 150 == 1 && this.r > 36) {
            g.strokeWeight(3);
          } else {
            g.drawingContext.setLineDash([1.5, 3]);
          } // if (frameCount == 1) {
          // 	g.strokeWeight(20)
          // }
          // if (brightness(this.color) < 50) {
          // 	g.stroke(255, 100)
          // } else {


          g.stroke(0, 200); // g.stroke(0, 60)
          // }
          // g.fill(255)
        }
      }

      if (features.style == "pure") {
        g.drawingContext.shadowColor = color(0, 7);
      }

      g.translate(this.p.x, this.p.y); // g.scale(map(this.p.y, 0, height, 0, 2))
      // g.translate((this.p.x - width / 2) * map(this.p.y, 0, height, 0.5, 2) + width / 2, (this.p.y - width / 2) / 1.2 + width / 2)

      g.push();

      if (features.shapeType == "polygon") {
        g.translate(0, -frameCount / (6 + noise(10, seed) * 2));
        g.rotate(frameCount / 500);

        if (this.randomId % 40 == 0) {
          g.rotate(frameCount / 100 + this.randomId % 2);
        } // g.drawingContext.shadowColor = color(0, 4)


        g.beginShape();
        var lines = [];

        for (var i = 0; i < this.pointCount; i++) {
          var ang = i / this.pointCount * 2 * PI;
          var rr = this.r * 0.8;
          g.vertex(cos(ang) * rr, sin(ang) * rr);

          if (this.randomId % 200 == 0) {
            lines.push([cos(ang) * rr, sin(ang) * rr]);
          }
        }

        g.endShape(CLOSE);
        lines.forEach(function (line) {
          g.line(-_this.r / 5, 0, line[0], line[1]);
        });
      } else if (features.shapeType == "triangle") {
        g.translate(0, -frameCount / (8 + noise(10, seed) * 2));
        g.rotate(frameCount / 2000);

        if (this.randomId % 40 == 0) {
          g.rotate(frameCount / 1200 + this.randomId % 2);
        }

        g.drawingContext.shadowOffsetY = 10;
        g.drawingContext.shadowOffsetX = 10;
        g.drawingContext.shadowColor = color(0, 5);
        g.beginShape();
        var _lines = [];

        for (var _i = 0; _i < 3; _i++) {
          var _ang = _i / this.pointCount * 2 * PI;

          var _rr = this.r * 1.25;

          g.vertex(cos(_ang) * _rr, sin(_ang) * _rr);

          if (this.randomId % 200 == 0) {
            _lines.push([cos(_ang) * _rr, sin(_ang) * _rr]);
          }
        }

        g.endShape(CLOSE);

        _lines.forEach(function (line) {
          g.line(-_this.r / 5, 0, line[0], line[1]);
        });
      } else if (features.shapeType == "rect") {
        g.translate(frameCount / 20, frameCount / 20);

        if (frameCount == 1) {
          g.push();
          g.stroke(this.color);
          g.fill(bgColor);
          g.strokeWeight(2);
          g.rect(0, 0, this.r * 1.1 * 1., this.r * 1.1 * 1.);
          g.pop();
        } // g.translate(-this.r / 3, -this.r / 3)
        // if (this.randomId % 5 == 0) {
        // 	g.drawingContext.setLineDash([20, 20])
        // 	g.strokeWeight(5)
        // 	g.stroke(this.color)
        // }


        g.drawingContext.shadowOffsetY = 10;
        g.drawingContext.shadowOffsetX = 10;

        if (this.randomId % 3 == 0 && frameCount > 400 + noise(this.randomId * 5) * 300) {
          g.rect(0, 0, this.r / 3, this.r / 3);
          g.rect(this.r * 2 / 3, 0, this.r / 3, this.r / 3);
          g.rect(0, this.r * 2 / 3, this.r / 3, this.r / 3);
          g.rect(this.r * 2 / 3, this.r * 2 / 3, this.r / 3, this.r / 3);
        } else {
          g.rect(0, 0, this.r * 1., this.r * 1.);
        }

        if (this.randomId % 80 == 0) {
          g.line(0, 0, this.r, this.r);
          g.line(0, this.r, this.r, 0);
        }

        if (frameCount % 80 == 1 && this.randomId % 3 == 0) {
          for (var y = 0; y < this.r - 15; y += 10) {
            g.push();
            g.translate(this.r, y + 10);
            g.rotate(-PI / 4);
            g.fill(this.color);
            g.ellipse(0, 0, 1, y % 100 == 0 ? 20 : 5);
            g.pop();
          }

          for (var x = 0; x < this.r; x += 10) {
            g.push();
            g.translate(x, this.r);
            g.rotate(-PI / 4);
            g.fill(this.color);
            g.rect(0, 0, 1, x % 100 == 0 ? 20 : 5);
            g.pop();
          }
        }
      } else if (features.shapeType == "ellipse") {
        if (frameCount == 1) {
          g.push();
          g.stroke(this.color);
          g.fill(bgColor);
          g.strokeWeight(2);
          g.ellipse(0, 0, this.r, this.r);
          g.pop();
        }

        g.translate(0, -frameCount / (30 + noise(10, this.randomId) * 20));
        g.drawingContext.shadowOffsetY = 10;
        g.drawingContext.shadowOffsetX = 10;
        g.ellipse(0, 0, this.r, this.r);
      }

      g.pop(); // if (noise(this.p.x/300,this.p.y/300)<0.3 && random()<0.02){
      // 	overlayGraphics.push()
      // 		overlayGraphics.noStroke()
      // 		overlayGraphics.fill(clr)
      // 		overlayGraphics.rect(this.p.x+random(-this.r,this.r),this.p.y+random(-this.r,this.r),20,-20,10)
      // 	overlayGraphics.pop()
      // } 
      // g.ellipse(this.r*2+10,0,3,3)
      //grass

      if (this.randomId % 50 == 0 && frameCount % 120 == 0 && this.r > 2) {
        // g.fill(bgColor)
        g.push();
        g.translate(this.r + 20, 0);
        g.stroke(this.color2);
        g.translate(0, random([-this.r, this.r]));
        g.line(0, 0, 0, -5);
        g.line(0, 0, -3, -5);
        g.line(0, 0, 3, -5);
        g.pop();
      }

      var verticalLineSpan = 40;
      if (features.style == "shape") verticalLineSpan = 30;
      if (features.style == "stroke") verticalLineSpan = 35; // vertical lines

      if (this.randomId % verticalLineSpan == 0) {
        g.fill(0);
        g.ellipse(0, this.r + 10, 2, 2);
      }

      if (this.randomId % 25 == 0) {
        g.fill(bgColor);
        g.ellipse(this.r / 2, 0, 2, 2);
      }

      if (this.randomId % 80 == 0) {
        g.fill(255);
        var whiteR = noise(this.randomId, this.p.x / 40, this.p.y / 40) * 2 + 1;
        g.ellipse(-this.r - 10, this.r + 10, whiteR, whiteR);
      }

      if (this.r > 10 && (this.randomId + frameCount) % 60 == 0 && this.randomId % 4 == 0) {
        g.fill(this.color2);
        g.ellipse(-this.r, 4, 4);
      } // if (features.style == 'normal' && frameCount % 50 == 0 && this.randomId % 100 == 0 && random() < 0.6) {
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
        g.stroke(0);
        g.noFill();
        g.ellipse(0, this.r + 10, random(this.r));
      } // g.rotate(PI/4-PI/2)
      // g.rect(0,0,-this.r*2,2)


      g.pop();
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      if (this.randomId % 1 == 0 && abs(brightness(color(this.altColor)) - brightness(color(this.color))) < 85) {
        this.color = lerpColor(color(this.color), color(this.altColor), 0.005);
      }

      if (this.randomId % 40 == 0 && frameCount % 50 == 0) {
        this.r -= 10;
        this.p.x += 5;
        this.p.y += 5;
      }

      if (this.randomId % 77 == 0 && frameCount % 50 == 0) {
        this.r *= 1.05;
        this.p.x += 5;
        this.p.y += 5;
      }

      this.p.add(this.v);
      this.v.add(this.a);
      this.r *= this.shrinkRatio;

      if (this.r < 0.1) {
        this.alive = false;
      }

      if (frameCount > 650 && random() < 0.04 && this.randomId % 6 <= 3) {
        this.alive = false;
      }

      if (features.style != 'pure' && random() < 0.25 && frameCount % features.colorChangeFramSpan == 0 && this.randomId % 5 == 0) {
        this.color = random(colors);
        this.color2 = lerpColor(color(random(colors)), color(this.color), 0.6);
      }

      var steplize = function steplize(n, l) {
        return int(n * l) / l;
      }; // if (this.randomId%25==0){


      this.v.x = steplize(noise(this.p.x / this.vNoiseScale, this.p.y / this.vNoiseScale) - 0.5, this.steps[0]) * this.xSpeedFactor;
      this.v.y = steplize(noise(this.p.y / this.vNoiseScale, this.p.x / this.vNoiseScale) - 0.5, this.steps[1]) * this.ySpeedFactor;
      var ang = atan2(this.p.y - height / 2, this.p.x - width / 2);
      var r = dist(this.p.x, this.p.y, width / 2, height / 2); //rotate center

      this.v.x += cos(ang + PI / 2) * this.followRotateFactor;
      this.v.y += sin(ang + PI / 2) * this.followRotateFactor; // // go away from center
      // this.v.x += -cos(ang) * 0.2
      // this.v.y += -sin(ang) * 0.2;

      wormholes.forEach(function (w) {
        var ang = atan2(_this2.p.y - w.p.y, _this2.p.x - w.p.x);
        var dd = dist(_this2.p.x, _this2.p.y, w.p.x, w.p.y);
        var ratio = map(dd, 0, w.r, 1, 0, true);
        var force = w.intensity * ratio * ratio; //rotate center

        _this2.v.x += w.rotate * force * cos(ang + PI / 2) + w.attract * force * cos(ang);
        _this2.v.y += w.rotate * force * sin(ang + PI / 2) + w.attract * force * sin(ang);
      }); //test
      // 		if (noise(this.p.x/120,this.p.y/120)<0.2){
      // 			// originalGraphics.fill('red')
      // 			// originalGraphics.ellipse(this.p.x,this.p.y,5,5)
      // 			this.v.x+=sin(this.p.y/50)*50
      // 			this.v.y+=cos(this.p.x/50)*50
      // 		}
      //quantize angle

      if (noise(this.p.x / 60, this.p.y / 60) < 0.2) {
        var _ang2 = atan2(this.v.x, this.v.y);

        var amp = this.v.mag();
        var angStepCount = 8;
        var newAng = int(_ang2 / 2 / PI * angStepCount) / angStepCount * 2 * PI;
        this.v.x = amp * cos(newAng);
        this.v.y = amp * sin(newAng);
      }

      if (features.shapeType == 'polygon') {
        if (frameCount % 100 == 0 && this.r >= 200) {
          for (var i = 0; i < this.pointCount; i++) {
            var _ang3 = i / this.pointCount * 2 * PI;

            var xx = this.r * cos(_ang3) / 2;
            var yy = this.r * sin(_ang3) / 2;
          }
        }
      }

      if (features.style == 'pure') {
        this.color = colors[2];
      }
    }
  }]);

  return Particle;
}();

var theShader, theShaderTexture;
var webGLCanvas;
var originalGraphics;
var overlayGraphics;
var particles = [];
var wormholes = [];
var overallTexture;
var bgColor;
var sortedColors = [];

function preload() {
  noiseSeed(random() * 10000);
  theShader = new p5.Shader(this.renderer, vert, frag);
  theShaderTexture = new p5.Shader(this.renderer, vert, frag_texture);
  features = calFeatures();
  colors = random(themes).colors;
  colors = colors.sort(function (a, b) {
    return random([-0.5, 0.5]);
  });
  sortedColors = colors.sort(function (a, b) {
    return brightness(color(b)) - brightness(color(a));
  });
  console.log(features);
}

function setup() {
  pixelDensity(4);
  noiseSeed(random() * 50000);
  randomSeed(random() * 5000);
  cnv = createCanvas(DIM * ratio, DIM);
  width = DEFAULT_SIZE * ratio;
  height = DEFAULT_SIZE;
  background(0); //prepare texture

  overallTexture = createGraphics(width, height, WEBGL);
  overallTexture.shader(theShaderTexture);
  theShaderTexture.setUniform('u_resolution', [width, height]); // theShaderTexture.setUniform('u_canvas_tex',overallTexture)

  overallTexture.rect(-width / 2, -height / 2, width, height);
  webGLCanvas = createGraphics(width, height, WEBGL);
  originalGraphics = createGraphics(width, height);
  overlayGraphics = createGraphics(width, height);
  webGLCanvas.noStroke();
  overlayGraphics.noStroke();
  originalGraphics.noStroke();
  var rx = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * width;
  var ry = random([-0.1, -0.05, 0, 0, 0.05, 0.1]) * height;
  var ra = random([-0.2, -0.1, 0.1, 0.2]);
  var rscale = random([1.05, 1.1, 1.15, 1.2]);

  for (var _i2 = 0, _arr = [originalGraphics, overlayGraphics]; _i2 < _arr.length; _i2++) {
    var g = _arr[_i2];
    // console.log(g)
    g.translate(rx, ry);
    g.translate(width / 2, height / 2);
    g.rotate(ra); // if (!features.style=="normal"){

    g.scale(rscale); // }

    g.translate(-width / 2, -height / 2);
  }

  background(100);
  originalGraphics.noStroke(); // bgColor = color(20)

  bgColor = color(random(colors));

  if (random() < 0.5) {
    bgColor = color(random([sortedColors[0], sortedColors.slice(-1)[0]]));
  }

  if (features.style == "glow") {
    bgColor = color(0);
  }

  if (features.style == "pure") {
    bgColor = color(colors[2]);
  }

  var pairId = int(random(7));
  var spanOptions = [10, 12, 16, 20, 32, 44, 60, 68, 72];
  var maxSizeOptions = [250, 300, 400, 500, 600, 700, 840, 900, 960];
  var minPairId = features.minPairId;
  var maxPairId = features.maxPairId;
  var span = spanOptions[pairId];
  var maxSize = maxSizeOptions[pairId];
  var pairNoiseScale = random([10, 20, 100, 200]);
  var ignorePossibility = random([0.05, 0.3]);
  var gapScale = random([150, 200, 250, 300]);
  var gapRatio = random([0.35, 0.4, 0.45, 0.5]);
  var panScale = random([0, 1, 2, 5, 10, 15, 20, 25]);
  var panRatio = random([0, 0, random([0, 5, 10, 15])]);

  if (features.layout == "grid") {
    //noprotect
    for (var _x = 0; _x <= width; _x += span) {
      if (noise(_x / 2) < ignorePossibility) continue;
      var skipRatio = features.shapeType == 'rect' ? -0.75 : -0.8; // if (features.shapeType == 'rect') {

      if (sin(_x + seed * PI) < skipRatio) continue; // }
      //noprotect

      for (var _y = 0; _y <= height; _y += span) {
        // if (cos(y + seed * 2 + PI) < skipRatio) continue
        // if (noise(x,y)<ignorePossibility) continue
        if (noise(_x / gapScale, _y / gapScale) <= gapRatio) continue;
        particles.push(new Particle({
          p: createVector(_x, _y),
          r: noise(_x, _y) * maxSize * random(1),
          color: colors[int(noise(_x / gapScale, _y / gapScale) * colors.length * 2) % colors.length]
        }));

        var _pairId = int(map(noise(_x / pairNoiseScale, _y / pairNoiseScale), 0, 1, minPairId, maxPairId));

        span = spanOptions[_pairId];
        maxSize = maxSizeOptions[_pairId];
      }
    }
  } else if (features.layout == "ring") {
    var minRingR = map(noise(seed), 0, 1, 0.25, 0.4) * width;
    var maxRingR = map(noise(seed + 1), 0, 1, 0.5, 0.7) * width;

    for (var ang = 0; ang <= 2 * PI; ang += 0.1) {
      for (var r = minRingR; r < maxRingR; r += span) {
        var _x2 = r * cos(ang) + width / 2;

        var _y2 = r * sin(ang) + height / 2;

        if (noise(_x2 / gapScale, _y2 / gapScale) <= gapRatio / 1.5) continue;
        particles.push(new Particle({
          p: createVector(_x2, _y2),
          r: noise(_x2, _y2) * maxSize / 1.5 * random(1),
          color: colors[int(noise(r / gapScale, ang / gapScale) * colors.length * 2) % colors.length]
        }));

        var _pairId2 = int(map(noise(_x2 / pairNoiseScale, _y2 / pairNoiseScale), 0, 1, minPairId, maxPairId));

        span = spanOptions[_pairId2];
        maxSize = maxSizeOptions[_pairId2];
      }
    }

    for (var i = 0; i < 50; i++) {
      particles.push(new Particle({
        p: createVector(width / 2 + random(-minRingR * 0.25, minRingR * 0.25), height / 2 + random(-minRingR * 0.25, minRingR * 0.25)),
        r: random(minRingR / 1.9),
        color: random(colors)
      }));
    }
  } else if (features.layout == "blocks") {
    var blockWidth = map(noise(seed), 0, 1, 0.1, 0.15) * width;
    var blockHeight = map(noise(seed + 1), 0, 1, 0.3, 0.5) * height;
    var useMaxSize = features.shapeType == 'rect' ? maxSize * 1 : features.shapeType == 'polygon' ? maxSize * 1 : maxSize;

    for (var pan = -1; pan <= 1; pan++) {
      for (var x = -blockWidth; x < blockWidth; x += span) {
        for (var y = -blockHeight; y < blockHeight; y += span) {
          var xx = x + pan * blockWidth * 3 + width / 2;
          var yy = y + pan * blockHeight / 2 + height / 2;
          particles.push(new Particle({
            p: createVector(xx, yy),
            r: noise(x, y) * useMaxSize * random(1) * random(1),
            color: colors[int(noise(xx / gapScale, yy / gapScale) * colors.length * 2) % colors.length]
          }));

          var _pairId3 = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId));

          span = spanOptions[_pairId3];
          maxSize = maxSizeOptions[_pairId3];
        }
      }
    }
  } else if (features.layout == "spiral") {
    var sprialScale = map(noise(seed * 5), 0, 1, 0.65, 1.05);

    var _blockWidth = map(noise(seed), 0, 1, 0.1, 0.15) * width;

    var _blockHeight = map(noise(seed + 1), 0, 1, 0.3, 0.5) * height;

    var _useMaxSize = features.shapeType == 'rect' ? maxSize * 1.2 : features.shapeType == 'polygon' ? maxSize * 1.25 : maxSize * 1.25;

    var _pan = 0;

    for (var _r = 0; _r < width * 0.6; _r += span / 2) {
      for (var _ang4 = 0; _ang4 <= PI * 0.15; _ang4 += 0.05) {
        var useR = sprialScale * (_r + noise(_ang4 * 500) * _r * 0.6 + map(_ang4, PI / 2, PI, 0, 1, true) * noise(_r * 100) * width / 1.2);

        var _xx = useR * cos(_ang4 + _pan * PI + _r / 40) + width / 2;

        var _yy = useR * sin(_ang4 + _pan * PI + _r / 40) + height / 2;

        particles.push(new Particle({
          p: createVector(_xx, _yy),
          r: noise(_r / 4, _ang4 / 4) * _useMaxSize * random(1) * random(1),
          color: colors[int(noise(_r / gapScale, _ang4 / gapScale) * colors.length * 2) % colors.length]
        }));

        var _pairId4 = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId));

        span = spanOptions[_pairId4];
        maxSize = maxSizeOptions[_pairId4];
      }
    } // }

  } else if (features.layout == "chess") {
    var chessPan = random([0, 1]); //noprotect

    for (var _x3 = 0; _x3 <= width; _x3 += span) {
      if (noise(_x3 / 2) < ignorePossibility) continue;

      var _skipRatio = features.shapeType == 'rect' ? -0.75 : -0.8; // if (features.shapeType == 'rect') { 
      // }
      //noprotect


      for (var _y3 = 0; _y3 <= height; _y3 += span) {
        // if (cos(y + seed * 2 + PI) < skipRatio) continue
        var chessCount = random([2, 3]);
        var chessX = int(_x3 / (width / chessCount));
        var chessY = int(_y3 / (height / chessCount));
        if ((chessX + chessY + chessPan) % 2 == 1) continue;
        if (noise(_x3, _y3) < ignorePossibility) continue;
        particles.push(new Particle({
          p: createVector(_x3, _y3),
          r: (0.5 + noise(_x3, _y3) / 2) * maxSize / 2 * random(1),
          color: colors[max(int(chessX + chessY + noise(_x3 / gapRatio, _y3 / gapRatio) * 5), 0) % colors.length]
        }));

        var _pairId5 = int(map(noise(_x3 / pairNoiseScale, _y3 / pairNoiseScale), 0, 1, minPairId, maxPairId));

        span = spanOptions[_pairId5];
        maxSize = maxSizeOptions[_pairId5];
      }
    }
  } // particles.sort((a, b) => random() < 0.5)


  for (var _i3 = 0; _i3 < features.wormholeCount; _i3++) {
    var w = new Wormhole({
      p: createVector(random(-width * 0.2, width * 1.2), random(-height * 0.2, height * 1.2)),
      r: random(100, 600),
      intensity: random([-1, 1]) / 10,
      rotate: random([-1, 1]),
      attract: random([-1, 1])
    });
    wormholes.push(w); // overlayGraphics.push()
    // overlayGraphics.stroke('blue')
    // overlayGraphics.strokeWeight(5)
    // overlayGraphics.translate(w.p.x,w.p.y)
    // overlayGraphics.line(-10,-10,10,10)
    // overlayGraphics.line(-10,10,10,-10)
    // overlayGraphics.pop()
    // originalGraphics.ellipse(w.p.x,w.p.y,50,50)	
  } // particles.forEach(p => {
  // 	p.color = bgColor
  // 	// p.color2 = bgColor
  // })

}

function draw() {
  scale(M);
  webGLCanvas.shader(theShader);
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('u_time', millis() / 1000);
  theShader.setUniform('u_mouse', [mouseX / width, mouseY / height]);
  theShader.setUniform('u_tex', originalGraphics);
  theShader.setUniform('u_bgColor', [bgColor._getRed() / 255., bgColor._getGreen() / 255., bgColor._getBlue() / 255.]);
  theShader.setUniform('u_canvas_tex', overallTexture);
  theShader.setUniform('u_distortFactor', features.distortFactor);
  theShader.setUniform('u_hasBorder', features.hasBorder);
  webGLCanvas.clear(); // webGLCanvas.background(bgColor)

  background(100);
  fill(0);
  rect(0, 0, width * 2, height * 2);
  webGLCanvas.rect(-width / 2, -height / 2, width, height); // webGLCanvas.push()
  // webGLCanvas.rotateY(frameCount / 100)
  // // webGLCanvas.box(800, 800, 800)
  // webGLCanvas.pop()
  // webGLCanvas.noStroke()
  // webGLCanvas.push()
  // webGLCanvas.rotateY(frameCount/300)
  // webGLCanvas.sphere(500-frameCount/2)
  // webGLCanvas.pop()

  particles.forEach(function (p) {
    p.update();
    p.draw(originalGraphics); // if (random()<0.005 && frameCount<5000){
    // 	let p1 = random(particles), p2 = random(particles)
    // 	overlayGraphics.push()
    // 	overlayGraphics.blendMode(MULTIPLY)
    // 	overlayGraphics.stroke(0,2)
    // 	overlayGraphics.strokeWeight(0.4)
    // 	overlayGraphics.line(p1.p.x,p1.p.y,p2.p.x,p2.p.y)
    // 	overlayGraphics.pop()
    // }
  });
  particles = particles.filter(function (p) {
    return p.alive;
  });
  originalGraphics.noStroke(); // originalGraphics.fill(255)
  // originalGraphics.noStroke()
  // originalGraphics.ellipse(mouseX, mouseY, 10, 10);

  fill(bgColor);
  rect(0, 0, width, height);
  var gridSpan = 20;
  push();

  if (features.hasGrid) {
    if (features.shapeType == 'rect') {
      push();
      blendMode(MULTIPLY); //test grid

      for (var x = -gridSpan * 2; x <= width + gridSpan; x += gridSpan) {
        stroke(0, 20);
        line(x, 0, x, height);
      }

      for (var y = -gridSpan * 2; y <= height + gridSpan; y += gridSpan) {
        stroke(0, 20);
        line(0, y, width, y);
      }

      pop();
    }

    if (features.shapeType == 'ellipse') {
      blendMode(BLEND);

      for (var i = 0; i < 3; i++) {
        push();
        strokeWeight(1);
        translate(width / 2, height / 2);
        rotate(i / 3 * PI * 2);
        translate(-width / 2, -height / 2);

        for (var _x4 = -gridSpan * 8; _x4 <= width + gridSpan * 4; _x4 += 50) {
          stroke(255, 80);
          line(_x4, 0, _x4, height + gridSpan * 10);
        }

        pop();
      }
    }
  } // for (let x = 0; x < width; x += gridSpan) {
  // 	for (let y = 0; y < height; y += gridSpan) {
  // 		if (noise(x / 10, y) > 0.6) {
  // 			stroke(200, 200)
  // 			arc(x - gridSpan / 2 + sin(y) * gridSpan, y + gridSpan / 2, gridSpan, gridSpan, PI, PI * 3 / 2)
  // 			arc(x + sin(y) * gridSpan, y, gridSpan, gridSpan, PI / 2, PI)
  // 		}
  // 	}
  // }


  image(webGLCanvas, 0, 0); // blendMode(ADD)
  // image(webGLCanvas, 0, 0)

  push(); // image(webGLCanvas,0,0)

  image(overlayGraphics, 0, 0);
  pop();
  pop(); // pop()
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

  push();
  blendMode(MULTIPLY);
  noStroke();
  image(overallTexture, 0, 0); // blendMode(SCREEN)
  // image(overallTexture,0,0,1920,1080)
  // image(overallTexture,0,0,height/1080*1920 ,height)

  pop(); // if (frameCount % 500 == 1) {
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

function keyPressed() {
  if (key == 's') {
    saveCanvas('test', 'png');
  }

  if (key == 'b') {
    features.hasBorder = !features.hasBorder;
  }
}