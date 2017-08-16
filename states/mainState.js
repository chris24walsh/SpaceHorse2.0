var player;
var cursors;

var mainState = {

  preload: function() {

    game.load.image('background','assets/backgroundSprite.png');
    game.load.spritesheet('player','assets/shipSpriteSheet.png', 100, 100);
		//game.load.spritesheet('fire','assets/fire.png', 35, 35);

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    player.body.setZeroDamping();

		//  Our player animations, walking left, right, up and down.
    player.animations.add('idle', [0], 10, true);
		player.animations.add('thrust', [1, 2], 10, true);
		player.animations.add('reverse', [3, 4], 10, true);
		player.animations.add('left', [5, 6], 10, true);
    player.animations.add('right', [7, 8], 10, true);
    player.animations.add('thrustAndLeft', [9, 10], 10, true);
		player.animations.add('thrustAndRight', [11, 12], 10, true);
		player.animations.add('reverseAndLeft', [13, 14], 10, true);
    player.animations.add('reverseAndRight', [15, 16], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

		keyboard = game.input.keyboard;

    //Create game camera, that follows player
    game.camera.follow(player);

  },

  update: function() {

    //Thrust
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) { //No rotation
      player.body.thrust(500);
      player.animations.play('thrust');
    }

    //Thrust and Left
    if (cursors.up.isDown && !cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      player.body.thrust(500);
      player.body.rotateLeft(50);
      player.animations.play('thrustAndLeft');
    }

    //Thrust and Right
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      player.body.thrust(500);
      player.body.rotateRight(50);
      player.animations.play('thrustAndRight');
    }

    //Reverse
    if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) { //No rotation
      player.body.reverse(300);
      player.animations.play('reverse');
    }

    //Reverse and Left
    if (!cursors.up.isDown && cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      player.body.reverse(300);
      player.body.rotateLeft(50);
      player.animations.play('reverseAndLeft');
    }

    //Reverse and Right
    if (!cursors.up.isDown && cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      player.body.reverse(300);
      player.body.rotateRight(50);
      player.animations.play('reverseAndRight');
    }

    //=Left
    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown)
    {
      player.body.rotateLeft(50);
      player.animations.play('left');
    }

    //Right
    if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown)
    {
      player.body.rotateRight(50);
      player.animations.play('right');
    }

    //No left/right input, so stop rotating
    if (!cursors.left.isDown && !cursors.right.isDown) {
      player.body.rotateLeft(0);
    }

    //No input at all, so lie idle
    if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      player.animations.play('idle');
      //Stop if below certain velocity
      if ( Math.sqrt( Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2) ) < 100) {
        player.body.setZeroVelocity();
      }
    }

    //Restart game
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (this.spacebar.isDown) {
      player.kill();
      game.state.start('gameOver');
    }

  },

  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, 500);

  }

};
