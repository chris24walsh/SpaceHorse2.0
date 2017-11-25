var planets;
var PLANETS_DISTANCE_SCALE = 800;
var player;
var enemiesKilled = 0;
var scrapCollected = 0;
var radar;
var planetDots;
var RADAR_SCALE = 0.002;
var cursors;
var PLAYER_MAX_SPEED = 1000;
var DEGREES_TO_RADIANS = Math.PI/180;
var RADIANS_T0_DEGREES = 1/DEGREES_TO_RADIANS;
var enemy;
var enemyMoveCounter = 0;
var ENEMY_CALM_SPEED = 100;
var ENEMY_ANGRY_SPEED = 200;
var enemySpeed = ENEMY_CALM_SPEED;
var ENEMY_REACT_DISTANCE = 350;
var ENEMY_IGNORE_DISTANCE = 500;
var ENEMY_REACTION_SPEED = 100;
var enemyAngry = false;

var mainState = {

  preload: function() {

    game.load.image('background','assets/images/backgroundSprite.png');
    game.load.spritesheet('player','assets/images/shipSpriteSheet1.png', 100, 100);
    game.load.spritesheet('enemy', 'assets/images/enemyShip.png', 100, 100);
    game.load.image('fireBall', 'assets/images/fireBall.png');
    game.load.image('spaceJunk', 'assets/images/spaceJunk.png');
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('radar', 'assets/images/radar.png');
    game.load.image('asteroid','assets/images/planet1.png');

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.setImpactEvents(true);

    game.physics.p2.restitution = 0;

    //Create collision groups
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    playerWeaponCollisionGroup = game.physics.p2.createCollisionGroup();
    planetCollisionGroup = game.physics.p2.createCollisionGroup();
    enemyCollisionGroup = game.physics.p2.createCollisionGroup();
    spaceJunkCollisionGroup = game.physics.p2.createCollisionGroup();
    asteroidCollisionGroup = game.physics.p2.createCollisionGroup();

    // music.resume();

    //Create planets and put in position
    planets = [9];
    planetGroup = game.add.group();
    if (gameData[0]) { //Load positions from gameData
      for (var i=0; i<9; i++) {
        planets[i] = game.add.sprite(gameData[3+(i*2)], gameData[4+(i*2)], "planet" + i);
      }
    }
    else { //Create positions for planets
      for (var i=0; i<9; i++) {
        var planetRadialDistance = PLANETS_RELATIVE_DISTANCES[i] * PLANETS_DISTANCE_SCALE; //Scale up the planet distances
        var randomAngle = Math.random() * Math.PI; //Get random angle (radians)
        var randomX = planetRadialDistance * Math.cos(randomAngle);
        var randomY = planetRadialDistance * Math.tan(randomAngle);
        planets[i] = game.add.sprite(game.world.centerX + randomX, game.world.centerY + randomY, "planet" + i);
      }
    }
    //More setup for planet sprites
    for (var i=0; i<9; i++) {
      planets[i].anchor.setTo(0.5, 0,5);
      planets[i].scale.setTo(PLANET_SCALE, PLANET_SCALE);
      game.physics.p2.enable(planets[i]);
      planetGroup.add(planets[i]);
      planets[i].body.setCollisionGroup(planetCollisionGroup);
    }

    //Create player sprite
    if (gameData[0] && gameData[1]) player = game.add.sprite(gameData[0], gameData[1], 'player');
    else player = game.add.sprite(planets[3].body.x, planets[3].body.y, 'player');

    game.physics.p2.enable(player);

    //Player physics properties
    if (gameData[2]) player.body.angle = gameData[2];
    else player.body.angle = 90;
    player.body.setRectangle(40, 40);
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides([asteroidCollisionGroup, spaceJunkCollisionGroup], playerCollideAction, this);
    // player.body.onBeginContact.add(function(body) {
    //   //If contact is made with spaceJunk
    //   if (body.sprite.key == "spaceJunk") {
    //     //Destroy space junk sprite
    //     body.sprite.destroy();
    //     //Increment playerScrapStats
    //     scrapCollected += 1;
    //     playerScrapStats.text = "Scrap collected: " + scrapCollected;
    //   }
    // }, this);
    player.body.setZeroDamping();
    player.anchor.setTo(0.5, 0.5);

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
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.P2JS;

    //Create some player stats on screen
    playerEnemyStats = game.add.text(window.innerWidth * 0.05, window.innerHeight * 0.1, "Enemies killed: " + enemiesKilled, { font: "bold 20px Arial", fill: "#fff"});
    game.stage.addChild(playerEnemyStats);
    playerScrapStats = game.add.text(window.innerWidth * 0.05, window.innerHeight * 0.2, "Scrap collected: " + scrapCollected, { font: "bold 20px Arial", fill: "#fff"});
    game.stage.addChild(playerScrapStats);

    //Create enemy

    enemy = game.add.sprite(player.body.x + (Math.random() * 2000 - 1000), player.body.y + (Math.random() * 2000 - 1000), 'enemy');
    game.physics.p2.enable(enemy);
    enemy.body.setRectangle(40, 40);
    enemy.body.setCollisionGroup(enemyCollisionGroup);
    enemy.body.collides(playerWeaponCollisionGroup, killEnemy, this);
    enemy.body.setZeroDamping();
    enemy.anchor.setTo(0.5, 0.5);
    enemy.animations.add('idle', [0], 10, true);
		enemy.animations.add('thrust', [0], 10, true);

    //Create space junk group
    spaceJunks = game.add.group();
    spaceJunks.enableBody = true;
    spaceJunks.physicsBodyType = Phaser.Physics.P2JS;

    //Radar background
    radar = game.add.sprite(window.innerWidth*0.5, window.innerHeight*0.5, 'radar');
    radar.scale.setTo(window.innerWidth/radar.width * 0.9, window.innerHeight/radar.height * 0.9);
    game.stage.addChild(radar);
    radar.anchor.setTo(0.5, 0.5);
    radar.visible = false;

    //Asteroid group
    asteroids = [];

    //Make an asteroid belt
    for (var i=0; i<10; i++) {
      var angle = Math.random() * Math.PI * 2;
      var distance = (Math.random() * 2000) + 5000;
      var randX = Math.sin(angle) * distance;
      var randY = Math.cos(angle) * distance;
      //Make the asteroids using coords above
      var asteroid = new Asteroid(game.world.centerX + randX, game.world.centerY + randY, 'asteroid');
      asteroid.make();
    }

    //Create radar dots
    planetDots = new Array(9);
    for (var i=0; i<9; i++) {
      planetDots[i] = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#6666ff'}));
      radar.addChild(planetDots[i]);
    }

    //Enemy dot
    enemyDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#ff0000'}));
    radar.addChild(enemyDot);

    //Player dot
    playerDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#00ff00'}));
    radar.addChild(playerDot);

    //Create game camera, that follows player
    game.camera.follow(player);

    //Create input name keys
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

    //Update Movement

    //Accelerate
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      accelerate(player);
      if (calculateSpeed(player) < PLAYER_MAX_SPEED) player.animations.play('thrust');
      else player.animations.play('idle');
    }

    //Accelerate and Left
    if (cursors.up.isDown && !cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      accelerate(player);
      player.body.rotateLeft(50);
      if (calculateSpeed(player) < PLAYER_MAX_SPEED) player.animations.play('thrustAndLeft');
      else player.animations.play('movingLeft');
    }

    //Accelerate and Right
    if (cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      accelerate(player);
      player.body.rotateRight(50);
      if (calculateSpeed(player) < PLAYER_MAX_SPEED) player.animations.play('thrustAndRight');
      else player.animations.play('movingRight');
    }

    //Deccelerate
    if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
      deccelerate(player);
      if (calculateSpeed(player) > 0) player.animations.play('reverse');
      else player.animations.play('idle');
    }

    //Deccelerate and Left
    if (!cursors.up.isDown && cursors.down.isDown && cursors.left.isDown && !cursors.right.isDown) {
      deccelerate(player);
      player.body.rotateLeft(50);
      if (calculateSpeed(player) > 0) player.animations.play('reverseAndLeft');
      else player.animations.play('stoppedLeft');
    }

    //Deccelerate and Right
    if (!cursors.up.isDown && cursors.down.isDown && !cursors.left.isDown && cursors.right.isDown) {
      deccelerate(player);
      player.body.rotateRight(50);
      if (calculateSpeed(player) > 0) player.animations.play('reverseAndRight');
      else player.animations.play('stoppedRight');
    }

    //Left
    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown)
    {
      player.body.rotateLeft(50);
      updateVelocity(player, calculateSpeed(player));
      player.animations.play('stoppedLeft');
    }

    //Right
    if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown)
    {
      player.body.rotateRight(50);
      updateVelocity(player, calculateSpeed(player));
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
      planetDots[i].x += (planets[i].x - player.body.x) * RADAR_SCALE;
      planetDots[i].y += (planets[i].y - player.body.y) * RADAR_SCALE;
    }
    if (enemy.exists) {
      enemyDot.x = 0;
      enemyDot.y = 0;
      enemyDot.x += (enemy.body.x - player.body.x) * RADAR_SCALE;
      enemyDot.y += (enemy.body.y - player.body.y) * RADAR_SCALE;
    }

    asteroids.forEach(function(asteroid) {
      asteroid.radarDot.x = 0;
      asteroid.radarDot.y = 0;
      if (asteroid.sprite.exists) {
        asteroid.radarDot.x += (asteroid.sprite.body.x - player.body.x) * RADAR_SCALE;
        asteroid.radarDot.y += (asteroid.sprite.body.y - player.body.y) * RADAR_SCALE;
      }
    }, this);

    //Player dot
    playerDot.x = 0;
    playerDot.y = 0;

    //Update enemy AI
    if (enemy.exists) {
      enemy.body.moveForward(enemySpeed); //Always moving
      enemy.animations.play('thrust');

      //If get too close, enemy becomes angry
      if (game.math.distance(enemy.body.x, enemy.body.y, player.body.x, player.body.y) < ENEMY_REACT_DISTANCE) {
        enemyAngry = true;
      }
      //Calms down if you get far enough away
      if (enemyAngry) {
        if (game.math.distance(enemy.body.x, enemy.body.y, player.body.x, player.body.y) > ENEMY_IGNORE_DISTANCE) {
          enemyAngry = false;
        }
      }
      //Angry behaviour
      if (enemyAngry) {
        enemySpeed = ENEMY_ANGRY_SPEED;

        //Find angle to attack player at
        var attackRotation = game.math.angleBetween(enemy.body.x, enemy.body.y, player.body.x, player.body.y) + Math.PI/2;

        //Resolve attackAngle to angle between 0 and PI*2
        if (attackRotation < 0) attackRotation += (Math.PI * 2);
        if (attackRotation > (Math.PI * 2)) attackRotation -= (Math.PI * 2);

        //Resolve enemy's angle to angle between 0 and PI*2
        if (enemy.body.rotation < 0) enemy.body.rotation += (Math.PI * 2);
        if (enemy.body.rotation > (Math.PI * 2)) enemy.body.rotation -= (Math.PI * 2);

        //Determine which way to rotate
        if ((Math.abs(enemy.body.rotation - attackRotation)) < Math.PI/16) enemy.body.rotation = attackRotation; //Just follow angle angle
        else if (enemy.body.rotation > attackRotation) {
          if (Math.abs((enemy.body.rotation - attackRotation)) < Math.PI) enemy.body.rotateLeft(100);
          else enemy.body.rotateRight(ENEMY_REACTION_SPEED);
        }
        else if (enemy.body.rotation < attackRotation) {
          if (Math.abs((enemy.body.rotation - attackRotation)) < Math.PI) enemy.body.rotateRight(100);
          else enemy.body.rotateLeft(ENEMY_REACTION_SPEED);
        }

      }
      //Calm behaviour
      else {
        if (game.time.now > enemyMoveCounter) { //Update behaviour at regular intervals
          enemySpeed = ENEMY_CALM_SPEED;
          var randomAngularVelocity = (Math.random() * 50) - 25;
          enemy.body.rotateLeft(randomAngularVelocity);
          enemyMoveCounter = game.time.now + (Math.random() * 2000 + 1000); //Sluggish with no one around
        }
      }
    }

  },

  render: function() {

    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.spriteInfo(player, 32, 500);
    // game.debug.spriteInfo(enemy, 32, 500);
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
  bulletOffsetX = Math.sin(player.body.angle *  DEGREES_TO_RADIANS) * player.width/2;
  bulletOffsetY = Math.cos(player.body.angle *  DEGREES_TO_RADIANS) * player.width/2 * (-1);
  var bullet = bullets.create(player.body.x + bulletOffsetX, player.body.y + bulletOffsetY, 'fireBall');
  bullet.autoCull = true;
  bullet.outOfCameraBoundsKill = true;
  bullet.anchor.setTo(0.5, 0.5);
  bullet.body.angle = player.body.angle;
  bullet.body.setZeroDamping();
  bullet.body.setRectangle(40, 40);
  bullet.body.setCollisionGroup(playerWeaponCollisionGroup);
  bullet.body.collides([enemyCollisionGroup, asteroidCollisionGroup], bulletCollideAction, this);
  // bullet.body.onBeginContact.add(function(body) {
    // if (body.sprite.key == 'asteroid') {
    //   // console.log(body.sprite.width);
    //   //If its big, break into two first
    //   if (body.sprite.width > 55) {
    //     for (var i=0; i<2; i++) {
    //       var asteroid = new Asteroid(body.x + (Math.random() * 20) - 10, body.y + (Math.random() * 20) - 10, 'asteroid');
    //       asteroid.make();
    //       asteroid.sprite.width = 30;
    //       asteroid.sprite.height = 30;
    //       //Give it some random velocity
    //       asteroid.sprite.body.rotation = Math.random() * Math.PI * 2;
    //       var speed = (Math.random() * 30) + 40;
    //       updateVelocity(asteroid.sprite, speed);
    //     }
    //   }
    //   //Destroy the asteroid
    //   body.sprite.destroy();
    // }
  // }, this);
  updateVelocity(bullet, calculateSpeed(player) + 1000);
}

