"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// noprotect
var themes = ["d72638-3f88c5-f49d37-140f2d-f22b29-fe4a49-fed766-7fbb8f-009fb7-e6e6ea-fff-102a54".split("-").map(function (a) {
  return "#" + a;
}), "584d3d-9f956c-cbbf7a-f4e87c-ebf38b-fed766-fff-ffa856-000-e5dede".split("-").map(function (a) {
  return "#" + a;
}), "0e131f-38405f-59546c-8b939c-ff0035-2c0735-fff".split("-").map(function (a) {
  return "#" + a;
}) // "ffc854-000-ffc854-000-fff".split("-").map(a=>"#"+a),
// "261447-f1e3f3-c2bbf0-8fb8ed-62bfed-3590f3-fff-FF8680".split("-").map(a=>"#"+a),
// "07252F-7c6a0a-babd8d-ffdac6-fa9500-eb6424-FCFBF6".split("-").map(a=>"#"+a),
// "e6e1c6-afac96-c0bda5-cc978e-f39c6b-f96a68-ff3864-261447-3a2958-fff".split("-").map(a=>"#"+a),
// "0a369d-4472ca-5e7ce2-92b4f4-cfdee7-fff".split("-").map(a=>"#"+a),	
// "daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-daddd8-c7d59f-b7ce63-8fb339-4b5842-fafafa-FF715B".split("-").map(a=>"#"+a)
]; // // "000-aaa-fff-eee".split("-").map(a=>"#"+a),
//"fff-9fa2b2-3c7a89-2e4756-16262e-000-fff-9fa2b2-3c7a89-2e4756-16262e-000-fff".split("-").map(a=>"#"+a),

