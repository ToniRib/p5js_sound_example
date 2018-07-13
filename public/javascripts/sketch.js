// Credit to The Coding Train YouTube channel
// and https://github.com/therewasaguy for some inspiration/code for these visualizations

const black = '#010711';      // (1,   7,  17)
const darkGray = '#13171F';   // (19,  23, 31)
const mediumGray = '#1C2026'; // (28,  32, 38)
const lightGray = '#24272D';  // (36,  39, 45)
const red = '#94152A';        // (148, 21, 42)
const dullWhite = '#b6b6b6';

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

const CurveVisualization = class {
  visualize(_, spectrum) {
    const scaledSpectrum = spectrum;
    const length = scaledSpectrum.length;

    const color = map(spectrum[950], 0, 1, 10, 150);
    stroke(148, color, color);

    strokeWeight(2);

    beginShape();
    for (let i = 0; i < length; i++) {
      const point = smoothPoint(scaledSpectrum, i);
      const x = map(i, 0, length - 1, 0, width);
      const y = map(point, 0, 255, height / 5, 0);

      curveVertex(x, y + (height - 250));
    }
    endShape();
  }
};

const Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(random(0, 10), 0);
};

const ParticleScurryVisualization = class {
  constructor() {
    this.particles = new Array(256);

    for (let i = 0; i < this.particles.length; i++) {
      const x = random(0, width);
      const y = random(0, height);
      const position = createVector(x, y);
      this.particles[i] = new Particle(position);
    }
  }

  visualize(level, spectrum) {
    noStroke();

    for (let i = 0; i < 256; i++) {
      const thisLevel = map(spectrum[i], 0, 255, 0, 1) * 2;

      this.particles[i].position.y = spectrum[i] * 3;
      this.particles[i].position.x += this.particles[i].speed.x / (thisLevel);
      if (this.particles[i].position.x > width) this.particles[i].position.x = 0;
      this.particles[i].diameter = map(thisLevel, 0, 1, 0, 100) * this.particles[i].scale;

      const opacity = map(level, 0, 1, 150, 220);
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

const LineVibrationVisualization = class {
  visualize(level) {
    const y = 100 + map(level, 0, 1, 0, 400);

    stroke(red);
    strokeWeight(7);
    line(0, y, width, y);
  }
};

const ArcVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 400);

    stroke(lightGray);
    strokeWeight(3);
    ellipse(width / 2, height / 2, width, size * 10)
  }
};

const RadialVisualization = class {
  constructor() {
    this.levelHistory = [];
  }

  visualize(level) {
    this.levelHistory.push(level);

    stroke(red);
    strokeWeight(2);
    angleMode(DEGREES);

    beginShape();
    for (let i = 1; i < this.levelHistory.length; i++) {
      const r = map(this.levelHistory[i], 0, 0.6, 10, 1000);
      const x = (width / 2) + (r * cos(i));
      const y = (height / 2) + r * sin(i);

      vertex(x, y);
    }
    endShape();

    if (this.levelHistory.length > 360) {
      this.levelHistory.shift();
    }
  }
};

const AmpVisualization = class {
  constructor() {
    this.levelHistory = [];
  }

  visualize(level) {
    this.levelHistory.push(level);

    stroke(red);
    strokeWeight(3);

    beginShape();
    for (let i = 1; i < this.levelHistory.length; i++) {
      const y = map(this.levelHistory[i], 0, 0.5, height, 0);
      vertex(i, y - 200);
    }
    endShape();

    if (this.levelHistory.length > width) {
      this.levelHistory.shift();
    }
  }
};

const EllipseVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 700);
    const randomMultiplier = random(-(width / 2), width / 2);
    const x = width / 2;

    stroke(dullWhite);
    strokeWeight(4);
    ellipse(x + randomMultiplier, height / 2, size, size);
  }
};

const StationaryCircleVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 450);
    const r = map(level, 0, 1, 36, 36 * 3);
    const g = map(level, 0, 1, 39, 39 * 3);
    const b = map(level, 0, 1, 45, 45 * 3);

    strokeWeight(level * 100);
    stroke(r, g, b);
    ellipse((width / 2), (height / 2), size * 4, size * 4);
  }
};

const SpectrumVisualization = class {
  visualize(level, spectrum) {
    noStroke();
    const color = map(level, 0, 1, 100, 255);
    fill(color, 21, 42, 90);

    for (let i = 0; i < spectrum.length; i++) {
      const x = map(i, 0, spectrum.length, 0, width);
      const h = -height + map(spectrum[i], 0, 255, height, 0);

      rect(x, height, width / spectrum.length, h)
    }
  }
};

