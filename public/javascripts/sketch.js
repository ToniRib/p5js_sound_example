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
  constructor(sound, x, y, color = 'blue', visualization = new EllipseVisualization, width = 50, height = 50) {
    this.sound = sound;
    this.x = x;
    this.y = y;
    this.color = color;
    this.visualization = visualization;
    this.width = width;
    this.height = height;

    this.amplitude = new p5.Amplitude();
    this.amplitude.setInput(this.sound);
  }

  isClicked(mouseX, mouseY) {
    return mouseX >= this.x && mouseX < this.x + this.width &&
      mouseY >= this.y && mouseY < this.y + this.height;
  }

  toggle() {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    this.sound.loop();
  }

  stop() {
    this.sound.stop();
  }

  isPlaying() {
    return this.sound.isLooping();
  }

  visualize() {
    if (!this.isPlaying()) return;

    const level = this.amplitude.getLevel();
    if (level === 0) return;

    stroke(this.color);
    this.visualization.visualize(level);
  }
};

let squares, amplitude, recorder, soundFile;

function preload() {
  const squareDefs = {
    hihat: {
      file: loadSound('sounds/Raw_Drums_HiHat_100bpm_1bar_Roll.wav'),
      color: '#3cffce',
      coords: [0, 0],
      viz: () => new FanVisualization()
    },

    jazzRide: {
      file: loadSound('sounds/Raw_Drums_Jazz_Ride_03.wav'),
      color: '#cdee76',
      coords: [0, 50]
    },

    tomFloor2Bar: {
      file: loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_2bar_02.wav'),
      color: '#3c00ff',
      coords: [0, 100]
    },

    kickHit: {
      file: loadSound('sounds/Raw_Drums_Kick_Hit_04.wav'),
      color: '#aeff8c',
      coords: [0, 150]
    },

    tomFloorRoll: {
      file: loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_Roll_01.wav'),
      color: '#aeff23',
      coords: [0, 200]
    },

    tomLeftHit: {
      file: loadSound('sounds/Raw_Drums_Tom_Left_Hit_01.wav'),
      color: '#40beff',
      coords: [0, 250]
    },

    bassDrum: {
      file: loadSound('sounds/taiko.wav'),
      color: '#1976d2',
      coords: [0, 300]
    },

    taiko: {
      file: loadSound('sounds/bass_drum_120.wav'),
      color: '#ee9aee',
      coords: [0, 350]
    }
  };

  squares = Object.values(squareDefs).map((def) =>
    new Square(def.file, def.coords[0], def.coords[1], def.color, def.viz && def.viz()));

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();

  const masterGain = new p5.Gain();
  masterGain.connect();

  squares.forEach(square => {
    gain = new p5.Gain();
    gain.setInput(square.sound);
    gain.connect(masterGain);
  })
}

function setup() {
  createCanvas(800, 400);
  background('black');

  stroke('white');
  strokeWeight(4);
  fill('black');
  rect(0, 0, 50, 50);
  rect(0, 50, 50, 50);
  rect(0, 100, 50, 50);
  rect(0, 150, 50, 50);
  rect(0, 200, 50, 50);
  rect(0, 250, 50, 50);
  rect(0, 300, 50, 50);
  rect(0, 350, 50, 50);

  // Move canvas into manipulable container
  document.querySelector('#canvasContainer')
    .appendChild(document.querySelector('#defaultCanvas0'))

  document.querySelector('#startRecording')
    .addEventListener('click', recordSound)

  document.querySelector('#stopRecording')
    .addEventListener('click', stopRecording)
}

function mousePressed() {
  squares.forEach(square => {
    if (square.isClicked(mouseX, mouseY)) {
      square.toggle();
    }
  });
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
  squares.forEach(square => square.visualize());
}

