function calFeatures() {
  let features = {}
  features.style = random({
    normal: 5,
    glow: 1
  })
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
    0: 50,
    1: 10,
    2: 5,
    3: 5
  }) * 1
  features.maxPairId =
    random({
      7: 100,
      8: 5
    }) * 1
  features.layout = random({
    grid: 4,
    ring: 2,
    blocks: 1
  })

  features.vNoiseScale = random([40, 50, 75, 100, 120])
  features.hasGrid = false
  features.wormholeCount = random([1, 2, 3])
  features.shapeType = random({
    'rect': 2,
    'ellipse': 2,
    'polygon': 2
  })
  features.distortFactor = features.shapeType == 'ellipse' ? 0.8 : 0.1
  return features
}