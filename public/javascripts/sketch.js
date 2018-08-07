// Credit to The Coding Train YouTube channel, the p5js examples on p5js.org,
// Saskia Freeke and Dexter Shepherd (https://blog.kadenze.com/creative-technology/p5-js-crash-course-recreate-art-you-love/),
// and https://github.com/therewasaguy for some inspiration and code for these visualizations

const black = '#010711';      // (1,   7,  17)
const darkGray = '#13171F';   // (19,  23, 31)
const mediumGray = '#1C2026'; // (28,  32, 38)
const lightGray = '#24272D';  // (36,  39, 45)
const lighterGray = '#949ba2';  // (36,  39, 45)
const red = '#94152A';        // (148, 21, 42)
const dullWhite = '#b6b6b6';  // (182, 182, 182)

class Visualization {
  constructor() {
    this.levelHistory = [];
  }

  visualize(level, spectrum) {
  }

  reset() {
    this.levelHistory = [];
  }
}

function smoothPoint(spectrum, index) {
  const neighbors = 2;
  const len = spectrum.length;

  let val = 0;

  const indexMinusNeighbors = index - neighbors;
  let smoothedPoints = 0;

  for (let i = indexMinusNeighbors; i < (index + neighbors) && i < len; i++) {
    if (spectrum[i] !== undefined) {
      val += spectrum[i];
      smoothedPoints++;
    }
  }

  return val / smoothedPoints;
}

const CurveVisualization = class extends Visualization {
  visualize(_, spectrum) {
    const length = spectrum.length;

    const highFreqRange = spectrum.slice(779, 860);
    const maxFreq = max(highFreqRange);
    const color = map(maxFreq, 0, 145, 10, 255);
    stroke(148, color, color);

    strokeWeight(1);

    beginShape();
    for (let i = 0; i < length; i++) {
      const point = smoothPoint(spectrum, i);
      const x = map(i, 0, length - 1, 0, width / 2);
      const y = map(point, 0, 255, (height / 2) - 3, 0);

      curveVertex(x, y);
    }
    endShape();
  }
};

const Particle = function (position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(random(0, 10), 0);
};

const ParticleScurryVisualization = class extends Visualization {
  constructor() {
    super();

    this.particles = new Array(256);

    for (let i = 0; i < this.particles.length; i++) {
      const x = random(0, width / 2);
      const y = random(0, height / 4);
      const position = createVector(x, y);
      this.particles[i] = new Particle(position);
    }
  }

  visualize(level, spectrum) {
    noStroke();

    for (let i = 0; i < 256; i++) {
      const thisLevel = map(spectrum[i], 0, 255, 0, 1) * 2.5;

      this.particles[i].position.y = (spectrum[i] * 5) - (height / 8);
      this.particles[i].position.x += this.particles[i].speed.x / (thisLevel);
      if (this.particles[i].position.x > width) this.particles[i].position.x = 0;
      this.particles[i].diameter = map(thisLevel, 0, 1, 0, 100) * this.particles[i].scale;

      const opacity = map(level, 0, 0.5, 100, 150);
      this.particles[i].color = [36, 39, 45, opacity];

      fill(this.particles[i].color);
      ellipse(
        this.particles[i].position.x,
        this.particles[i].position.y,
        this.particles[i].diameter,
        this.particles[i].diameter,
      );
    }
  }
};

const LineVibrationVisualization = class extends Visualization {
  visualize(level) {
    const y = (height / 12) + map(level, 0, 1, 0, 800);

    stroke(red);
    strokeWeight(9);
    line(0, y, width, y);
  }
};

const ArcVisualization = class extends Visualization {
  visualize(level) {
    const size = map(level, 0, 1, 0, 550);

    stroke(lightGray);
    strokeWeight(4);
    ellipse(width / 4, height / 4, (width / 2) + 10, size * 10)
  }
};

