const Square = class {
  constructor(sound, x, y, width = 50, height = 50) {
    this.sound = sound;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
};

let squares;

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
    new Square(hiHat, 0, 0),
    new Square(jazzRide, 0, 50),
    new Square(tomFloor2Bar, 0, 100),
    new Square(kickHit, 0, 150),
    new Square(tomFloorRoll, 0, 200),
    new Square(tomLeftHit, 0, 250),
    new Square(bassDrum, 0, 300),
    new Square(taiko, 0, 350),
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