const LockGroove = class {
  constructor(noise, groove) {
    this.noise = noise;
    this.groove = groove;

    this.noise.setLoop(false);
    this.groove.setLoop(false);

    this.noise.onended(() => {
      this.groove.loop()
    });

    this.noise.disconnect();
    this.groove.disconnect();

    this.noiseGain = new p5.Gain();
    this.grooveGain = new p5.Gain();
    this.noiseGain.amp(1);
    this.grooveGain.amp(1);

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

  stop() {
    this.noise.stop();
    this.groove.stop();
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

const Square = class {
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

let visualizations;
let recorder;
let soundFile;
let soundDefs;

const masterGain = new p5.Gain();
masterGain.amp(1);
masterGain.connect();

function preload() {
  soundDefs = {
    lockGroove1: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-1-noise.mp3'),
        loadSound('sounds/loops/lock-groove-1-loop.mp3'),
      ),
      viz: new AmpVisualization,
      displayIcon: 'images/icon-1.svg',
    },

    lockGroove2: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-2-noise.mp3'),
        loadSound('sounds/loops/lock-groove-2-loop.mp3'),
      ),
      viz: new StationaryCircleVisualization,
      displayIcon: 'images/icon-2.svg',
    },

    lockGroove3: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-3-noise.mp3'),
        loadSound('sounds/loops/lock-groove-3-loop.mp3'),
      ),
      viz: new ArcVisualization,
      displayIcon: 'images/icon-3.svg',
    },

    lockGroove4: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-4-noise.mp3'),
        loadSound('sounds/loops/lock-groove-4-loop.mp3'),
      ),
      viz: new RadialVisualization,
      displayIcon: 'images/icon-4.svg',
    },

    lockGroove5: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-5-noise.mp3'),
        loadSound('sounds/loops/lock-groove-5-loop.mp3'),
      ),
      viz: new EllipseVisualization,
      displayIcon: 'images/icon-5.svg',
    },

    lockGroove6: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-6-noise.mp3'),
        loadSound('sounds/loops/lock-groove-6-loop.mp3'),
      ),
      viz: new CurveVisualization,
      displayIcon: 'images/icon-6.svg',
    },

    lockGroove7: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-7-noise.mp3'),
        loadSound('sounds/loops/lock-groove-7-loop.mp3'),
      ),
      viz: new LineVibrationVisualization,
      displayIcon: 'images/icon-7.svg',
    },

    lockGroove8: { // NEEDS VISUALIZATION
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-8-noise.mp3'),
        loadSound('sounds/loops/lock-groove-8-loop.mp3'),
      ),
      displayIcon: 'images/icon-8.svg',
    },

    lockGroove9: { // NEEDS VISUALIZATION
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-9-noise.mp3'),
        loadSound('sounds/loops/lock-groove-9-loop.mp3'),
      ),
      displayIcon: 'images/icon-9.svg',
    },

    lockGroove10: { // NEEDS VISUALIZATION
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-10-noise.mp3'),
        loadSound('sounds/loops/lock-groove-10-loop.mp3'),
      ),
      displayIcon: 'images/icon-10.svg',
    },

    lockGroove11: { // NEEDS VISUALIZATION
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-11-noise.mp3'),
        loadSound('sounds/loops/lock-groove-11-loop.mp3'),
      ),
      displayIcon: 'images/icon-11.svg',
    },

    lockGroove12: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-12-noise.mp3'),
        loadSound('sounds/loops/lock-groove-12-loop.mp3'),
      ),
      viz: new SpectrumVisualization,
      displayIcon: 'images/icon-12.svg',
    },

    lockGroove13: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-13-noise.mp3'),
        loadSound('sounds/loops/lock-groove-13-loop.mp3'),
      ),
      viz: new ParticleScurryVisualization,
      displayIcon: 'images/icon-13.svg',
    },

    // lockGroove14: { // NEEDS VISUALIZATION
    //   sound: new LockGroove(
    //     loadSound('sounds/noise/lock-groove-14-noise.mp3'),
    //     loadSound('sounds/loops/lock-groove-14-loop.mp3'),
    //   ),
    //   displayIcon: 'images/icon-14.svg',
    // },

    lockGroove15: { // NEEDS VISUALIZATION
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-15-noise.mp3'),
        loadSound('sounds/loops/lock-groove-15-loop.mp3'),
      ),
      displayIcon: 'images/icon-14.svg',
    },
  };


  visualizations = Object.entries(soundDefs).reduce((accum, [key, def]) => {
    accum[key] = new Square(def.sound, def.viz);

    return accum
  }, {});
}

const toggleSound = (id) => {
  const sound = soundDefs[id].sound;

  if (sound.isPlaying()) {
    sound.stop();
  } else {
    sound.loop();
  }
};

const toggleSoundTrigger = (el) => {
  if (el.classList.contains('active')) {
    el.classList.remove('active')
  } else {
    el.classList.add('active')
  }
};

const createSoundButton = (key, displayName, displayIcon) => {
  const container = document.createElement('div');

  container.classList.add('soundTriggerContainer');

  const button = document.createElement('button');

  button.classList.add('soundTrigger');

  button.addEventListener('click', () => {
    toggleSound(key);
    toggleSoundTrigger(button);
  });

  const image = new Image(24, 24);
  image.src = displayIcon;
  button.appendChild(image);

  container.appendChild(button);
  soundBoard.appendChild(container);
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('black');

  stroke('white');
  strokeWeight(4);
  fill('black');

  const soundBoard = document.querySelector('#soundBoard');

  Object.entries(soundDefs).forEach(([key, soundDefinition]) => {
    createSoundButton(key, soundDefinition.displayName, soundDefinition.displayIcon)
  });

  // Move canvas into manipulable container
  document.querySelector('#canvasContainer')
    .appendChild(document.querySelector('#defaultCanvas0'));

  const canvas = document.querySelector('#defaultCanvas0');

  canvas.style.height = '100%';
  canvas.style.width = '100%';
}

const recordButton = document.querySelector('#toggleRecord');
recordButton.addEventListener('click', toggleRecordState);

function toggleRecordState() {
  const recordingActive = recordButton.classList.contains('active');

  if (recordingActive ) {
    recorder.stop();
    save(soundFile, 'mySound.wav');
    recordButton.classList.remove('active');

    return
  }

  recordButton.classList.add('active');

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();

  recorder.record(soundFile);
}

function draw() {
  background('black');
  Object.values(visualizations).forEach(viz => viz.visualize());
}
