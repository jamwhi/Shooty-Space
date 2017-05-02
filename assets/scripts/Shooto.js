

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

// Object Pools
var platforms;
var bulletPool;
var beamPool;
var starPool;
var squarePool;
var spawnerPool;
var fuelPool;

var cursors;
var score = 0;
var scoreText;
var energyBar;
var hpBar;
var player;

var hud;
var foreground;
var midground;
var background;

function preload() {
    
    //game.load.image('sky', 'assets/images/sky.png');
    //game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    //game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);

    game.load.image('ship', 'assets/images/shipsmall.png');
    game.load.image('barbg', 'assets/images/barbg.png');
    game.load.image('energybar', 'assets/images/energybar.png');
    game.load.image('hpbar', 'assets/images/hpbar.png');
    game.load.image('bullet', 'assets/images/bullet.png');
    game.load.image('beam', 'assets/images/beam.png');
    //game.load.spritesheet('beam2', 'assets/images/beam2.png', 441, 128, 11);
    game.load.image('beam3', 'assets/images/beam3.png');
    game.load.image('fuel', 'assets/images/fuel.png');
    game.load.image('dot', 'assets/images/dot.png');
    game.load.image('speck', 'assets/images/speck.png');
    game.load.image('square', 'assets/images/square.png');
    game.load.image('blackhole', 'assets/images/blackhole.png');
}

function create() {
    this.game.forceSingleUpdate = true
    //this.game.time.advancedTiming = true;

    // enable Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0;
    
    // Groups
    background = game.add.group();
    midground = game.add.group();
    foreground = game.add.group();
    hud = game.add.group();

    // Background
    SetupBackground();

    // HUD
    SetupHUD();

    // The player
    player = new Player(game, game.world.width / 2, game.world.height / 2);
    
    // bullets group
    bulletPool = new Pool(game, Bullet, 6, 'bullets');
    bulletPool.enableBody = true;
    
    // beam group
    beamPool = new Pool(game, Beam, 6, 'beams');

    // fuel pool
    fuelPool = new Pool(game, Fuel, 3, 'fuels');
    fuelPool.create(100, 100, {});

    // Enemies
    EnemyStart();
}


function update() {
    //game.physics.arcade.collide(stars, platforms);
    UpdateHUD();
    EnemyManagerUpdate();
}

function SetupBackground() {
    //background.add.sprite(0, 0, 'sky');
    game.stage.backgroundColor = 0x333333
    var bgEmitter = background.add(new Phaser.Particles.Arcade.Emitter(game, game.width / 2, game.height / 2, 250));
    bgEmitter.makeParticles('speck');

    bgEmitter.minParticleSpeed.setTo(-3, -3);
    bgEmitter.maxParticleSpeed.setTo(3, 3);
    bgEmitter.width = game.width;
    bgEmitter.height = game.height;
    bgEmitter.start(true, 0, 0, 250);
    bgEmitter.start(false, 0, 1);

    bgEmitter.forEach(function(particle) {
        particle.body.allowGravity = false;
        particle.checkWorldBounds = true;     
        particle.outOfBoundsKill = true;
    }, this);
}

function SetupHUD() {
    
    scoreText = hud.add(new Phaser.Text(game, 16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }));
    hud.add(new Phaser.Sprite(game, 19, 59, 'barbg'));
    hud.add(new Phaser.Sprite(game, 19, 74, 'barbg'));
    hpBar = hud.add(new Phaser.Sprite(game, 20, 60, 'hpbar'));
    energyBar = hud.add(new Phaser.Sprite(game, 20, 75, 'energybar'));
}

function UpdateHUD() {
    hpBar.scale.x = player.health / player.healthMax;
    energyBar.scale.x = player.energy / player.energyMax;
}

function render() {
    /*
    game.debug.text("bullets: " + bulletPool.children.length, 100, 380 );
    game.debug.text("stars: " + starPool.children.length, 100, 400 );
    game.debug.text("fps: " + this.game.time.fps, 100, 360);
    */

    //game.debug.text("Energy: " + Math.round(player.energy), 100, 60);
    //game.debug.text("Charge: " + Math.round(player.chargeShotExponential * 100) / 100, 100, 80);
    //game.debug.text("HP: " + player.health, 100, 100);
    //game.debug.body(player);

    //game.debug.geom(closePoint, 'rgba(255,0,0,1)');
    //somelines.forEach(function(line) {
    //        game.debug.geom(line, 'rgba(255,0,0,1)' ) ;
    //}, this);
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

    /*starPool.forEachAlive(function(o) {
        var circle = new Phaser.Circle(o.x, o.y, (o.radius + player.chargeShotExponential * 30) *2 );
        game.debug.geom(circle, '#cfffff', false);
    }, this);*/
}