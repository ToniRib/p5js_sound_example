const FanVisualization = class {
  visualize(level) {
    let randomMultiplier = random(150);

    strokeWeight(2);
    triangle(130 + randomMultiplier, 70, 158, 120, 186, 175);
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

const Square = class {
  constructor(sound, color = 'blue', visualization = new EllipseVisualization) {
    this.color = color;
    this.viz = visualization;
    this.sound = sound

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
      stroke(this.color);
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

function preload() {
  soundDefs = {
    hihat: {
      sound: loadSound('sounds/Raw_Drums_HiHat_100bpm_1bar_Roll.wav'),
      color: '#3cffce',
      viz: () => new FanVisualization()
    },

    jazzRide: {
      sound: loadSound('sounds/Raw_Drums_Jazz_Ride_03.wav'),
      color: '#cdee76',
    },

    tomFloor2Bar: {
      sound: loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_2bar_02.wav'),
      color: '#3c00ff',
    },

    kickHit: {
      sound: loadSound('sounds/Raw_Drums_Kick_Hit_04.wav'),
      color: '#aeff8c',
    },

    tomFloorRoll: {
      sound: loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_Roll_01.wav'),
      color: '#aeff23',
    },

    tomLeftHit: {
      sound: loadSound('sounds/Raw_Drums_Tom_Left_Hit_01.wav'),
      color: '#40beff',
    },

    bassDrum: {
      sound: loadSound('sounds/taiko.wav'),
      color: '#1976d2',
    },

    taiko: {
      sound: loadSound('sounds/bass_drum_120.wav'),
      color: '#ee9aee',
    }
  };

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();

  const masterGain = new p5.Gain();
  masterGain.connect();

  visualizations = Object.entries(soundDefs).reduce((accum, [key, def]) => {
    accum[key] = new Square(def.sound, def.color, def.viz && def.viz());
    
    return accum
  }, {})

  // squares.forEach(square => {
  //   gain = new p5.Gain();
  //   gain.setInput(square.sound);
  //   gain.connect(masterGain);
  // })
}

const toggleSound = (id) => {
  const sound = soundDefs[id].sound
  const viz = visualizations[id]

  if (sound.isPlaying()) {
    sound.stop();
  } else {
    sound.loop();
  }
}

const toggleSoundTrigger = (el) => {
  if (el.classList.contains('active')) {
    el.classList.remove('active')
  } else {
    el.classList.add('active')
  }
}

const createSoundButton = (key, def) => {
  const container = document.createElement('div');

  container.classList.add('soundTriggerContainer');

  const button = document.createElement('button');
  
  button.classList.add('soundTrigger');

  button.addEventListener('click', () => {
    toggleSound(key)
    toggleSoundTrigger(button)
  });

  const textNode = document.createTextNode(key);

  button.appendChild(textNode);
  container.appendChild(button);
  soundBoard.appendChild(container);
}

function setup() {
  createCanvas(800, 400);
  background('black');

  stroke('white');
  strokeWeight(4);
  fill('black');

  const soundBoard = document.querySelector('#soundBoard')

  Object.entries(soundDefs).forEach(([key, def]) => {
    createSoundButton(key, def)
  })

  // Move canvas into manipulable container
  document.querySelector('#canvasContainer')
    .appendChild(document.querySelector('#defaultCanvas0'))

  document.querySelector('#startRecording')
    .addEventListener('click', recordSound)

  document.querySelector('#stopRecording')
    .addEventListener('click', stopRecording)
  
  lockGrooveToggleEl = document.querySelector('#lockGrooveToggle')
  lockGrooveToggleEl.addEventListener('click', toggleLockGroove)

  const canvas = document.querySelector('#defaultCanvas0')
  
  canvas.style.height = '100%'
  canvas.style.width = '100%'
}

/**
 * Currently only plays one hardcoded intro + lock-groove set for exemplification
 */
function toggleLockGroove() {
  const introSound = soundDefs.tomFloorRoll.sound;
  const loopSound = soundDefs.tomLeftHit.sound;

  introSound.setLoop(false);
  loopSound.setLoop(false);

  if (introSound.isPlaying() || loopSound.isPlaying()) {
    lockGrooveToggleEl.classList.remove('active');
    introSound.onended = () => {};
    introSound.stop();
    loopSound.stop();
  } else {
    lockGrooveToggleEl.classList.add('active');
    introSound.onended(() => loopSound.loop());
    introSound.play();
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
  Object.values(visualizations).forEach(viz => viz.visualize());
}