var features = {};
var colors;
var DEFAULT_SIZE = 1200;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE; //001427
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
      followRotateFactor: random(features.rotateFactors),
      color: random(colors),
      //200 is original (x moving a lot)
      steps: [int(random([2, 3, 10, 20, 30, 50, 120, 150])), int(random([2, 3, 4]))],
      shrinkRatio: random([0.995, 0.99, 0.99, 0.98, 0.95]),
      vNoiseScale: features.vNoiseScale,
      color2: random([255, 255, random(colors)]),
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
      g.push(); // g.blendMode(MULTIPLY)

      var clr = color(this.color); // 			clr.setAlpha(500*map(this.r,200,0,0.02,0,true))
      // 			let colorVar = 30
      // 			clr.setRed(clr._getRed()+noise(this.p.x/5,this.p.y/5)*colorVar-colorVar/2)
      // 			clr.setGreen(clr._getGreen()+noise(1000,this.p.x/5,this.p.y/5)*colorVar-colorVar/2)
      // 			clr.setBlue(clr._getBlue()+noise(this.p.x/5,1000,this.p.y/5)*colorVar-colorVar/2)
      // 			if (
      // 			g.stroke(clr)
      // 			g.blendMode(MULTIPLY)
      // 			if (frameCount>10) return
      // 			g.noFill()

      g.fill(clr);

      if (noise(this.p.x / 50, this.p.y / 50) < 0.3 && random() < 0.35 && features.style == "stroke") {
        overlayGraphics.push();
        overlayGraphics.noStroke();
        overlayGraphics.fill(clr);
        overlayGraphics.ellipse(this.p.x + random(-this.r, this.r), this.p.y + random(-this.r, this.r), random(6) * random() * random(0.5, 1));
        overlayGraphics.pop();
      }

      g.translate(this.p); // g.noStroke()

      if (frameCount == 1 && this.randomId % 5 == 0) {
        g.strokeWeight(2);
        g.stroke(this.color2);
      } //test stroke style


      if (features.style == "stroke") {
        //mountain lines
        if ((this.randomId + frameCount) % 5 == 0) {
          g.push();
          g.blendMode(MULTIPLY);
          clr.setAlpha(noise(this.randomId) * 150);
          g.translate(-this.p.x, -this.p.y);
          var rr = noise(this.randomId) * 5 * noise(this.randomId);
          g.stroke(clr);
          g.strokeWeight(rr);

          if (this.randomId % 800 == 0) {
            clr.setAlpha(random(50, 100));
            g.stroke(clr);
            g.strokeWeight(noise(this.randomId * 500) * 5);
          } // g.noStroke()
          // g.rect(0,0,rr,rr)


          if (this.lastP.x != -1) {
            // console.log(this.p,this.lastP)
            g.line(this.p.x, this.p.y, this.lastP.x, this.lastP.y);
          }

          this.lastP = this.p.copy();
          g.pop();
        }

        if ((this.randomId + frameCount) % 8 == 0 && this.randomId % (9 + int(50 / pow(this.r / 10, 3))) <= 1) {
          g.push();
          g.blendMode(MULTIPLY); // g.fill(clr)
          // g.noStroke()

          clr.setAlpha(random(255));
          g.stroke(clr); // if((this.randomId+frameCount)%3==0){
          // 	g.blendMode(MULTIPLY)
          // }

          g.strokeWeight(noise(this.p.x / 40, this.p.y / 40) * 2.5 * random(0.3, 1));
          g.rotate(noise(this.p.x / 100, this.p.y / 100, this.randomId) * PI * 2);
          g.rotate(noise(this.p.x / 5, this.p.y / 5, this.randomId) / 2);

          if (this.randomId % 4 == 0 && brightness(clr) > 50) {
            clr.setAlpha(random(8));
            g.fill(clr);
            clr.setAlpha(random(150));
            g.stroke(clr);

            if (random() < 0.9) {
              g.noStroke();
            }

            var waterColorScale = noise(this.randomId, 1000) * 5 + 1;
            g.arc(0, 0, this.r * waterColorScale, this.r * waterColorScale, 0, PI);
          } else {
            g.line(0, this.r / 2, this.r, -this.r / 2);
          }

          g.pop();
        } else {
          if ((this.randomId + frameCount) % 10 == 0) {// 						g.push()
            // 						clr.setAlpha(5)
            // 						g.fill(clr)
            // 						g.blendMode(MULTIPLY)
            // 						g.ellipse(0,0,this.r,this.r)
            // 					g.pop()
          }
        }
      }

      if (features.style == "shape" || features.style == "stroke") {
        if (features.style == "shape" || noise(this.p.x / 52, this.p.y / 52) < 0.525) {
          if (frameCount % 40 == 0) {
            clr.setAlpha(random(0, 1));
            g.fill(clr);
            g.ellipse(0, 0, this.r, this.r);
          } else if ((this.randomId + frameCount) % 8 == 0 && this.randomId % (9 + int(50 / pow(this.r / 10, 3))) <= 1) {
            g.noFill();
            clr.setAlpha(random(200, 255));
            g.stroke(clr);
            g.strokeWeight(random(0, 2) * random(0.5, 1));

            if (this.randomId % 88 == 0 && random() < 0.2) {
              clr.setAlpha(random(100, 200));
              g.strokeWeight(noise(this.randomId * 500) * 8);
            }

            g.blendMode(MULTIPLY);

            if (brightness(clr) > 90) {
              if (random() < 0.5) {
                g.blendMode(SCREEN);
              }
            }

            if (this.randomId % 2 == 0 && frameCount % 2 == 0) {
              clr.setAlpha(random(0, 1));
              g.fill(clr);
              g.noStroke();
            }

            if (this.randomId % 10 == 0 || noise(this.p.x / 120, this.p.y / 120) <= 0.3) {
              //draw a line
              g.rotate(noise(this.p.x * 5, this.p.y * 5, frameCount / 10) * PI * 2);
              g.line(0, this.r, 0, -this.r);
            } else {
              if (this.randomId % 3 == 0) {
                clr.setAlpha(random(0, 3));
                g.fill(clr);
              } //draw an ellipse


              g.ellipse(0, 0, this.r * 1.1, this.r * 1.1);
            }
          }
        }
      } else if (features.style == "normal") {
        //fill 
        g.ellipse(0, 0, this.r, this.r); // if (noise(this.p.x/300,this.p.y/300)<0.3 && random()<0.02){
        // 	overlayGraphics.push()
        // 		overlayGraphics.noStroke()
        // 		overlayGraphics.fill(clr)
        // 		overlayGraphics.rect(this.p.x+random(-this.r,this.r),this.p.y+random(-this.r,this.r),20,-20,10)
        // 	overlayGraphics.pop()
        // }
      } // g.ellipse(this.r*2+10,0,3,3)
      //grass


      if (this.randomId % 30 == 0 && frameCount % 50 == 0 && this.r > 1) {
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

      var verticalLineSpan = 5;
      if (features.style == "shape") verticalLineSpan = 30;
      if (features.style == "stroke") verticalLineSpan = 35; // vertical lines

      if (this.randomId % verticalLineSpan == 0) {
        g.fill(0);
        g.ellipse(0, this.r + 10, 2, 2);
      }

      if (this.randomId % 10 == 0) {
        g.fill(bgColor);
        g.ellipse(this.r / 2, 0, 2, 2);
      }

      if (this.randomId % 25 == 0) {
        g.fill(255);
        var whiteR = noise(this.randomId, this.p.x / 40, this.p.y / 40) * 3 + 1;
        g.ellipse(-this.r - 10, this.r + 10, whiteR, whiteR);
      }

      if (this.r > 10 && (this.randomId + frameCount) % 60 == 0 && this.randomId % 4 == 0) {
        g.fill(this.color2);
        g.ellipse(-this.r, 4, 4);
      }

      if (features.style == 'normal' && frameCount % 50 == 0 && this.randomId % 14 == 0 && random() < 0.6) {
        g.push();
        var lineSp = random([5, 10, 20, 30, 40]);
        var lineCount = random(20);

        for (var i = 0; i < random(lineCount); i++) {
          var lLan = 5;
          g.stroke(0, 100);
          g.line(-this.r - 10 - lLan, -i * lineSp, -this.r - 10 + lLan, -i * lineSp);
        }

        g.pop();
      } // g.ellipse(this.r+10,this.r+10,2,2)


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
      var _this = this;

      this.p.add(this.v);
      this.v.add(this.a);
      this.r *= this.shrinkRatio;
      this.alive = this.r > 0.1;

      if (random() < 0.25 && frameCount % 15 == 0 && this.randomId % 5 == 0) {
        this.color = random(colors);
      }

      var steplize = function steplize(n, l) {
        return int(n * l) / l;
      }; // if (this.randomId%25==0){


      this.v.x = steplize(noise(this.p.x / this.vNoiseScale, this.p.y / this.vNoiseScale) - 0.5, this.steps[0]) * this.xSpeedFactor;
      this.v.y = steplize(noise(this.p.y / this.vNoiseScale, this.p.x / this.vNoiseScale) - 0.5, this.steps[1]) * this.ySpeedFactor;
      var ang = atan2(this.p.y - height / 2, this.p.x - width / 2);
      var r = dist(this.p.x, this.p.y, width / 2, height / 2); //rotate center

      this.v.x += cos(ang + PI / 2) * this.followRotateFactor;
      this.v.y += sin(ang + PI / 2) * this.followRotateFactor; // 		}else{
      // 			this.v.x = (steplize(noise(this.p.x/50,this.p.y/50)-0.5,this.steps[0]))*this.xSpeedFactor
      // 			this.v.y = (steplize(noise(this.p.y/50,this.p.x/50)-0.5,this.steps[1]))*this.ySpeedFactor
      // 		}

      wormholes.forEach(function (w) {
        var ang = atan2(_this.p.y - w.p.y, _this.p.x - w.p.x);
        var dd = dist(_this.p.x, _this.p.y, w.p.x, w.p.y);
        var ratio = map(dd, 0, w.r, 1, 0, true);
        var force = w.intensity * ratio * ratio; //rotate center

        _this.v.x += w.rotate * force * cos(ang + PI / 2) + w.attract * force * cos(ang);
        _this.v.y += w.rotate * force * sin(ang + PI / 2) + w.attract * force * sin(ang);
      }); //test
      // 		if (noise(this.p.x/120,this.p.y/120)<0.2){
      // 			// originalGraphics.fill('red')
      // 			// originalGraphics.ellipse(this.p.x,this.p.y,5,5)
      // 			this.v.x+=sin(this.p.y/50)*50
      // 			this.v.y+=cos(this.p.x/50)*50
      // 		}
      //quantize angle

      if (noise(this.p.x / 60, this.p.y / 60) < 0.2) {
        var _ang = atan2(this.v.x, this.v.y);

        var amp = this.v.mag();
        var angStepCount = 8;
        var newAng = int(_ang / 2 / PI * angStepCount) / angStepCount * 2 * PI;
        this.v.x = amp * cos(newAng);
        this.v.y = amp * sin(newAng); // originalGraphics.fill('red')
        // originalGraphics.ellipse(this.p.x,this.p.y,5,5)
      } // this.v.add(this.p.copy().sub(createVector(width/2,height/2)).mult(-0.002))

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
  console.log(random); // randomSeed(3390)
  // noiseSeed(20)

  colors = random(themes);
  sortedColors = colors.sort(function (a, b) {
    return brightness(color(b)) - brightness(color(a));
  });
  theShader = new p5.Shader(this.renderer, vert, frag);
  theShaderTexture = new p5.Shader(this.renderer, vert, frag_texture); // overallTexture = loadImage("canvas-light.jpeg") 

  features.style = 'normal'; // features.style=random()<1?'stroke':'normal'
  // features.style=random()<0.2?'shape':features.style

  features.hasBgBorder = random() < 0.5;
  features.rotateFactors = random([[0], [0], [0], [0], [0, 0.05], [0, -0.05], [0.05, 0, 0, 0, 0, 0, 0, -0.05]]);
  features.vNoiseScale = random([40, 50, 75, 100, 120]);
  features.hasGrid = false;
  features.wormholeCount = random([1, 2, 3, 4, 5]);
}

