var statsMenuState = {
  create: function() {
    //Create game over label
    label = game.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Stats Menu\nPress ESC to resume game',
      {
        font: '22px Arial',
        fill: '#fff',
        align: 'center'
      }
    );

    //Anchor label to center of screen
    label.anchor.setTo(0.5, 0.5);

    //Keymap to spacebar
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  },

  update: function() {
    //Handle spacebar pressed
    if (this.spacebar.isDown) {
      game.state.start('main');
    }
  }
};