//Calculate velocity
function calculateSpeed(sprite) {
  var s = Math.sqrt( Math.pow(sprite.body.velocity.x, 2) + Math.pow(sprite.body.velocity.y, 2) );
  return s;
}

//Increase Velocity
function accelerate(sprite) {
  var s = calculateSpeed(sprite);
  if (s < PLAYER_MAX_SPEED) s += 10;
  updateVelocity(sprite, s);
}

//Decrease Velocity
function deccelerate(sprite) {
  var s = calculateSpeed(sprite);
  if (s > 0) s -= 10;
  if (s < 0) s = 0;
  updateVelocity(sprite, s);
}

//Change velocity
function updateVelocity(sprite, speed) {
  sprite.body.velocity.x = Math.sin(sprite.body.angle *  DEGREES_TO_RADIANS) * speed;
  sprite.body.velocity.y = Math.cos(sprite.body.angle *  DEGREES_TO_RADIANS) * speed * (-1);
}

//Kill enemy
function killEnemy(enemyBody, bulletBody) {
  // //Drop some spacejunks just before destroying the enemy ship
  // for (var i=0; i<5; i++) {
  //   var spaceJunk = spaceJunks.create(enemyBody.x, bulletBody.y, 'spaceJunk');
  //   spaceJunk.body.setRectangle(40, 40);
  //   spaceJunk.body.setCollisionGroup(spaceJunkCollisionGroup);
  //   spaceJunk.body.collides(playerCollisionGroup);
  //   spaceJunk.scale.setTo(0.5, 0.5);
  //   spaceJunk.body.angle = Math.random() * 360;
  //   updateVelocity(spaceJunk, 50);
  // }
  // //Destroy parent sprites of both colliding bodies
  // enemyBody.sprite.destroy();
  // bulletBody.sprite.destroy();
  // //Increment playerScrapStats
  // enemiesKilled += 1;
  // playerEnemyStats.text = "Enemies killed: " + enemiesKilled;

}