function setup() {
  pixelDensity(4);
  createCanvas(DIM, DIM);
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
  var ra = random([-0.2, -0.1, 0, 0, 0.1, 0.2]);

  for (var _i = 0, _arr = [originalGraphics, overlayGraphics]; _i < _arr.length; _i++) {
    var g = _arr[_i];
    // console.log(g)
    g.translate(rx, ry);
    g.translate(width / 2, height / 2); // g.rotate(ra)
    // if (!features.style=="normal"){

    g.scale(random([1, 1.2, 1.5, 2, 3])); // }

    g.translate(-width / 2, -height / 2);
  }

  background(100);
  originalGraphics.noStroke();
  bgColor = color(random(colors));

  if (features.style == "normal") {
    bgColor = color(random(sortedColors));
  } else {
    bgColor = color(random(sortedColors.slice(0, 2).concat(['#fff'])));
  }

  if (features.style == "stroke") bgColor = color(255);
  if (features.style == "shape") bgColor = color(255); // bgColor = color('#f9f9f7')
  // bgColor=color(255)
  // originalGraphics.background(bgColor); 

  var pairId = int(random(6));
  var spanOptions = [8, 10, 12, 20, 32, 44, 60, 68];
  var maxSizeOptions = [160, 200, 300, 400, 500, 600, 840, 900];
  var minPairId = 0;
  var maxPairId = random([5, 6, 7]);
  var span = spanOptions[pairId];
  var maxSize = maxSizeOptions[pairId];
  var pairNoiseScale = random([10, 20, 100, 200]);
  var ignorePossibility = random([0.05, 0.3]);
  var gapScale = random([100, 150, 200, 250]);
  var gapRatio = random([0.3, 0.35, 0.4, 0.45, 0.5]);
  var panScale = random([0, 1, 2, 5, 10, 15, 20, 25]);
  var panRatio = random([0, 0, random([0, 5, 10, 15])]); // console.log(span,maxSize)
  //noprotect

  for (var x = 0; x <= width; x += span) {
    if (noise(x / 2) < ignorePossibility) continue; //noprotect

    for (var y = 0; y <= height; y += span) {
      // if (noise(x,y)<ignorePossibility) continue
      if (noise(x / gapScale, y / gapScale) <= gapRatio) continue;
      particles.push(new Particle({
        p: createVector(x, y),
        r: noise(x, y) * maxSize * random(1),
        color: random(colors)
      }));

      var _pairId = int(map(noise(x / pairNoiseScale, y / pairNoiseScale), 0, 1, minPairId, maxPairId));

      span = spanOptions[_pairId];
      maxSize = maxSizeOptions[_pairId];
    }
  } // particles.sort((a,b)=>random()<0.5)


  for (var i = 0; i < features.wormholeCount; i++) {
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
  }
}

