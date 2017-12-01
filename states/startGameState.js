var music;

var startGameState = {

  preload: function() {

    game.load.audio('music', 'assets/sounds/intro1.wav');
    game.load.bitmapFont('pirulen', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

  },

  create: function() {

    //Title Music
    // if (!music) music = game.sound.play('music');

    //Title text
    var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    titleText = game.add.bitmapText(window.innerWidth/2, window.innerHeight/2, 'pirulen', 'SPACE HORSE');
    titleText.anchor.set(0.5);
    titleText.alpha = 0;

    //Press ESC to skip text
    skipText = game.add.text(window.innerWidth*0.5, window.innerHeight*0.9, 'Press ESC to skip', { font: "bold 20px Microsoft Yi Baiti", fill: "#e6e6e6"});
    skipText.anchor.set(0.5);
    skipText.alpha = 0;

    //Fade in titleText, move, and fade out titleText
    tween1 = game.add.tween(titleText).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true);
    tween2 = game.add.tween(titleText).to({y: window.innerHeight*0.45}, 7000, Phaser.Easing.Linear.None, true);
    tween3 = game.add.tween(skipText).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000);

    //Timed exit of title screen
    timer = game.time.create(true);
    timer.add(5000, function() {
      goToIntro();
    }, this);
    timer.start();

  },

  update: function() {

    //Skip title screen
    if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      goToIntro();
    }

  }

};

function goToIntro() {

  var tween1 = game.add.tween(titleText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  var tweenw = game.add.tween(skipText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  if (music) music.fadeOut(2000);
  tween1.onComplete.add(function() {
    game.state.start('intro');
  }, this);

}