//Collect space junk
function collectSpaceJunk(playerBody, spaceJunkBody) {
  //Destroy space junk sprite
  spaceJunkBody.sprite.kill();
  // spaceJunkBody.destroy();
  //Increment playerScrapStats
  scrapCollected += 1;
  playerScrapStats.text = "Scrap collected: " + scrapCollected;
}

//Class definitions
function Asteroid(x, y, image) {
  this.make = function() {
    asteroids.push(this);
    this.sprite = game.add.sprite(x, y, image);
    game.physics.p2.enable(this.sprite);
    this.sprite.body.x = x;
    this.sprite.body.y = y;
    this.sprite.scale.setTo(Math.random() * 3);
    // console.log(this.sprite.scale.x);
    // this.sprite.body.setCircle(this.sprite.width/2);
    this.sprite.body.setCollisionGroup(asteroidCollisionGroup);
    this.sprite.body.collides([playerCollisionGroup, playerWeaponCollisionGroup], asteroidCollideAction, this);
    // this.sprite.body.onBeginContact.add(function(body) {
    //
    // }, this);

    //Make asteroid dots for radar
    this.radarDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#ffffff'}));
    radar.addChild(this.radarDot);
  }
}

function playerCollideAction(playerBody, body) {
  //Give player a shock
  //playerBody.sprite.health -= 1;
  //Destroy asteroid
  if (body.sprite.key == 'asteroid') {
    //If its big, break into two first
    if (body.sprite.width > 55) {
      for (var i=0; i<2; i++) {
        //Create new smaller asteroid pieces
        var asteroid = new Asteroid(body.x + (Math.random() * 20) - 10, body.y + (Math.random() * 20) - 10, 'asteroid');
        asteroid.make();
        asteroid.sprite.width = 30;
        asteroid.sprite.height = 30;
        asteroid.sprite.body.setCircle(asteroid.sprite.width/2);
        asteroid.sprite.body.setCollisionGroup(asteroidCollisionGroup);
        // asteroid.sprite.body.setCircle(asteroid.sprite.width/2);
        asteroid.sprite.body.setCollisionGroup(asteroidCollisionGroup);
        asteroid.sprite.body.collides([playerCollisionGroup, playerWeaponCollisionGroup], asteroidCollideAction, this);
        asteroid.radarDot = game.add.sprite(0, 0, box({length: 2, width: 2, color: '#ffffff'}));
        radar.addChild(this.radarDot);
        //Give it some random velocity
        asteroid.sprite.body.rotation = Math.random() * Math.PI * 2;
        var speed = (Math.random() * 30) + 40;
        updateVelocity(asteroid.sprite, speed);
      }
    }
    //Destroy the asteroid
    body.sprite.destroy();
  }
  //If contact is made with spaceJunk
  else if (body.sprite.key == "spaceJunk") {
    //Destroy space junk sprite
    body.sprite.destroy();
    //Increment playerScrapStats
    scrapCollected += 1;
    playerScrapStats.text = "Scrap collected: " + scrapCollected;
  }
}

