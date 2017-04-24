

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

var platforms;
var bulletPool;
var beamPool;
var cursors;
var starPool;
var score = 0;
var scoreText;


function preload() {
    
    //game.load.image('sky', 'assets/images/sky.png');
    //game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    //game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);

    game.load.image('ship', 'assets/images/shipsmall.png');
    game.load.image('bullet', 'assets/images/bullet.png');
    game.load.image('beam', 'assets/images/beam.png');
    game.load.image('dot', 'assets/images/dot.png');
}

function create() {
    this.game.forceSingleUpdate = true
    this.game.time.advancedTiming = true;
    // enable Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Background
    //game.add.sprite(0, 0, 'sky');
    this.game.stage.backgroundColor = 0x333333

    // The player
    player = new Player(game, game.world.width / 2, game.world.height / 2);
    
    SetupPlatforms();

    // bullets group
    bulletPool = new Pool(game, Bullet, 2, 'bullets');
    bulletPool.enableBody = true;

    // beam group
    beamPool = new Pool(game, Beam, 2, 'beams');
    //beamPool.enableBody = true;

    SetupStars();

    // Set up score text
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function SetupPlatforms() {
    // Platforms group (ground and 2 ledges)
    platforms = game.add.group();

    // Enable physics for all objects in playforms group
    platforms.enableBody = true;
    /*
    // Ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    // Scale it to fit the width (original sprite is 400x32)
    ground.scale.setTo(2, 2);

    ground.body.immovable = true;

    // 2 ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    */
}

function SetupStars() {
     // Create 12 stars evenly spaced apart
    starPool = new Pool(game, Star, 10, 'stars');
    starPool.enableBody = true;

    game.time.events.loop(400, SpawnStar, this);
}

function SpawnStar() {
    var star = starPool.create(800, Math.random() * 600, 300);
}

function update() {
    // Collisions between stars and platforms
    //game.physics.arcade.collide(stars, platforms);
    //game.physics.arcade.overlap(player, starPool, HitStar, null, this);
}

function HitStar (player, star) {
    player.reset(game.world.width / 2, game.world.height / 2)

    // Update score
    score = 0;
    scoreText.text = 'Score: ' + score;
}


function render() {
    /*
    game.debug.text("bullets: " + bulletPool.children.length, 100, 380 );
    game.debug.text("stars: " + starPool.children.length, 100, 400 );
    game.debug.text("fps: " + this.game.time.fps, 100, 360);
    */

    game.debug.text("Charge: " + player.chargeShotExponential, 100, 80);

    //game.debug.geom(beamRay, 'rgba(255,0,0,1)' ) ;
    //game.debug.text("physicsElapsed: " + this.game.time.physicsElapsed, 100, 60);
    /*
    starPool.forEachAlive(function(o) {
        // Create an array of lines that represent the four edges of each wall
        var lines = [
            new Phaser.Line(o.x - o.width / 2, o.y - o.height / 2,
                            o.x + o.width / 2, o.y - o.height / 2),
            new Phaser.Line(o.x - o.width / 2, o.y - o.height / 2,
                            o.x - o.width / 2, o.y + o.height / 2),
            new Phaser.Line(o.x + o.width / 2, o.y - o.height / 2,
                            o.x + o.width / 2, o.y + o.height / 2),
            new Phaser.Line(o.x - o.width / 2, o.y + o.height / 2,
                            o.x + o.width / 2, o.y + o.height / 2)
        ];

        lines.forEach(function(line) {
            game.debug.geom(line, 'rgba(255,0,0,1)' ) ;
        }, this);
    }, this);
    */
}