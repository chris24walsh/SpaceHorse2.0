// var player;

var cursors;

var planets;

var mainState = {

  preload: function() {

    game.load.image('background','assets/images/backgroundSprite.png');
    game.load.spritesheet('player','assets/images/shipSpriteSheet.png', 100, 100);
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    //Put planets in position
    planets = new Array(9);
    for (var i=0; i<9; i++) planets[i] = "planet" + i;
    var planetsDistances = new Array(0, 2, 3, 5, 8, 27, 51, 103, 161);
    var planetsDistanceScale = 10;
    for (var i=0; i<9; i++) planetsDistances[i] = planetsDistances[i] * planetsDistanceScale;
    for (var i=0; i<9; i++) planets[i] = game.add.sprite(game.world.centerX + planetsDistances[i], game.world.centerY, "planet" + i);
    for (var i=0; i<9; i++) game.physics.p2.enable(planets[i]);
    for (var i=0; i<9; i++) planets[i].body.static = true;

    if (saveData[0]) player = game.add.sprite(saveData[0], saveData[1], 'player');
    else player = game.add.sprite(game.world.centerX - 900, game.world.centerY - 400, 'player');

    game.physics.p2.enable(player);

    player.body.setZeroDamping();

    if (saveData[2]) player.body.angle = saveData[2];
    else player.body.angle = 90;

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

    //Radar background
    //

    cursors = game.input.keyboard.createCursorKeys();

		keyboard = game.input.keyboard;

    //Create game camera, that follows player
    game.camera.follow(player);

  },

  update: function() {

    //Actions
    //Save game
    if (keyboard.addKey(Phaser.Keyboard.F4).isDown) {
      saveGame();
    }

    //Load game
    if (keyboard.addKey(Phaser.Keyboard.F9).isDown) {
      loadGame();
    }

    //Update Movement

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

    //Left
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

    //No input at all
    if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      player.animations.play('idle');
      //Stop if below certain velocity
      if ( Math.sqrt( Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2) ) < 250) {
        player.body.setZeroVelocity();
      }
    }

    //Restart game
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (this.spacebar.isDown) {
      game.state.start('gameOver');
    }

    for (var i=0; i<9; i++) planets[i].body.rotateLeft(5);

  },

  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, 500);

  }

};

//Extra Methods

//Save game
function saveGame() {
  saveData[0] = player.body.x;
  saveData[1] = player.body.y;
  saveData[2] = player.body.angle;
  localStorage.setItem('saveData', JSON.stringify(saveData));

}

//Load game
function loadGame() {
  if (localStorage.getItem('saveData')) var saveData = JSON.parse(localStorage.getItem('saveData'));
  player.body.x = saveData[0];
  player.body.y = saveData[1];
  player.body.angle = saveData[2];
  player.body.setZeroVelocity();
}