const HelixVisualization = class extends Visualization {
  constructor() {
    super();

    this.spacing = 16;
    this.theta = 0.0;
    this.dx = (TWO_PI / 400) * this.spacing;
  }

  visualize(level) {
    angleMode(RADIANS);

    this.theta += map(level, 0, 0.5, 0, 0.3);
    const w = width / 2;
    this.yvalues = new Array(floor(w / this.spacing));

    var x = this.theta;
    for (let i = 0; i < this.yvalues.length; i++) {
      this.yvalues[i] = sin(x) * 75;
      x += this.dx;
    }

    noStroke();
    const color = map(level, 0, 0.25, 2, 255);
    fill(color, color, color);
    for (let i = 0; i < this.yvalues.length; i++) {
      ellipse(i * this.spacing, height / 5 + this.yvalues[i], 16, 16);
      ellipse(i * this.spacing, height / 5 - this.yvalues[i], 16, 16);

    }
  }
};

const RadialVisualization = class extends Visualization {
  visualize(level) {
    const color = level > 0.082 ? dullWhite : red;
    this.levelHistory.push(level);

    stroke(color);
    strokeWeight(2);
    angleMode(DEGREES);

    beginShape();
    for (let i = 1; i < this.levelHistory.length; i++) {
      const r = map(this.levelHistory[i], 0, 0.2, 10, 1000);
      const x = (width / 2) + (r * cos(i + 210));
      const y = (height / 4) + (r * sin(i + 210));

      vertex(x, y);
    }
    endShape();

    if (this.levelHistory.length > 360) {
      this.levelHistory.shift();
    }
  }
};

const SpiralVisualization = class extends Visualization {
  constructor() {
    super();

    this.startingPosition = 0.001;
    this.speed = 0.0005;
  }

  visualize(level) {
    this.levelHistory.push(level * 2);

    const color = map(this.startingPosition, 0, 2, 30, 255);
    stroke(color, color, color);

    strokeWeight(0.3);
    angleMode(DEGREES);

    beginShape();
    for (let i = 1; i < this.levelHistory.length; i++) {
      const r = map(this.levelHistory[i], 0, 0.6, 10, 700);
      const x = (width / 5) + (r * cos(i) * this.startingPosition);
      const y = (height / 4) + (r * sin(i) * this.startingPosition);

      vertex(x, y);
    }
    endShape();
    this.startingPosition += this.speed;
  }

  reset() {
    this.levelHistory = [];
    this.startingPosition = 0.001;
  }
};

const AmpVisualization = class extends Visualization {
  visualize(level) {
    this.levelHistory.push(level * 2);

    stroke(red);
    strokeWeight(2);

    beginShape();
    for (let i = 1; i < this.levelHistory.length; i++) {
      const y = map(this.levelHistory[i], 0, 0.5, height / 2, 0);
      vertex(i, y);
    }
    endShape();

    if (this.levelHistory.length > width / 2) {
      this.levelHistory.shift();
    }
  }
};

const EllipseVisualization = class extends Visualization {
  visualize(level) {
    const weight = level > 0.2 ? 12 : 4;
    const color = level > 0.2 ? dullWhite : lighterGray;
    const size = map(level, 0, 0.3, 0, 200);
    const randomMultiplier = random(-(width / 2), width / 2);
    const x = width / 4;

    stroke(color);
    strokeWeight(weight);
    ellipse(x + randomMultiplier, (height / 4) - (height / 6), size, size);
  }
};

const SnowVisualization = class extends Visualization {
  visualize(level, spectrum) {
    const totalPts = spectrum.length / 2;
    const steps = totalPts + 1;
    let rand = 0;

    for (let i = 1; i < steps; i++) {
      const x = ((width / 2) / steps) * i;
      const y = (height / 12) + random(-rand, rand);
      const color = map(x, 0, width / 2, 80, 240);
      strokeWeight(1);
      stroke(color, color, color);
      point(x, y);

      const range = map(spectrum[i], 0, 200, 1, 25);
      rand += random(-range, range);
    }
  }
};


