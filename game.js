var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameDiv');
var spacefield;
var backgroundv;
var cursors;
var bullets;
var bulletTime;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var winText;


var mainState = {
  preload: function(){
    game.load.image("starfield", "assets/starfield.png");
    game.load.image("player", "assets/player.png");
    game.load.image("bullet", "assets/bullet.png");
    game.load.image("enemy", "assets/enemy_2.png");
  },

  create: function(){
    spacefield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    backgroundv = 3;

    player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    bulletTime = 0;
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();

    scoreText = game.add.text(0,550, 'Score', {font: '32px Arial', fill: '#fff'});
    winText = game.add.text(game.world.centerX, game.world.centerY, "You win!", {font: '32px Arial', fill: '#fff'});
    winText.visible = false;
  },

  update: function(){

    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);

    spacefield.tilePosition.y += backgroundv;

    player.body.velocity.x = 0;
    if(cursors.left.isDown){
      player.body.velocity.x = -350;
    }
    if(cursors.right.isDown){
      player.body.velocity.x = 350;
    }

    if(fireButton.isDown){
      fireBullet();
    }

    scoreText.text = 'Score:' + score;
    if(score == 4000){
      winText.visible = true;
      scoreText.visible = false;
    }
  }
}

function fireBullet() {
  if(game.time.now > bulletTime){
    bullet = bullets.getFirstExists(false);
    if(bullet){
      bullet.reset(player.x, player.y);
      bullet.scale.setTo(0.5, 0.5);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now + 200;
    }
  }
}

function createEnemies() {
  for(var i=0; i<4; i++){
    for(var j=0; j<10;j++){
      var enemy = enemies.create(j*50 + 50, i*50 + 50, "enemy");
      enemy.scale.setTo(0.1, 0.1);
      enemy.anchor.setTo(0.5, 0.5);
    }
  }

  //var tween = game.add.tween(enemies).to({x:300}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  var tween = game.add.tween(enemies).to({x:250}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  tween.onLoop.add(descend, this);
}

function descend() {
  enemies.y += 50;
}

function collisionHandler(bullet, enemy) {
  bullet.kill();
  enemy.kill();

  score += 100;
}

game.state.add('mainState', mainState);
game.state.start('mainState');
