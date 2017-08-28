var music;

var startGameState = {

  preload: function() {

    game.load.audio('music', 'assets/sounds/bensound-psychedelic.mp3');
    game.load.bitmapFont('pirulen', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

  },

  create: function() {

    // if (!music) music = game.sound.play('music');

    var style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    text = game.add.text(window.innerWidth/2, window.innerHeight/2, 'SPACE HORSE', style);
    // text = game.add.bitmapText(window.innerWidth/2, window.innerHeight/2, 'pirulen', 'SPACE HORSE');
    text.anchor.set(0.5);
    text.alpha = 0;

    game.add.tween(text).to({alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

  },

  update: function() {

    if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      game.state.start('main');
    }

  }

};
