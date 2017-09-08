var music;

var startGameState = {

  preload: function() {

    game.load.audio('music', 'assets/sounds/intro1.wav');
    game.load.bitmapFont('pirulen', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

  },

  create: function() {

    if (!music) music = game.sound.play('music');

    var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    // text = game.add.text(window.innerWidth*0.5, window.innerHeight*0.52, 'SPACE HORSE', style);
    text = game.add.bitmapText(window.innerWidth/2, window.innerHeight/2, 'pirulen', 'SPACE HORSE');
    text.anchor.set(0.5);
    text.alpha = 0;
    text.tint = '#fff';

    //Fade in text, move, and fade out text
    tween1 = game.add.tween(text).to({alpha: 1}, 3000, Phaser.Easing.Linear.None);
    tween2 = game.add.tween(text).to({y: window.innerHeight*0.48}, 5000, Phaser.Easing.Linear.None, true);
    tween1.to({alpha: 0}, 4000, Phaser.Easing.Linear.None, true);

    //Timed exit of title screen
    timer = game.time.create(true);
    timer.add(6000, function() {
      goToIntro();
    }, this);
    timer.start();

  },

  update: function() {

    if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      goToIntro();
    }

  }

};

function goToIntro() {
  music.fadeOut(3000);
  music.onFadeComplete.add(function() {
    game.state.start('intro');
  }, this);
}
