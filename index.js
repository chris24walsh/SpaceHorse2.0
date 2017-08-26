//Create game singleton object
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'Space Horse');

var saveData = new Array();

//Add game states (preloaded in index.html) to game object
game.state.add('main', mainState);
game.state.add('intro', introState);
game.state.add('gameOver', gameOverState);

//Start game in mainState
game.state.start('main');
