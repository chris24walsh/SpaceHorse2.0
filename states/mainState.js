var cursors;

var planets;

var mainState = {

  preload: function() {

    game.load.image('background','assets/images/backgroundSprite.png');
    game.load.spritesheet('player','assets/images/shipSpriteSheet.png', 100, 100);
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('radar', 'assets/images/radar.png');

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    // music.resume();

    //Put planets in position
    planets = new Array(9);
    for (var i=0; i<9; i++) planets[i] = "planet" + i;
    var planetsDistances = new Array(0, 2, 3, 5, 8, 27, 51, 103, 161);
    var planetsDistanceScale = 15;
    for (var i=0; i<9; i++) {
      planets[i].anchor.x = 0.5;
      planets[i].anchor.y = 0.5;
    }
    for (var i=0; i<9; i++) {
      // planets[i].anchor.x = 0.5;
      // planets[i].anchor.y = 0.5;
      planetsDistances[i] = planetsDistances[i] * planetsDistanceScale; //Scale up the planet distances
      var randomAngle = Math.random() * 6.28319;
      var randomX = planetsDistances[i] * Math.cos(randomAngle);
      var randomY = planetsDistances[i] * Math.tan(randomAngle);
      planets[i] = game.add.sprite(game.world.centerX + randomX, game.world.centerY + randomY, "planet" + i);
    }
    // for (var i=0; i<9; i++) {
      // planets[i].anchor.x = -planetsDistances[i] + 0.5;
      // planets[i].anchor.y = 0.5;
    // }
    //Scatter planets angle randomly first
    // for (var i=0; i<9; i++) {
    //   planets[i].angle = Math.random() * 360;
    // }

    if (saveData[0]) player = game.add.sprite(saveData[0], saveData[1], 'player');
    else player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    player.body.setZeroDamping();

    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    //Put ship next to earth
    player.body.x = planets[3].x;
    player.body.y = planets[3].y;
    // var i = 1;
    // planets[i].angle = 30;
    // player.body.x = game.world.centerX + ((planetsDistances[i]) * planets[i].width) * Math.cos(planets[i].angle * Math.PI / 180);
    // player.body.y = game.world.centerY + ((planetsDistances[i]) * planets[i].width) * Math.tan(planets[i].angle * Math.PI / 180);



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
    radar = game.add.image(player.body.x + window.innerWidth/5.5, player.body.y - window.innerHeight*0.48, 'radar');

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

    //Quit game
    if (keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      quitGame();
    }

    //Make planets orbit
    // for (var i=0; i<9;i++) planets[i].angle -= 0.01;

    //Keep radar in position
    radar.x = player.body.x + window.innerWidth/5.5;
    radar.y = player.body.y - window.innerHeight*0.48;
    //Put planets on radar map


  },

  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, 500);

  }

};

//Method definition

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

//Quit game
function quitGame() {
  // music.pause();
  game.state.start('gameOver');
}
