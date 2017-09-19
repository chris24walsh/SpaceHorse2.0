var textString;
var textDelay;
var textTime;
var textCount;
var textName;
var storyNumber;
var canRunStory;
var canAdvanceStory;

var PLANET_SCALE = 2;
var PLANETS_DISTANCE_SCALE = 800;
var PLANETS_RELATIVE_DISTANCES = new Array(0, 2, 3, 5, 8, 27, 51, 103, 161);

var introState = {

  preload: function() {

    game.load.image('background', 'assets/images/backgroundSprite.png');
    game.load.image('shimmeringBackground', 'assets/images/backgroundSprite.png');
    game.load.spritesheet('player', 'assets/images/shipSpriteSheet1.png', 100, 100);
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('textbox', 'assets/images/textbox.png');

  },

  create: function() {

    //Background
    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    //Game boundaries
    game.world.setBounds(0, 0, 1000000, 1000000);

    //Start game physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    //Stop music
    // if (music) music.fadeOut(1000);

    //Create planets and put in position
    planets = new Array(9);
    planetGroup = game.add.group();
    planetCollisionGroup = game.physics.p2.createCollisionGroup();
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

    //Make group for intro sprites
    // introGroup = game.add.group();

    //Add background for story 1
    shimmeringBackground = game.add.sprite(0, 0, 'shimmeringBackground');
    // introGroup.addChild(shimmeringBackground);
    game.stage.addChild(shimmeringBackground);
    shimmeringBackground.alpha = 0;

    //Focus camera on earth
    game.camera.x = planets[3].x - window.innerWidth/2;
    game.camera.y = planets[3].y - window.innerHeight/2;

    //Create player near earth
    player = game.add.sprite(planets[3].x + planets[3].width, planets[3].y, 'player');
    game.physics.p2.enable(player);
    player.body.angle = 90;
    player.anchor.setTo(0.5, 0.5);

    //  Our player animations, forward and idle.
    player.animations.add('idle', [0], 10, true);
		player.animations.add('thrust', [1, 2], 10, true);

    //Make text object
    text = game.add.text(window.innerWidth*0.3, window.innerHeight*0.2, '', { font: "bold 25px Arial", fill: "#fff" });
    game.stage.addChild(text);
    text.alpha = 0;
    text.wordWrap = true;
    text.wordWrapWidth = window.innerWidth*0.4;

    //Initialize story variables
    game.world.alpha = 0;
    storyNumber = -1;
    canRunStory = true;
    canAdvanceStory = false;
    canPrintText = false;

    //Toggle text
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function () {
      if (canAdvanceStory) {
        storyNumber += 1;
        canRunStory = true;
        canAdvanceStory = false;
      }
    });

  },

  update: function() {

    if (canPrintText) printText();

    //Opening plot sequence
    if (canRunStory) {
      if (storyNumber == -1) {
        canRunStory = false;
        //Fade in text 3 sec
        var tween01 = game.add.tween(shimmeringBackground).to({alpha: 0.5}, 1000, Phaser.Easing.Linear.None, true);
        var tween02 = game.add.tween(shimmeringBackground).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false, 0, -1, true);
        tween01.onComplete.add(function() {
          tween02.start();
        }, this);
        //Add texts to screen
        text1 = game.add.text(window.innerWidth*0.5, window.innerHeight*0.2, 'In a distant galaxy, peculiarly similar in many ways to our own.', { font: "bold 20px Arial", fill: "#fff" });
        game.stage.addChild(text1);
        text1.alpha = 0;
        text1.anchor.setTo(0.5, 0.5);
        text2 = game.add.text(window.innerWidth*0.5, window.innerHeight*0.3, 'One man is about to have his life changed forever.', { font: "bold 20px Arial", fill: "#fff" });
        game.stage.addChild(text2);
        text2.alpha = 0;
        text2.anchor.setTo(0.5, 0.5);
        text3 = game.add.text(window.innerWidth*0.5, window.innerHeight*0.4, 'His destiny leads him to the stars.', { font: "bold 20px Arial", fill: "#fff" });
        game.stage.addChild(text3);
        text3.alpha = 0;
        text3.anchor.setTo(0.5, 0.5);
        text4 = game.add.text(window.innerWidth*0.33, window.innerHeight*0.5, 'But right now, he\'s a delivery boy....', { font: "bold 20px Arial", fill: "#fff" });
        game.stage.addChild(text4);
        text4.alpha = 0;
        text4.anchor.setTo(0, 0.5);
        textString5 = 'and he\'s late.';

        // introGroup.addChild(text1);
        // introGroup.addChild(text2);
        // introGroup.addChild(text3);
        // introGroup.addChild(text4);

        var tween1 = game.add.tween(text1).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true, 3000)
        var tween2 = game.add.tween(text2).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, false, 3000);
        var tween3 = game.add.tween(text3).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, false, 3000);
        var tween4 = game.add.tween(text4).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, false, 3000);
        var tween5 = game.add.tween(text1).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, false, 2000);
        var tween6 = game.add.tween(text2).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, false, 2000);
        var tween7 = game.add.tween(text3).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, false, 2000);
        var tween8 = game.add.tween(text4).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, false, 2000);
        var tween9 = game.add.tween(shimmeringBackground).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, false, 4000);

        tween1.chain(tween2, tween3, tween4);
        var timer = game.time.create(true);
        tween4.onComplete.add(function() {
          timer.add(2000, function() {
            text4.text = text4.text.concat(textString5);
            tween5.start();
            tween6.start();
            tween7.start();
            tween8.start();
            tween9.start();
          }, this);
          timer.start();
        }, this);
        tween9.onComplete.add(function() {
          storyNumber += 1;
          canRunStory = true;
          tween02.stop();
        }, this);
      }
      else if (storyNumber == 0) {
        canRunStory = false;
        //Fade in world 3 sec
        var tween = game.add.tween(game.world).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true, 2000)
        tween.onComplete.add(function(){
          //Boss speaks
          setText('#ff3300', '...and this time, I want no more screw-ups!', 50, 'Boss: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 1) {
        canRunStory = false;
        //Fade out text 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          setText('#ff3300', "Get that package to Pluto, pronto!", 50, 'Boss: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 2) {
        canRunStory = false;
        // text.alpha = 1;
        //Fade out text 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          setText('#66ff66', "Yes, Boss..", 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 3) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Take off, slowly
        var tween2 = game.add.tween(player.body).to({x: planets[3].body.x + window.innerWidth*0.15}, 3000, Phaser.Easing.Linear.None);
        tween1.chain(tween2);
        tween1.onComplete.add(function() {
          player.animations.play('thrust');
          tween2.start();
        }, this); //Animate ship
        tween2.onComplete.add(function(){
          //Stop moving
          player.animations.play('idle');
          //Boss speaks
          setText('#ff3300', "Oh...and no more 'fuel stops' by the gambling ring on Saturn. You're late enough as it is!", 50, 'Boss: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 4) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          setText('#66ff66', 'But Boss, I told you I had to...', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 5) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          setText('#ff3300', 'JUST GET A MOVE ON!', 0, 'Boss: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 6) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          setText('#66ff66', '....sigh...', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 7) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Take off again, slowly
        var tween2 = game.add.tween(player.body).to({x: planets[3].body.x + window.innerWidth*0.3}, 4000, Phaser.Easing.Linear.None);
        tween1.chain(tween2);
        tween1.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween2.onComplete.add(function(){
          //Stop ship
          player.animations.play('idle');
          //H speaks
          setText('#66ff66', '....(mutter)..(grumble)...', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 8) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          setText('#ff3300', 'I heard THAT, there goes your monthly bonus! Now get off this planet before I launch you personally into the Sun. With my BOOT!', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 9) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None);
        //Fly out of screen right
        var tween2 = game.add.tween(player.body).to({x: planets[3].body.x + window.innerWidth*0.5 + player.width*0.5}, 2000, Phaser.Easing.Linear.None);
        //Fade out world 2 sec
        var tween3 = game.add.tween(game.world).to({alpha: 0}, 2000, Phaser.Easing.Linear.None);
        tween1.chain(tween2, tween3);
        tween1.start();
        tween1.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween2.onComplete.add(function() {player.animations.play('idle');}) //Stop ship
        //Fade in world 2 sec
        var tween4 = game.add.tween(game.world).to({alpha: 1}, 2000, Phaser.Easing.Linear.None);
        tween3.onComplete.add(function() {
          game.camera.x += window.innerWidth;
          game.camera.y -= 1; //Mysterious loss of 1 pixel in camera.y ???
          // player.x -= player.width;
          tween4.start();
        }, this);
        //Fly in from left
        var tween5 = game.add.tween(player.body).to({x: planets[3].x + window.innerWidth*0.6}, 2000, Phaser.Easing.Linear.None);
        tween4.chain(tween5);
        tween4.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween5.onComplete.add(function(){
          //Stop ship
          player.animations.play('idle');
          //H speaks
          setText('#66ff66', 'He never even pays us our monthly bonus...', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 10) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          setText('#66ff66', 'Anyway, time to get this stinking package to Pluto. Who\'s dumb enough to live all the way out there on that rock anyway? Ha! Some poor idiot..(chortle)', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 11) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        // var tween2 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, false, 3000);
        tween1.onComplete.add(function(){
          //H speaks
          setText('#66ff66', '....er, where exactly is Pluto again anyway? Never mind, how hard can it be to find it? Let\'s go!', 50, 'H: ');
          canPrintText = true;
        }, this);
      }
      else if (storyNumber == 12) {
        canRunStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Continue flying away
        var tween2 = game.add.tween(player.body).to({x: planets[3].body.x + window.innerWidth}, 4000, Phaser.Easing.Linear.None);
        tween1.chain(tween2);
        tween1.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween2.onComplete.add(function() {
          //Stop ship
          player.animations.play('idle');
          goToMain();
        }, this);
      }

      //Skip intro
      game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(skipToMain, this);
    }

  },

  render: function() {

    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.spriteInfo(player, 32, 500);
    // game.debug.spriteInfo(planets[3], 32, 500);

  }

};

function skipToMain() {
  //Fade out text
  var tween1 = game.add.tween(text).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  //Fade out world
  var tween2 = game.add.tween(game.world).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  tween2.onComplete.add(function() {
    // //Hide text
    // text.alpha = 0;
    //Continue to mainState
    goToMain();
  }, this);
  //Fade all intro group
  var tween3 = game.add.tween(shimmeringBackground).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  var tween4 = game.add.tween(text1).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  var tween5 = game.add.tween(text2).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  var tween6 = game.add.tween(text3).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  var tween7 = game.add.tween(text4).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  tween.onComplete.add(function() {
    goToMain();
  }, this);
}

function goToMain() {
  gameData[0] = player.x;
  gameData[1] = player.y;
  gameData[2] = player.angle;
  for (var i=0; i<9;i++) {
    gameData[3+(i*2)] = planets[i].x;
    gameData[4+(i*2)] = planets[i].y;
  }
  game.state.start('main');
}

function setText(color, string, delay, name) {
  text.text = ''; //Reset text to empty
  text.addColor(color, 0);
  textString = string;
  textDelay = delay;
  textTime = game.time.now + textDelay;
  textCount = 0;
  textName = name;
  // text.text += textName;
  text.alpha = 1;
}

function printText() {
  // textBox.alpha = 1;
  if (game.time.now > textTime && textCount < textString.length) {
    text.text = text.text.concat(textString.charAt(textCount));
    textTime += textDelay;
    textCount += 1;
  }
  if (textCount >= textString.length) {
    canPrintText = false;
    canAdvanceStory = true;
  }
}
