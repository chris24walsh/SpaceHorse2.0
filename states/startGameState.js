var music;

var startGameState = {

  preload: function() {

    game.load.audio('music', 'assets/sounds/bensound-psychedelic.mp3');

  },

  create: function() {

    if (!music) music = game.sound.play('music');

  },

  update: function() {

    if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      game.state.start('main');
    }

  }

};