const RotatingWaveVisualization = class extends Visualization {
  constructor() {
    super();
    this.phase = 0;
  }

  visualize(level, spectrum) {
    angleMode(RADIANS);
    let speed = 0.03;
    let maxCircleSize = 15;
    let numRows = 10;
    let numCols = 16;
    let numStrands = 3;

    let colorA = color(28,  32, 38, 50);
    let colorB = color(120, 120, 120, 50);

    this.phase = frameCount * speed;
    const multiplier = map(level, 0,  0.3, 1, 10);

    for (let strand = 0; strand < numStrands; strand += 1) {
      let strandPhase = this.phase + map(strand, 0, numStrands, 0, TWO_PI);

      for (let col = 0; col < numCols; col += 1) {
        let colOffset = map(col, 0, numCols, 0, TWO_PI);
        let x = map(col, 0, numCols, 50, width - 50);

        for (let row = 0; row < numRows; row += 1) {
          let y = height / 4 + row * 10 + sin(strandPhase + colOffset) * 150;
          let sizeOffset = (cos(strandPhase - (row / numRows) + colOffset) + 1) * 0.7;
          let circleSize = sizeOffset * maxCircleSize * multiplier;

          noStroke();
          fill(lerpColor(colorA, colorB, row / numRows));
          ellipse(x, y, circleSize, circleSize);
        }
      }
    }
  }
};

const FlowerVisualization = class extends Visualization {
  constructor() {
    super();
    this.angle1 = 0;
    this.angle2 = 27;
  }

  visualize(level, spectrum) {
    angleMode(RADIANS);
    const lowSpectrum = spectrum.slice(0, spectrum.length / 2);
    const highSpectrum = spectrum.slice(spectrum.length / 2, spectrum.length);

    const x1 = width / 7;
    const y1 = (height / 4) - (height / 12);
    const x2 = width / 3 + (height / 12);
    const y2 = (height / 3);

    noStroke();
    fill(0, 102);

    this.angle1 += 5;
    this.angle2 += 5;
    const offset1 = map(max(lowSpectrum), 0, 300, 10, 320);
    const offset2 = map(max(highSpectrum), 0, 130, 10, 320);
    const color = map(level, 0, 0.2, 0, 230);
    const val1 = cos(radians(this.angle1)) * offset1;
    const val2 = cos(radians(this.angle2)) * offset2;

    for (let a = 0; a < 360; a += 75) {
      const xoff1 = cos(radians(a)) * val1;
      const yoff1 = sin(radians(a)) * val1;

      fill(148, color, color, 150);
      ellipse(x1 + xoff1, y1 + yoff1, 40, 40);
    }

    for (let a = 0; a < 360; a += 52) {
      const xoff2 = cos(radians(a)) * val2;
      const yoff2 = sin(radians(a)) * val2;

      fill(148, color, color, 120);
      ellipse(x2 + xoff2, y2 + yoff2, 20, 20);
    }

    fill(182, 182, 182, 150);
    ellipse(x1, y1, 2, 2);
    ellipse(x2, y2, 2, 2);
  }
};

const StationaryCircleVisualization = class extends Visualization {
  visualize(level) {
    const size = map(level, 0, 0.5, 0, 300);
    const r = map(level, 0, 0.5, 18, 36 * 3);
    const g = map(level, 0, 0.5, 18, 39 * 3);
    const b = map(level, 0, 0.5, 18, 45 * 3);

    strokeWeight(level * 150);
    stroke(r, g, b);
    ellipse((width / 4), (height / 4), size * 4, size * 4);
    strokeWeight(level * 100);
    ellipse((width / 4), (height / 4), size * 3, size * 3);
    strokeWeight(level * 20);
    ellipse((width / 4), (height / 4), size * 4.5, size * 4.5);
  }
};

