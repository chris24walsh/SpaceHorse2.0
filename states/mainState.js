var planets;
var planetsDistanceScale = 800;
var player;
var radar;
var planetDots;
var radarScale = 0.002;
var cursors;
var maxSpeed = 1000;
var degreesToRadians = Math.PI/180;
var enemyMoveCounter = 0;

var mainState = {

  preload: function() {

    game.load.image('background','assets/images/backgroundSprite.png');
    game.load.spritesheet('player','assets/images/shipSpriteSheet1.png', 100, 100);
    game.load.image('fireBall', 'assets/images/fireBall.png');
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('radar', 'assets/images/radar.png');

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    // music.resume();

    //Create planets and put in position
    planets = new Array(9);
    // for (var i=0; i<9; i++) planets[i] = "planet" + i;
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
        planets[i].anchor.setTo(0.5, 0,5);
      }
      // planets[3].pivot.x = 200;
    }
    for (var i=0; i<9; i++) planets[i].scale.setTo(planetScale, planetScale);

    //Create player sprite
    if (gameData[0]) player = game.add.sprite(gameData[0], gameData[1], 'player');
    else player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    player.body.setZeroDamping();

    player.anchor.setTo(0.5, 0.5);

    if (gameData[2]) player.body.angle = gameData[2];
    else player.body.angle = 90;

		//  Our player animations, walking left, right, up and down.
    player.animations.add('idle', [0], 10, true);
		player.animations.add('thrust', [1, 2], 10, true);
		player.animations.add('reverse', [3, 4], 10, true);
		player.animations.add('stoppedLeft', [5, 6], 10, true);
    player.animations.add('stoppedRight', [7, 8], 10, true);
    player.animations.add('movingLeft', [5, 6], 10, true);
    player.animations.add('movingRight', [7, 8], 10, true);
    player.animations.add('thrustAndLeft', [9, 10], 10, true);
		player.animations.add('thrustAndRight', [11, 12], 10, true);
		player.animations.add('reverseAndLeft', [13, 14], 10, true);
    player.animations.add('reverseAndRight', [15, 16], 10, true);

    //Create weapon
    weapon = game.add.weapon(30, 'fireBall');
    weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weapon.trackSprite(player, 0, 0, false);

    //Create game camera, that follows player
    game.camera.follow(player);

    //Create enemy
    enemy = game.add.sprite(game.world.centerX + 300, game.world.centerY + 100, 'player');
    game.physics.p2.enable(enemy);
    enemy.body.setZeroDamping();
    enemy.anchor.setTo(0.5, 0.5);
    enemy.animations.add('idle', [0], 10, true);
		enemy.animations.add('thrust', [1, 2], 10, true);

    //Radar background
    radar = game.add.sprite(window.innerWidth*0.5, window.innerHeight*0.5, 'radar');
    radar.scale.setTo(2, 2);
    game.stage.addChild(radar);
    radar.anchor.x = 0.5;
    radar.anchor.y = 0.5;
    radar.visible = false;

    //Create radar dots
    planetDots = new Array(9);
    for (var i=0; i<9; i++) {
      planetDots[i] = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#6666ff'}));
      radar.addChild(planetDots[i]);
    }
    enemyDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#ff0000'}));
    radar.addChild(enemyDot);
    playerDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#00ff00'}));
    radar.addChild(playerDot);

    cursors = game.input.keyboard.createCursorKeys();

		keyboard = game.input.keyboard;

    //Make world visible
    game.world.alpha = 1;

  },

  update: function() {

    //Actions
    //Save game
    keyboard.addKey(Phaser.Keyboard.F4).onDown.add(saveGame, this);

    //Load game
    keyboard.addKey(Phaser.Keyboard.F9).onDown.add(loadGame, this);

    //Toggle radar
    keyboard.addKey(Phaser.Keyboard.M).onDown.add(toggleRadar, this);

    //Fire weapon
    keyboard.addKey(Phaser.Keyboard.F).onDown.add(fireWeapon, this);

    //Stats menu
    if (keyboard.addKey(Phaser.Keyboard.ESC).isDown) {
      statsMenu();
    }

    keyboard.addKey(Phaser.Keyboard.V).onDown.add(displayVelocity, this);

    //Update Movement

    //Thrust
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      increaseVelocity();
      if (calculateSpeed() < maxSpeed) player.animations.play('thrust');
      else player.animations.play('idle');
    }

    //Thrust and Left
    if (cursors.up.isDown && !cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      increaseVelocity();
      player.body.rotateLeft(50);
      if (calculateSpeed() < maxSpeed) player.animations.play('thrustAndLeft');
      else player.animations.play('movingLeft');
    }

    //Thrust and Right
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      increaseVelocity();
      player.body.rotateRight(50);
      if (calculateSpeed() < maxSpeed) player.animations.play('thrustAndRight');
      else player.animations.play('movingRight');
    }

    //Reverse
    if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      decreaseVelocity();
      if (calculateSpeed() > 0) player.animations.play('reverse');
      else player.animations.play('idle');
    }

    //Reverse and Left
    if (!cursors.up.isDown && cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      decreaseVelocity();
      player.body.rotateLeft(50);
      if (calculateSpeed() > 0) player.animations.play('reverseAndLeft');
      else player.animations.play('stoppedLeft');
    }

    //Reverse and Right
    if (!cursors.up.isDown && cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      decreaseVelocity();
      player.body.rotateRight(50);
      if (calculateSpeed() > 0) player.animations.play('reverseAndRight');
      else player.animations.play('stoppedRight');
    }

    //Left
    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown)
    {
      player.body.rotateLeft(50);
      updateVelocity(calculateSpeed());
      player.animations.play('stoppedLeft');
    }

    //Right
    if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown)
    {
      player.body.rotateRight(50);
      updateVelocity(calculateSpeed());
      player.animations.play('stoppedRight');
    }

    //No forward/back input, so stop moving
    if (!cursors.up.isDown && !cursors.down.isDown) {

    }

    //No left/right input, so stop rotating
    if (!cursors.left.isDown && !cursors.right.isDown) {
      player.body.rotateLeft(0);
    }



    //No input at all
    if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      player.animations.play('idle');
    }

    //Make planets orbit
    // for (var i=0; i<9;i++) planets[i].angle -= 0.1;

    //Update radar dots
    for (var i=0; i<9; i++) {
      planetDots[i].x = 0;
      planetDots[i].y = 0;
      planetDots[i].x += (planets[i].x - player.body.x) * radarScale;
      planetDots[i].y += (planets[i].y - player.body.y) * radarScale;
    }
    enemyDot.x = 0;
    enemyDot.y = 0;
    enemyDot.x += (enemy.body.x - player.body.x) * radarScale;
    enemyDot.y += (enemy.body.y - player.body.y) * radarScale;


    //Update AI
    enemy.body.moveForward(100);
    enemy.animations.play('thrust');
    if (game.time.now > enemyMoveCounter) {
      enemy.body.angle = Math.random() * 360;
      enemyMoveCounter = game.time.now + 3000;
    }


  },

  render: function() {

    // game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, 500);
    // game.debug.spriteInfo(planets[3], 32, 500);

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
  var text = game.add.text(window.innerWidth/2, window.innerHeight/4, 'Game saved', { font: "bold 32px Arial", fill: "#fff"});
  game.stage.addChild(text);
  text.anchor.set(0.5);
  text.alpha = 1;
  game.add.tween(text).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
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
  if (localStorage.getItem('gameData')) {
    gameData = JSON.parse(localStorage.getItem('gameData'));
    loadGameData();
  }
  var text = game.add.text(window.innerWidth/2, window.innerHeight/4, 'Game loaded', { font: "bold 32px Arial", fill: "#fff"});
  game.stage.addChild(text);
  text.anchor.set(0.5);
  text.alpha = 1;
  game.add.tween(text).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
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

//Fire weapon
function fireWeapon() {
  weapon.trackOffset.x = Math.sin(player.body.angle *  degreesToRadians) * player.width/2;
  weapon.trackOffset.y = Math.cos(player.body.angle *  degreesToRadians) * player.width/2 * (-1);
  weapon.fireAngle = player.body.angle - 90;
  weapon.bulletSpeed = calculateSpeed() + 1000;
  weapon.fire();
}

//Display velocity
function displayVelocity() {
  var v = Math.sqrt( Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2) );
  console.log(player.body.velocity.x, player.body.velocity.y, v);
}

//Calculate velocity
function calculateSpeed() {
  var s = Math.sqrt( Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2) );
  return s;
}

//Increase Velocity
function increaseVelocity() {
  var s = calculateSpeed();
  console.log(s);
  if (s < maxSpeed) s += 10;
  updateVelocity(s);
}

//Decrease Velocity
function decreaseVelocity() {
  var s = calculateSpeed();
  if (s > 0) s -= 10;
  if (s < 0) s = 0;
  updateVelocity(s);
}

//Change velocity
function updateVelocity(speed) {
  player.body.velocity.x = Math.sin(player.body.angle *  degreesToRadians) * speed;
  player.body.velocity.y = Math.cos(player.body.angle *  degreesToRadians) * speed * (-1);
}
