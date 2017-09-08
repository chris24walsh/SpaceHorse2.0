var timeDelay = 0;
var textCount = 0;
// var canTriggerText = false;
var story;
var runStory;
var advanceStory;

var introState = {

  preload: function() {

    game.load.image('background', 'assets/images/backgroundSprite.png');
    game.load.spritesheet('player', 'assets/images/shipSpriteSheet1.png', 100, 100);
    for (var i=0; i<9; i++) game.load.image("planet" + i, "assets/images/planet" + i + ".png");
    game.load.image('textbox', 'assets/images/textbox.png');

  },

  create: function() {

    game.add.tileSprite(0, 0, 1000000, 1000000, 'background');

    game.world.setBounds(0, 0, 1000000, 1000000);

    game.physics.startSystem(Phaser.Physics.P2JS);

    //Stop music
    if (music) music.fadeOut(1000);

    // game.physics.startSystem(Phaser.Physics.P2JS);

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
        // planets[i].anchor.set(0.5, 0.5);
      }
      // planets[3].pivot.x = 200;
    }

    //Focus camera on earth
    game.camera.x = planets[3].x - window.innerWidth/2;
    game.camera.y = planets[3].y - window.innerHeight/2 + planets[3].height/2;

    //Create player near earth
    player = game.add.sprite(planets[3].x, planets[3].y, 'player');
    player.angle = 90;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.x += player.width*1.5;
    player.y += planets[3].height/2;

    //  Our player animations, walking left, right, up and down.
    player.animations.add('idle', [0], 10, true);
		player.animations.add('thrust', [1, 2], 10, true);

    //Make text object
    text = game.add.text(window.innerWidth*0.3, window.innerHeight*0.2, '', { font: "bold 25px Arial", fill: "#fff" });
    game.stage.addChild(text);
    text.alpha = 0;
    text.wordWrap = true;
    text.wordWrapWidth = window.innerWidth*0.4;

    story = 0;
    runStory = true;
    displayTextTrue = false;
    timeDelay = 0;
    textCount = 0;

    //Toggle dialog
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function () {
      if (advanceStory) {
        story += 1;
        runStory = true;
        advanceStory = false;
      }
    });

  },

  update: function() {

    if (displayTextTrue) displayText();

    //Opening plot sequence
    if (runStory) {
      if (story == 0) {
        runStory = false;
        //Fade in world 3 sec
        game.world.alpha = 0;
        var tween = game.add.tween(game.world).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true)
        tween.onComplete.add(function(){
          //Boss speaks
          text.addColor('#ff3300', 0);
          text.alpha = 1;
          textString = 'Boss: ...and this time, I want no more screw-ups!';
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 1) {
        runStory = false;
        //Fade out text 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          text.addColor('#ff3300', 0);
          textString = "Boss: Get that package to Pluto, pronto!";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 2) {
        runStory = false;
        // text.alpha = 1;
        //Fade out text 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: Yes, Boss..";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 3) {
        runStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Take off, slowly
        var tween2 = game.add.tween(player).to({x: planets[3].x + window.innerWidth*0.15}, 3000, Phaser.Easing.Linear.None);
        tween1.chain(tween2);
        tween1.onComplete.add(function() {player.animations.play('thrust');}); //Animate ship
        tween2.onComplete.add(function(){
          //Stop moving
          player.animations.play('idle');
          //Boss speaks
          text.addColor('#ff3300', 0);
          textString = "Boss: Oh...and no more 'fuel stops' by the gambling ring on Saturn. You're late enough as it is!";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 4) {
        runStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: But Boss, I told you I had to...";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 5) {
        runStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          text.addColor('#ff3300', 0);
          textString = "Boss: JUST GET A MOVE ON!";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 6) {
        runStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: ....sigh...";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 7) {
        runStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Take off again, slowly
        var tween2 = game.add.tween(player).to({x: planets[3].x + window.innerWidth*0.3}, 4000, Phaser.Easing.Linear.None);
        tween1.chain(tween2);
        tween1.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween2.onComplete.add(function(){
          //Stop ship
          player.animations.play('idle');
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: ....(mutter)..(grumble)...";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 8) {
        runStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //Boss speaks
          text.addColor('#ff3300', 0);
          textString = "Boss: I heard THAT, there goes your monthly bonus! Now get off this planet before I launch you personally into the Sun. With my BOOT!";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 9) {
        runStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None);
        //Fly out of screen right
        var tween2 = game.add.tween(player).to({x: planets[3].x + window.innerWidth*0.5 + player.width*0.5}, 2000, Phaser.Easing.Linear.None);
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
        var tween5 = game.add.tween(player).to({x: planets[3].x + window.innerWidth*0.6}, 2000, Phaser.Easing.Linear.None);
        tween4.chain(tween5);
        tween4.onComplete.add(function() {player.animations.play('thrust');}) //Animate ship
        tween5.onComplete.add(function(){
          //Stop ship
          player.animations.play('idle');
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: He never even pays us our monthly bonus...";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 10) {
        runStory = false;
        //Fade out 0.5 sec
        var tween = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: Anyway, time to get this stinking package to Pluto. Who's dumb enough to live all the way out there on that rock anyway? Ha! Some poor idiot..(chortle)";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 11) {
        runStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        // var tween2 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, false, 3000);
        tween1.onComplete.add(function(){
          //H speaks
          text.addColor('#66ff66', 0);
          textString = "H: ....er, where exactly is Pluto again anyway? Never mind, how hard can it be to find it? Let's go!";
          text.alpha = 1;
          text.text = '';
          displayTextTrue = true;
          timeDelay = game.time.now + 50;
          textCount = 0;
          advanceStory = true;
        }, this);
      }
      else if (story == 12) {
        runStory = false;
        //Fade out 0.5 sec
        var tween1 = game.add.tween(text).to({alpha: 0}, 350, Phaser.Easing.Linear.None, true);
        //Continue flying away
        var tween2 = game.add.tween(player).to({x: planets[3].x + window.innerWidth}, 4000, Phaser.Easing.Linear.None);
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
  var tween1 = game.add.tween(text).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true)
  //Fade out of current cutscene
  var tween2 = game.add.tween(game.world).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
  tween2.onComplete.add(function() {
    //Hide text
    text.alpha = 0;
    //World alpha to 1
    // game.world.alpha = 1;
    //Continue to mainState
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

function displayText() {
  if (game.time.now > timeDelay && textCount < textString.length) {
    text.text = text.text.concat(textString.charAt(textCount));
    timeDelay += 50;
    textCount += 1;
  }
}