const SpectrumVisualization = class extends Visualization {
  visualize(level, spectrum) {
    noStroke();

    for (let i = 0; i < spectrum.length; i++) {
      const x = map(i, 0, spectrum.length, 0, (width / 2));
      const h = -height + map(spectrum[i], 0, 255, height / 2, 0);


      const color = map(i, 0, spectrum.length / 2, 10, 255);
      fill(148, color, color, 120);

      rect(x + i, height, (width / 2) / spectrum.length, h)
    }
  }
};

const LockGroove = class {
  constructor(noise, groove) {
    this.noise = noise;
    this.groove = groove;
    this.fadeTimeMs = 3000;
    this.defaultGainValue = 1;

    this.noise.setLoop(false);
    this.groove.setLoop(false);

    this.noise.onended(() => {
      this.groove.loop()
    });

    this.noise.disconnect();
    this.groove.disconnect();

    this.noiseGain = new p5.Gain();
    this.grooveGain = new p5.Gain();
    this.noiseGain.amp(this.defaultGainValue);
    this.grooveGain.amp(this.defaultGainValue);

    this.noiseGain.setInput(this.noise);
    this.grooveGain.setInput(this.groove);

    this.noiseGain.connect(masterGain);
    this.grooveGain.connect(masterGain);

    this.noiseAmplitude = new p5.Amplitude();
    this.noiseAmplitude.setInput(this.noiseGain);
    this.noiseFFT = new p5.FFT();
    this.noiseFFT.setInput(this.noiseGain);

    this.grooveAmplitude = new p5.Amplitude();
    this.grooveAmplitude.setInput(this.grooveGain);
    this.grooveFFT = new p5.FFT();
    this.grooveFFT.setInput(this.grooveGain);
  }

  isPlaying() {
    return this.noise.isPlaying() || this.groove.isLooping();
  }

  loop() {
    this.noise.play();
  }

  /**
   *
   * @param {Number} durationMs Fade duration in milliseconds
   * @param {Visualization} visualization Visualization for this sound
   */
  fadeAndStop(durationMs = this.fadeTimeMs, visualization) {
    if (this.noise.isPlaying() || this.groove.isLooping()) {
      this.noiseGain.amp(0, durationMs / 1000);
      this.grooveGain.amp(0, durationMs / 1000);

      function delayedStop() {
        this.noise.stop();
        this.groove.stop();
        this.resetGainLevels();
        visualization.reset();
      }

      setTimeout(delayedStop.bind(this), durationMs);
    }
  }

  stop(fadeOut, visualization) {
    if (fadeOut) {
      this.fadeAndStop(fadeOut, visualization);
    } else {
      this.noise.stop();
      this.groove.stop();
      visualization.reset();
    }
  }

  resetGainLevels() {
    this.noiseGain.amp(this.defaultGainValue);
    this.grooveGain.amp(this.defaultGainValue);
  }

  amplitude() {
    if (this.noise.isPlaying()) return this.noiseAmplitude;
    if (this.groove.isLooping()) return this.grooveAmplitude;
  }

  fft() {
    if (this.noise.isPlaying()) return this.noiseFFT;
    if (this.groove.isLooping()) return this.grooveFFT;
  }
};

const SoundDefinition = class {
  constructor(sound, visualization = new EllipseVisualization) {
    this.viz = visualization;
    this.sound = sound;
  }

  isPlaying() {
    return this.sound.isPlaying();
  }

  visualize() {
    if (!this.isPlaying()) return;

    const level = this.sound.amplitude().getLevel();
    const spectrum = this.sound.fft().analyze();

    if (level || spectrum) {
      noFill();
      this.viz.visualize(level, spectrum);
    }
  }
};

let soundDefinitions;
let recorder;
let soundFile;
let soundDefs;
const defaultFadeDuration = 250;
let soundBoardContainerEl;
let soundBoardBgEl;
let triggerGroupSize = 7;
let recordButton;
let stopAllButton

const masterGain = new p5.Gain();
masterGain.amp(1);
masterGain.connect();

