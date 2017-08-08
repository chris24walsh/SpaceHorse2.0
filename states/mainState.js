var player;
var cursors;

var mainState = {

  preload: function() {

      //game.load.script('gameOverState');
      game.load.image('background','assets/backgroundSprite.png');
      game.load.spritesheet('player','assets/shipSprite.png', 100, 100);
  		//game.load.spritesheet('paperplane','assets/paperplane.png', 35, 35);

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

		//  Our player animations, walking left, right, up and down.
		player.animations.add('forward', [0, 1, 2], 20, true);
		player.animations.add('right', [0], 10, true);
		player.animations.add('up', [0], 10, true);
    player.animations.add('down', [0], 10, true);

		//paperplane = game.add.sprite(game.world.centerX, game.world.centerY, 'paperplane');

		//game.physics.p2.enable(paperplane);

		// Throwing paperplane animations
		//paperplane.animations.add('left', [0], 10, true);
		//paperplane.animations.add('right', [0], 10, true);
		//paperplane.animations.add('up', [0], 10, true);
    //paperplane.animations.add('down', [0], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

		keys = game.input.keyboard;

    //Create game camera, that follows player
    game.camera.follow(player);

  },

  //var stopFrame = 19;

  update: function() {

    player.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        player.body.moveForward(500)
				player.animations.play('forward');
				//stopFrame = 14;
    }
    else if (cursors.down.isDown)
    {
        player.body.moveBackward(300);
				//player.animations.play('down');
				//stopFrame = 19;
    }

    if (cursors.left.isDown)
    {
        player.body.rotateLeft(80);
				//player.animations.play('left');
				//stopFrame = 4;
    }
    else if (cursors.right.isDown)
    {
        player.body.rotateRight(80);
				//player.animations.play('right');
				//stopFrame = 9;
    }
    else { //Stop rotating
        player.body.rotateLeft(0);
        //player.animations.play('right');
				//stopFrame = 9;
    }
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (this.spacebar.isDown) {
      player.kill();
      game.state.start('gameOver');
    }

  },

  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);

  }

};