function bulletCollideAction(bulletBody, body) {
  //If asteroid
  if (body.sprite.key == 'asteroid') {
    //If its big, break into two first
    if (body.sprite.width > 55) {
      for (var i=0; i<2; i++) {
        //Create new smaller asteroid pieces
        var asteroid = new Asteroid(body.x + (Math.random() * 20) - 10, body.y + (Math.random() * 20) - 10, 'asteroid');
        asteroid.make();
        asteroid.sprite.width = 30;
        asteroid.sprite.height = 30;
        // asteroid.sprite.body.setCircle(asteroid.sprite.width/2);
        //Give it some random velocity
        asteroid.sprite.body.rotation = Math.random() * Math.PI * 2;
        var speed = (Math.random() * 30) + 40;
        updateVelocity(asteroid.sprite, speed);
      }
    }
    //Destroy the asteroid sprite
    body.sprite.destroy();
    //Destroy the bullet sprite
    bulletBody.sprite.destroy();
  }
  //If enemy
  else if (body.sprite.key == 'enemy') {
    //Drop some spacejunks just before destroying the enemy ship
    for (var i=0; i<5; i++) {
      var spaceJunk = spaceJunks.create(body.x, bulletBody.y, 'spaceJunk');
      spaceJunk.body.setRectangle(40, 40);
      spaceJunk.body.setCollisionGroup(spaceJunkCollisionGroup);
      spaceJunk.body.collides(playerCollisionGroup);
      spaceJunk.scale.setTo(0.5, 0.5);
      spaceJunk.body.angle = Math.random() * 360;
      updateVelocity(spaceJunk, 50);
    }
    //Destroy the enemy sprite
    body.sprite.destroy();
    //Destroy the bullet sprite
    bulletBody.sprite.destroy();
    //Increment playerScrapStats
    enemiesKilled += 1;
    playerEnemyStats.text = "Enemies killed: " + enemiesKilled;
  }
}

function asteroidCollideAction(asteroidBody, body) {

}