// preload is called directly before setup()
function preload() {
  soundDefs = {
    lockGroove1: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-1-noise.mp3'),
        loadSound('sounds/loops/lock-groove-1-loop.mp3'),
      ),
      viz: new EllipseVisualization,
      displayIcon: 'images/icon-1.svg'
    },

    lockGroove2: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-2-noise.mp3'),
        loadSound('sounds/loops/lock-groove-2-loop.mp3'),
      ),
      viz: new LineVibrationVisualization,
      displayIcon: 'images/icon-2.svg',
    },

    lockGroove3: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-3-noise.mp3'),
        loadSound('sounds/loops/lock-groove-3-loop.mp3'),
      ),
      viz: new SpiralVisualization,
      displayIcon: 'images/icon-3.svg',
    },

    lockGroove4: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-4-noise.mp3'),
        loadSound('sounds/loops/lock-groove-4-loop.mp3'),
      ),
      viz: new AmpVisualization,
      displayIcon: 'images/icon-4.svg',
      displayIconScale: 1.5,
    },

    lockGroove5: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-5-noise.mp3'),
        loadSound('sounds/loops/lock-groove-5-loop.mp3'),
      ),
      viz: new SpectrumVisualization,
      displayIcon: 'images/icon-5.svg',
    },

    lockGroove6: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-6-noise.mp3'),
        loadSound('sounds/loops/lock-groove-6-loop.mp3'),
      ),
      viz: new RadialVisualization,
      displayIcon: 'images/icon-6.svg',
    },

    lockGroove7: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-7-noise.mp3'),
        loadSound('sounds/loops/lock-groove-7-loop.mp3'),
      ),
      viz: new ParticleScurryVisualization,
      displayIcon: 'images/icon-7.svg',
    },

    lockGroove8: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-8-noise.mp3'),
        loadSound('sounds/loops/lock-groove-8-loop.mp3'),
      ),
      viz: new CurveVisualization,
      displayIcon: 'images/icon-8.svg',
      displayIconScale: 1.5,
    },

    lockGroove9: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-9-noise.mp3'),
        loadSound('sounds/loops/lock-groove-9-loop.mp3'),
      ),
      viz: new HelixVisualization,
      displayIcon: 'images/icon-9.svg',
      displayIconScale: .95,
    },

    lockGroove10: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-10-noise.mp3'),
        loadSound('sounds/loops/lock-groove-10-loop.mp3'),
      ),
      viz: new StationaryCircleVisualization,
      displayIcon: 'images/icon-10.svg',
    },

    lockGroove11: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-11-noise.mp3'),
        loadSound('sounds/loops/lock-groove-11-loop.mp3'),
      ),
      viz: new FlowerVisualization,
      displayIcon: 'images/icon-11.svg',
      displayIconScale: .95,
    },

    lockGroove12: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-12-noise.mp3'),
        loadSound('sounds/loops/lock-groove-12-loop.mp3'),
      ),
      viz: new ArcVisualization,
      displayIcon: 'images/icon-12.svg',
      displayIconScale: 1.75,
    },

    lockGroove13: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-13-noise.mp3'),
        loadSound('sounds/loops/lock-groove-13-loop.mp3'),
      ),
      viz: new SnowVisualization,
      displayIcon: 'images/icon-13.svg',
      displayIconScale: 1.25,
    },

    lockGroove14: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-14-noise.mp3'),
        loadSound('sounds/loops/lock-groove-14-loop.mp3'),
      ),
      viz: new RotatingWaveVisualization,
      displayIcon: 'images/icon-14.svg',
      displayIconScale: 1.25,
    },
  };


  soundDefinitions = Object.entries(soundDefs).reduce((accum, [key, def]) => {
    accum[key] = new SoundDefinition(def.sound, def.viz);

    return accum
  }, {});
}

const toggleSound = (id, fadeOut = 0) => {
  const sound = soundDefs[id].sound;

  if (sound.isPlaying()) {
    sound.stop(fadeOut, soundDefs[id].viz);
  } else {
    sound.loop();
  }
};

