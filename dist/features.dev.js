"use strict";

function calFeatures() {
  var features = {};
  features.style = random({
    normal: 5,
    glow: 1
  }); // features.style=random()<1?'stroke':'normal'
  // features.style=random()<0.2?'shape':features.style 

  features.rotateFactors = random([[0], [0], [0], [0], [0, 0.05], [0, -0.05], [0.05, 0, 0, 0, 0, 0, 0, -0.05]]);
  features.vNoiseScale = random([40, 50, 75, 100, 120]);
  features.hasGrid = true;
  features.wormholeCount = random([1, 2, 3]);
  features.shapeType = random(['rect', 'ellipse', 'polygon']);
  features.distortFactor = features.shapeType == 'ellipse' ? 0.8 : 0.1;
  return features;
}