var planets;
var planetsDistanceScale = 800;
var player;
var radar;
var planetDots;
var radarScale = 0.002;
var cursors;

var mainState = {

  preload: function() {

    game.load.image('background','assets/images/backgroundSprite.png');
    game.load.spritesheet('player','assets/images/shipSpriteSheet1.png', 100, 100);
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('radar', 'assets/images/radar.png');

    //Load game data
    // loadGameData();

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    // music.resume();

    //Create planets and put in position
    planets = new Array(9);
    for (var i=0; i<9; i++) planets[i] = "planet" + i;
    var planetsDistances = new Array(0, 2, 3, 5, 8, 27, 51, 103, 161);
    if (gameData[0]) { //Load positions from gameData
      for (var i=0; i<9; i++) planets[i] = game.add.sprite(gameData[3+(i*2)], gameData[4+(i*2)], "planet" + i);
    }
    else { //Create positions for planets
      for (var i=0; i<9; i++) {
        planetsDistances[i] = planetsDistances[i] * planetsDistanceScale; //Scale up the planet distances
        var randomAngle = Math.random() * 6.28319; //Randomise planets positions
        var randomX = planetsDistances[i] * Math.cos(randomAngle);
        var randomY = planetsDistances[i] * Math.tan(randomAngle);
        planets[i] = game.add.sprite(game.world.centerX + randomX, game.world.centerY + randomY, "planet" + i);
        planets[i].anchor.set(0.5, 0.5);
      }
      // planets[3].pivot.x = 200;
    }

    //Create player sprite
    if (gameData[0]) player = game.add.sprite(gameData[0], gameData[1], 'player');
    else player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    player.body.setZeroDamping();

    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    // Put ship next to earth
    if (!gameData[0]) {
      player.body.x = planets[3].x + 300;
      player.body.y = planets[3].y;
    }

    if (gameData[2]) player.body.angle = gameData[2];
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

    //Create game camera, that follows player
    game.camera.follow(player);

    //Radar background
    radar = game.add.image(0, 0, 'radar');
    game.stage.addChild(radar);
    radar.x += window.innerWidth*0.68;
    radar.y += window.innerHeight*0.03;

    //Create radar dots
    planetDots = new Array(9);
    for (var i=0; i<9; i++) {
      planetDots[i] = game.add.sprite(0, 0, box({length: 5, width: 5, color: '#ff0000'}));
      radar.addChild(planetDots[i]);
      // planetDots[i].x += window.innerWidth*0.17;
      // planetDots[i].y += window.innerHeight*0.19;
      //Place in scaled relative distance
      // planetDots[i].x += (planets[i].x - player.body.x) * 10;//window.innerWidth*0.1;
      // planetDots[i].y += (planets[i].y - player.body.y) * 10;//window.innerHeight*0.1;
      // console.log(planets[i].x - game.world.centerX);
    }
    playerDot = game.add.sprite(0, 0, box({length: 5, width: 5, color: '#00ff00'}));
    radar.addChild(playerDot);
    playerDot.x += window.innerWidth*0.17;//*0.85;
    playerDot.y += window.innerHeight*0.19;//*0.22;

    // playerDot1 = game.add.sprite(0, 0, box({length: 5, width: 5, color: '#00ff00'}));
    // radar.addChild(playerDot1);
    // playerDot.x += window.innerWidth*0.85;
    // playerDot.y += window.innerHeight*0.22;

    cursors = game.input.keyboard.createCursorKeys();

		keyboard = game.input.keyboard;

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

    //Toggle radar
    if (keyboard.addKey(Phaser.Keyboard.M).onDown) {
      // toggleRadar();
    }

    //Update Movement

    //Thrust
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) { //No rotation
      player.body.moveForward(700);
      player.animations.play('thrust');
    }

    //Thrust and Left
    if (cursors.up.isDown && !cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      player.body.moveForward(700);
      player.body.rotateLeft(50);
      player.animations.play('thrustAndLeft');
    }

    //Thrust and Right
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      player.body.moveForward(700);
      player.body.rotateRight(50);
      player.animations.play('thrustAndRight');
    }

    //Reverse
    if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) { //No rotation
      player.body.moveBackward(700);
      player.animations.play('reverse');
    }

    //Reverse and Left
    if (!cursors.up.isDown && cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      player.body.moveBackward(700);
      player.body.rotateLeft(50);
      player.animations.play('reverseAndLeft');
    }

    //Reverse and Right
    if (!cursors.up.isDown && cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      player.body.moveBackward(700);
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

    //No forward/back input, so stop moving
    if (!cursors.up.isDown && !cursors.down.isDown) {
      player.body.setZeroVelocity();
    }

    //No left/right input, so stop rotating
    if (!cursors.left.isDown && !cursors.right.isDown) {
      player.body.rotateLeft(0);
    }



    //No input at all
    if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      player.animations.play('idle');
      // player.body.setZeroVelocity();
    }

    //Stats menu
    if (keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      statsMenu();
    }

    //Make planets orbit
    // for (var i=0; i<9;i++) planets[i].angle -= 0.1;

    //Update radar dots
    for (var i=0; i<9; i++) {
      planetDots[i].x = 0;
      planetDots[i].y = 0;
      planetDots[i].x += window.innerWidth*0.17;
      planetDots[i].y += window.innerHeight*0.19;
      //Place in scaled relative distance
      planetDots[i].x += (planets[i].x - player.body.x) * radarScale;
      planetDots[i].y += (planets[i].y - player.body.y) * radarScale;
    }


  },

  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, 500);

  }

};

//Method definition

//Save game data
function saveGameData() {
  gameData[0] = player.body.x;
  gameData[1] = player.body.y;
  gameData[2] = player.body.angle;
  for (var i=0; i<9;i++) {
    gameData[3+(i*2)] = planets[i].x;
    gameData[4+(i*2)] = planets[i].y;
  }
}

//Save game
function saveGame() {
  saveGameData();
  localStorage.setItem('gameData', JSON.stringify(gameData));
}

//Load game data
function loadGameData() {
  player.body.x = gameData[0];
  player.body.y = gameData[1];
  player.body.angle = gameData[2];
  player.body.setZeroVelocity();
  for (var i=0; i<9;i++) {
    planets[i].x = gameData[3+(i*2)];
    planets[i].y = gameData[4+(i*2)];
  }
}

//Load game
function loadGame() {
  if (localStorage.getItem('gameData')) var gameData = JSON.parse(localStorage.getItem('gameData'));
  loadGameData();
}

//Stats Menu
function statsMenu() {
  // music.pause();
  saveGameData();
  game.stage.removeChild(radar);
  game.state.start('statsMenu');
}

//Quit game
function quitGame() {
  // music.pause();
  game.state.start('gameOver');
}

//Create method to create box sprite
function box(options) {
  var bmd = game.add.bitmapData(options.length, options.width);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, options.length, options.width);
  bmd.ctx.fillStyle = options.color;
  bmd.ctx.fill();
  return bmd;
};

//Toggle radar
function toggleRadar() {
  if (radar.visible) {
    radar.visible = false;
  }
  else {
    radar.visible = true;
  }
}