/**
 *
 * @param {Element} el sound trigger el
 * @param {Boolean} force force active state
 */
const toggleSoundTrigger = (el, force) => {
  el.classList.toggle('active', force);

  if (document.querySelector('.soundTrigger.active')) {
    soundBoardContainerEl.classList.add('active');
  } else {
    soundBoardContainerEl.classList.remove('active');
  }
};

function stopAll() {
  Object.values(soundDefinitions).forEach((square) => square.sound.fadeAndStop(defaultFadeDuration, square.viz));
  document.querySelectorAll('.soundTrigger').forEach((el) => toggleSoundTrigger(el, false));
}

function createSoundButton(key, displayIcon, displayIconScale) {
  const container = document.createElement('div');

  container.classList.add('soundTriggerContainer');
  container.dataset.soundFile = displayIcon;
  
  if (displayIconScale) {
    container.dataset.displayIconScale = displayIconScale;
  }

  const button = document.createElement('button');

  button.classList.add('soundTrigger');

  button.addEventListener('click', (event) => {
    const fadeOut = !event.shiftKey;

    toggleSound(key, defaultFadeDuration);
    toggleSoundTrigger(button);
  });

  const svgObject = document.createElement('object');

  svgObject.classList.add('svgObject');
  svgObject.type = 'image/svg+xml';
  svgObject.data = displayIcon;

  button.appendChild(svgObject);

  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const svgItem = svgDoc.querySelector('svg');

    button.appendChild(svgItem);
    button.removeChild(svgObject);
  });

  container.appendChild(button);

  return container
}

function isMobileDevice() {
  return window.innerWidth < 600 || window.innerHeight < 600
}

function isSafari() {
  return !!navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) && typeof document.body.style.webkitFilter !== "undefined" && !window.chrome;
}

function selectElements() {
  recordButton = document.querySelector('#toggleRecord');
  stopAllButton = document.querySelector('#stopAll');
  soundBoardContainerEl = document.querySelector('#soundBoardContainer');
  soundBoardBgEl = document.querySelector('#soundBoardBg');
}

function setup() {
  selectElements();
  
  if (isMobileDevice()) {
    document.body.classList.add('mobile');
  } else if (isSafari()) {
    document.body.classList.add('simple-animations');
  }

  pixelDensity(2);
  createCanvas(window.innerWidth, window.innerHeight);

  const soundButtons = Object.entries(soundDefs).map(([key, soundDefinition], index) =>
    createSoundButton(key, soundDefinition.displayIcon, soundDefinition.displayIconScale));

  function groupSoundButtons(elements) {
    let layer;

    function createLayer(odd) {
      const el = document.createElement('div');
      
      el.classList.add('soundBoardTriggerLayer', odd ? 'odd' : 'even');
      
      return el;
    }

    const isMobile = isMobileDevice();

    elements.forEach((el, idx) => {
      if (isMobile) {
        soundBoardContainerEl.insertBefore(el, soundBoardBgEl);
      } else {
        if (idx % triggerGroupSize === 0) {
          layer = createLayer(Boolean((idx + 1) % 2));
          soundBoardContainerEl.insertBefore(layer, soundBoardBgEl);
        }

        layer.appendChild(el);
      }
    })
  }

  groupSoundButtons(soundButtons);
  updateSoundBoardLayout();

  // Move canvas into manipulable container
  document.querySelector('#canvasContainer')
    .appendChild(document.querySelector('#defaultCanvas0'));

  setCanvasDimensions();

  initEventListeners();

  document.querySelector('#topLayer').classList.remove('hideUntilLoaded');
}