function draw() {
  webGLCanvas.shader(theShader);
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('u_time', millis() / 1000);
  theShader.setUniform('u_mouse', [mouseX / width, mouseY / height]);
  theShader.setUniform('u_tex', originalGraphics);
  theShader.setUniform('u_bgColor', [bgColor._getRed() / 255., bgColor._getGreen() / 255., bgColor._getBlue() / 255.]);
  theShader.setUniform('u_canvas_tex', overallTexture);
  webGLCanvas.clear();
  webGLCanvas.background(bgColor);
  background(100);
  fill(0);
  rect(0, 0, width * 2, height * 2);
  webGLCanvas.rect(-width / 2, -height / 2, width, height); // webGLCanvas.noStroke()
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
  push();
  var gridSpan = 40;

  if (features.hasGrid) {
    blendMode(MULTIPLY); //test grid

    for (var x = 0; x < width; x += gridSpan) {
      stroke(0, 20);
      line(x, 0, x, height);
    }

    for (var y = 0; y < height; y += gridSpan) {
      stroke(0, 20);
      line(0, y, width, y);
    }
  }

  blendMode(BLEND);

  if (features.style == 'normal') {
    image(webGLCanvas, 0, 0);
    push(); // blendMode(MULTIPLY)
    // image(webGLCanvas,0,0)

    image(overlayGraphics, 0, 0);
    pop();
  }

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
  // push()
  // 		blendMode(MULTIPLY)
  // 		noStroke()
  // 		image(overallTexture,0,0)
  // 		// blendMode(SCREEN)
  // 		// image(overallTexture,0,0,1920,1080)
  // 		// image(overallTexture,0,0,height/1080*1920 ,height)
  // pop()
  // for(var i=0;i<height;i+=200){
  // 	stroke(bgColor)
  // 	strokeWeight(15)
  // 	line(0,i,width,i)
  // }

  if (features.style != 'normal') {
    push();
    blendMode(MULTIPLY);
    image(webGLCanvas, 0, 0);
    image(overlayGraphics, 0, 0);
    pop();
  }
}