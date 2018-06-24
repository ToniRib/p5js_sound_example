const FanVisualization = class {
  visualize(level) {
    let randomMultiplier = random(150);

    strokeWeight(2);
    triangle(130 + randomMultiplier, 70, 158, 120, 186, 175);
  }
};

const ArcVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 400);
    stroke('#aa0200');
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
    const color = map(level, 0, 1, 10, 150);

    stroke(150, color, color);
    strokeWeight(2);
    angleMode(DEGREES);

    translate(width / 2, height / 2);
    beginShape();
    for (let i = 1; i < 360; i++) {
      const r = map(this.levelHistory[i], 0, 0.6, 10, 1000);
      const x = r * cos(i);
      const y = r * sin(i);

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

    stroke('#aa0200');
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
    const size = map(level, 0, 1, 0, 300);
    let randomMultiplier = random(800);

    strokeWeight(4);
    ellipse((width / 2) + randomMultiplier - 200, (height / 2), size, size);
  }
};

const StationaryCircleVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 450);
    const color = map(level, 0, 1, 100, 255);

    strokeWeight(level * 50);
    stroke(0, 0, color);
    ellipse((width / 2), (height / 2), size * 4, size * 4);
  }
};

const Square = class {
  constructor(sound, visualization) {
    this.viz = visualization;
    this.sound = sound;

    this.amplitude = new p5.Amplitude();
    this.amplitude.setInput(this.sound);
  }

  isPlaying() {
    return this.sound.isLooping();
  }

  visualize() {
    if (!this.isPlaying()) return;

    const level = this.amplitude.getLevel();

    if (level) {
      noFill();
      this.viz.visualize(level);
    }
  }
};

let visualizations;
let amplitude;
let recorder;
let soundFile;
let soundDefs;
let lockGrooveToggleEl;
let ambientSound;
let lgIntroSound;
let lgLoopSound;

function preload() {
  ambientSound = loadSound(
    'sounds/193692_3056623-lq.mp3',
    (soundFile) => {
      soundFile.setVolume(0);
      soundFile.loop();
      soundFile.setVolume(.25, 10);
    }
  );

  lgIntroSound = loadSound('sounds/dubstep-atmo-269422_4976728-lq.mp3');
  lgLoopSound = loadSound('sounds/7958_16644-lq-loopable.mp3');

  soundDefs = {
    // dubstep_atmo: {
    //   sound: loadSound('sounds/dubstep-atmo-269422_4976728-lq.mp3'),
    //   color: '#999900'
    // },

    // gremlinish: {
    //   sound: loadSound('sounds/gremlinish-113512_1015240-lq.mp3'),
    //   color: '#ccddcc'
    // },

    lockGroove1: {
      sound: loadSound('sounds/LockGroove-1.m4a'),
      viz: new AmpVisualization,
    },

    lockGroove2: {
      sound: loadSound('sounds/LockGroove-2.m4a'),
      viz: new StationaryCircleVisualization,
    },

    lockGroove3: {
      sound: loadSound('sounds/LockGroove-3.m4a'),
      viz: new ArcVisualization,
    },

    lockGroove4: {
      sound: loadSound('sounds/LockGroove-4.m4a'),
      viz: new RadialVisualization,
    },

    lockGroove5: {
      sound: loadSound('sounds/LockGroove-5.m4a'),
    },

    lockGroove6: {
      sound: loadSound('sounds/LockGroove-6.m4a'),
    },

    lockGroove7: {
      sound: loadSound('sounds/LockGroove-7.m4a'),
    },

    lockGroove8: {
      sound: loadSound('sounds/LockGroove-8.m4a'),
    },

    lockGroove9: {
      sound: loadSound('sounds/LockGroove-9.m4a'),
    },

    lockGroove10: {
      sound: loadSound('sounds/LockGroove-10.m4a'),
    },
    //
    // lockGroove11: {
    //   sound: loadSound('sounds/LockGroove-11.m4a'),
    // },

    lockGroove12: {
      sound: loadSound('sounds/LockGroove-12.m4a'),
    },

    lockGroove13: {
      sound: loadSound('sounds/LockGroove-13.m4a'),
    },
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
  const viz = visualizations[id];

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

const createSoundButton = (key, def) => {
  const container = document.createElement('div');

  container.classList.add('soundTriggerContainer');

  const button = document.createElement('button');

  button.classList.add('soundTrigger');

  button.addEventListener('click', () => {
    toggleSound(key);
    toggleSoundTrigger(button);
  });

  const textNode = document.createTextNode(key);

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

  Object.entries(soundDefs).forEach(([key, def]) => {
    createSoundButton(key, def)
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
