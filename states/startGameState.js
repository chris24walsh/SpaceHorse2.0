var startGameState = {

  preload: function() {


  },

  create: function() {


  },

  update: function() {

    if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      game.state.start('main');
    }

  }

};
