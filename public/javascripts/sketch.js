// Credit to The Coding Train YouTube channel
// and https://github.com/therewasaguy for some inspiration/code for these visualizations

const black = '#010711';
const darkGray = '#13171F';
const mediumGray = '#1C2026';
const lightGray = '#24272D';
const red = '#94152A';

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

    const color = map(spectrum[590], 0, 1, 10, 150);
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
      this.particles[i].color = [19, 23, 31, opacity];

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
    stroke(mediumGray);
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

    stroke(lightGray);
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

    stroke('white');
    strokeWeight(4);
    ellipse(x + randomMultiplier, height / 2, size, size);
  }
};

const StationaryCircleVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 450);
    const color = map(level, 0, 1, 50, 200);

    strokeWeight(level * 100);
    stroke(color, 21, 42);
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

    this.noiseAmplitude = new p5.Amplitude();
    this.noiseAmplitude.setInput(this.noise);
    this.noiseFFT = new p5.FFT();
    this.noiseFFT.setInput(this.noise);

    this.grooveAmplitude = new p5.Amplitude();
    this.grooveAmplitude.setInput(this.groove);
    this.grooveFFT = new p5.FFT();
    this.grooveFFT.setInput(this.groove);

    this.noise.setLoop(false);
    this.groove.setLoop(false);

    this.noise.onended(() => {
      this.groove.loop()
    });
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
let lockGrooveToggleEl;
let lgIntroSound;
let lgLoopSound;

function preload() {
  lgIntroSound = loadSound('sounds/dubstep-atmo-269422_4976728-lq.mp3');
  lgLoopSound = loadSound('sounds/7958_16644-lq-loopable.mp3');

  soundDefs = {
    lockGroove1: {
      sound: new LockGroove(
        loadSound('sounds/noise/lock-groove-1-noise.mp3'),
        loadSound('sounds/loops/lock-groove-1-loop.mp3'),
      ),
      viz: new AmpVisualization,
      displayName: '1',
    },
    //
    // lockGroove2: {
    //   sound: loadSound('sounds/LockGroove-2.m4a'),
    //   viz: new StationaryCircleVisualization,
    //   displayName: '2',
    // },
    //
    // lockGroove3: {
    //   sound: loadSound('sounds/LockGroove-3.m4a'),
    //   viz: new ArcVisualization,
    //   displayName: '3',
    // },
    //
    // lockGroove4: {
    //   sound: loadSound('sounds/LockGroove-4.m4a'),
    //   viz: new RadialVisualization,
    //   displayName: '4',
    // },
    //
    // lockGroove5: {
    //   sound: loadSound('sounds/LockGroove-5.m4a'),
    //   viz: new EllipseVisualization,
    //   displayName: '5',
    // },
    //
    // lockGroove6: {
    //   sound: loadSound('sounds/LockGroove-6.m4a'),
    //   viz: new CurveVisualization,
    //   displayName: '6',
    // },
    //
    // lockGroove7: {
    //   sound: loadSound('sounds/LockGroove-7.m4a'),
    //   viz: new LineVibrationVisualization,
    //   displayName: '7',
    // },
    //
    // lockGroove8: {
    //   sound: loadSound('sounds/LockGroove-8.m4a'),
    //   displayName: '8',
    // },
    //
    // lockGroove9: {
    //   sound: loadSound('sounds/LockGroove-9.m4a'),
    //   displayName: '9',
    // },
    //
    // lockGroove10: {
    //   sound: loadSound('sounds/LockGroove-10.m4a'),
    //   displayName: '10',
    // },
    // //
    // // lockGroove11: {
    // //   sound: loadSound('sounds/LockGroove-11.m4a'),
    // //   displayName: '11',
    // // },
    //
    // lockGroove12: {
    //   sound: loadSound('sounds/LockGroove-12.m4a'),
    //   viz: new SpectrumVisualization,
    //   displayName: '12',
    // },
    //
    // lockGroove13: {
    //   sound: loadSound('sounds/LockGroove-13.m4a'),
    //   viz: new ParticleScurryVisualization,
    //   displayName: '13',
    // },
  };

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();

  const masterGain = new p5.Gain();
  masterGain.connect();

  visualizations = Object.entries(soundDefs).reduce((accum, [key, def]) => {
    accum[key] = new Square(def.sound, def.viz);

    return accum
  }, {})

  // squares.forEach(square => {
  //   gain = new p5.Gain();
  //   gain.setInput(square.sound);
  //   gain.connect(masterGain);
  // })
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

const createSoundButton = (key, displayName) => {
  const container = document.createElement('div');

  container.classList.add('soundTriggerContainer');

  const button = document.createElement('button');

  button.classList.add('soundTrigger');

  button.addEventListener('click', () => {
    toggleSound(key);
    toggleSoundTrigger(button);
  });

  const textNode = document.createTextNode(displayName);

  button.appendChild(textNode);
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
    createSoundButton(key, soundDefinition.displayName)
  });

  // Move canvas into manipulable container
  document.querySelector('#canvasContainer')
    .appendChild(document.querySelector('#defaultCanvas0'));

  document.querySelector('#startRecording')
    .addEventListener('click', recordSound);

  document.querySelector('#stopRecording')
    .addEventListener('click', stopRecording);

  lockGrooveToggleEl = document.querySelector('#lockGrooveToggle');
  lockGrooveToggleEl.addEventListener('click', toggleLockGroove);

  const canvas = document.querySelector('#defaultCanvas0');

  canvas.style.height = '100%';
  canvas.style.width = '100%';
}

const messageEl = document.querySelector('#messages');
const isLockGroovePlaying = () => lockGrooveToggleEl.classList.contains('active');

/**
 * Currently only plays one hardcoded intro + lock-groove set for exemplification
 */
function toggleLockGroove() {
  messageEl.innerHTML = '';
  lgIntroSound.setLoop(false);
  lgLoopSound.setLoop(false);

  if (lgIntroSound.isPlaying() || lgLoopSound.isPlaying()) {
    lockGrooveToggleEl.classList.remove('active');
    lgIntroSound.stop();
    lgLoopSound.stop();
  } else {
    messageEl.innerHTML = 'Playing lock-groove intro';
    lockGrooveToggleEl.classList.add('active');
    lgIntroSound.onended(() => {
      if (isLockGroovePlaying()) {
        messageEl.innerHTML = 'Looping lock-groove';
        lgLoopSound.loop()
      }
    });
    lgIntroSound.play();
  }
}

function recordSound() {
  console.log('RECORDING');
  recorder.record(soundFile);
}

function stopRecording() {
  console.log('STOPPING');
  recorder.stop();
  console.log('SAVING');
  save(soundFile, 'mySound.wav');
}

function draw() {
  background('black');
  Object.values(visualizations).forEach(viz => viz.visualize());
}