function updateSoundBoardLayout() {
  const containerEl = document.querySelector('#soundBoardContainer');

  if (isMobileDevice()) {
    const containerArea = (containerEl.offsetWidth * .85) * (containerEl.offsetHeight * .85);
    const areaPerIcon = containerArea / Object.keys(soundDefs).length;
    const iconDimension = Math.sqrt(areaPerIcon);
    const elements = Array.prototype.slice.call(containerEl.querySelectorAll('.soundTriggerContainer'));

    elements.forEach((el) => {
      el.querySelector('button').style.width = `${iconDimension}px`;
      el.querySelector('button').style.height = `${iconDimension}px`;
    });

    return
  }

  const layerNodeList = document.querySelectorAll('.soundBoardTriggerLayer');
  const layers = Array.prototype.slice.call(layerNodeList);

  // dynamic sizing concerns
  const containerDiameterPx = containerEl.offsetHeight > containerEl.offsetWidth ?
    containerEl.offsetWidth : containerEl.offsetHeight;
  const radiusPx = containerDiameterPx / 2;
  const rowPaddingCoefficient = 1/3; // how much of a row width to add in padding
  const nbrIconRows = layers.length;
  const nbrIconRowsWithPadding = nbrIconRows + (nbrIconRows * rowPaddingCoefficient) + rowPaddingCoefficient; // final rowPaddingCoefficient is for outer padding
  const usableIconAreaPx = radiusPx / nbrIconRowsWithPadding;
  const rowWidthPx = usableIconAreaPx / nbrIconRows;
  const paddingWidthPx = rowWidthPx * rowPaddingCoefficient;

  const soundBoardBgDimension = containerDiameterPx;

  soundBoardBgEl.style.width = `${soundBoardBgDimension}px`;

  function getExpansionTranslationY(groupIndex) {
    // 0 = 1 layers deep, 1 = 3 layers deep, 3 = 5 layers deep, etc...
    return (groupIndex + 1) * usableIconAreaPx + ((groupIndex + 1) * paddingWidthPx);
  }

  // outer point = (container radius - icon width * -1)
  // inner point = ((container radius - icon width - (icon width * 2))) * -1) // div by 2?

  layers.forEach((layer, idx) => {
    const itemsNodeList = layer.querySelectorAll('.soundTriggerContainer');
    const items = Array.prototype.slice.call(itemsNodeList);

    updateButtonGroup(items, idx)
  })

  function updateButtonGroup(items, groupIndex) {
    const itemCount = items.length;

    items.forEach((item, itemIndex) => {
      const displayIconScale = parseFloat(item.dataset.displayIconScale) || 1;

      item.style.width = `${rowWidthPx * displayIconScale}px`;
      //item.style.height = `${rowWidthPx}px`;

      const offsetAngle = (360 / itemCount);
      const rotateAngle = offsetAngle * itemIndex + (groupIndex % 2 ? offsetAngle / 2 : 0);
      // #1 translate items to absolute center
      // #2 rotate items to point in spread direction
      // #3 translate to spread items out
      // #4 reorient
      item.style.transform = `
        translate(${((itemCount/2 - itemIndex) * rowWidthPx) - rowWidthPx/2}px)
        rotate(${rotateAngle}deg)
        translate(0, ${getExpansionTranslationY(groupIndex)}px)
        rotate(-${rotateAngle}deg)
      `;
    });
  }
};

function setCanvasDimensions() {
  const canvas = document.querySelector('#canvasContainer canvas');

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.style.height = '100%';
  canvas.style.width = '100%';
}

function initEventListeners() {
  window.addEventListener('resize', () => {
    setCanvasDimensions();
    updateSoundBoardLayout();
  });
  recordButton.addEventListener('click', toggleRecordState);
  stopAllButton.addEventListener('click', stopAll);
}

function toggleRecordState(event) {
  const triggerEl = event.currentTarget;
  const recordingActive = triggerEl.classList.contains('active');

  if (recordingActive) {
    recorder.stop();
    save(soundFile, 'locked-groove-mix.wav');
    triggerEl.classList.remove('active');

    return
  }

  triggerEl.classList.add('active');

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();

  recorder.record(soundFile);
}

function draw() {
  background('black');
  Object.values(soundDefinitions).forEach(viz => viz.visualize());
}
