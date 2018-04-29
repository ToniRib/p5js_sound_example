const FanVisualization = class {
  visualize(level) {
    let randomMultiplier = random(150);

    triangle(130 + randomMultiplier, 70, 158, 120, 186, 175);
  }
};

const EllipseVisualization = class {
  visualize(level) {
    const size = map(level, 0, 1, 0, 300);
    let randomMultiplier = random(800);

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

let squares, amplitude;

function preload() {
  let hiHat = loadSound('sounds/Raw_Drums_HiHat_100bpm_1bar_Roll.wav');
  let tomFloor2Bar = loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_2bar_02.wav');
  let jazzRide = loadSound('sounds/Raw_Drums_Jazz_Ride_03.wav');
  let kickHit = loadSound('sounds/Raw_Drums_Kick_Hit_04.wav');
  let tomFloorRoll = loadSound('sounds/Raw_Drums_Tom_Floor_100bpm_Roll_01.wav');
  let tomLeftHit = loadSound('sounds/Raw_Drums_Tom_Left_Hit_01.wav');
  let bassDrum = loadSound('sounds/taiko.wav');
  let taiko = loadSound('sounds/bass_drum_120.wav');

  squares = [
    new Square(hiHat, 0, 0, '#3cffce', new FanVisualization),
    new Square(jazzRide, 0, 50, '#cdee76'),
    new Square(tomFloor2Bar, 0, 100, '#3c00ff'),
    new Square(kickHit, 0, 150, '#aeff8c'),
    new Square(tomFloorRoll, 0, 200, '#aeff23'),
    new Square(tomLeftHit, 0, 250, '#40beff'),
    new Square(bassDrum, 0, 300, '#1976d2'),
    new Square(taiko, 0, 350, '#ee9aee'),
  ];
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
}

function mousePressed() {
  squares.forEach(square => {
    if (square.isClicked(mouseX, mouseY)) {
      square.toggle();
    }
  });
}

function draw() {
  squares.forEach(square => square.visualize());
}
