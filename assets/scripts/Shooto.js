

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

// Object Pools
var platforms;
var bulletPool;
var beamPool;
var asteroidPool;
var squarePool;
var spawnerPool;
var fuelPool;
var explosionPool;

var player;
var cursors;

var score = 0;
var scoreText;
var energyBar;
var hpBar;
var fuelBar;

var hud;
var foreground;
var midground;
var background;
var enemies;

var paused = false;

function preload() {
    
    game.add.plugin(Phaser.Plugin.Debug);

    //game.load.image('sky', 'assets/images/sky.png');
    //game.load.image('ground', 'assets/images/platform.png');
    game.load.image('asteroid11', 'assets/images/geomstyle/asteroid11.png');
    game.load.image('asteroid12', 'assets/images/geomstyle/asteroid12.png');
    game.load.image('asteroid13', 'assets/images/geomstyle/asteroid13.png');
    game.load.image('asteroid14', 'assets/images/geomstyle/asteroid14.png');

    game.load.image('asteroid21', 'assets/images/geomstyle/asteroid21.png');
    game.load.image('asteroid22', 'assets/images/geomstyle/asteroid22.png');
    game.load.image('asteroid23', 'assets/images/geomstyle/asteroid23.png');
    game.load.image('asteroid24', 'assets/images/geomstyle/asteroid24.png');

    game.load.image('asteroid31', 'assets/images/geomstyle/asteroid31.png');
    game.load.image('asteroid32', 'assets/images/geomstyle/asteroid32.png');
    game.load.image('asteroid33', 'assets/images/geomstyle/asteroid33.png');
    game.load.image('asteroid34', 'assets/images/geomstyle/asteroid34.png');
    //game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);

    game.load.image('turret1', 'assets/images/geomstyle/turret1.png');
    game.load.image('turret2', 'assets/images/geomstyle/turret2.png');
    game.load.image('turret3', 'assets/images/geomstyle/turret3.png');
    game.load.image('ship', 'assets/images/geomstyle/ship.png');
    game.load.image('bullet', 'assets/images/bullet.png');

    game.load.image('barbg', 'assets/images/barbg.png');
    game.load.image('energybar', 'assets/images/energybar.png');
    game.load.image('hpbar', 'assets/images/hpbar.png');
    game.load.image('fuelbar', 'assets/images/fuelbar.png');
    game.load.image('hpbarDiff', 'assets/images/hpbarDiff.png');
    game.load.image('fuelbarDiff', 'assets/images/fuelbarDiff.png');

    //game.load.image('beam', 'assets/images/beam.png');
    game.load.spritesheet('beam2', 'assets/images/beam2.png', 512, 128, 11);
    //game.load.image('beam3', 'assets/images/beam3.png');

    //game.load.spritesheet('beamStart', 'assets/images/beam5start.png', 75, 128, 11);
    //game.load.spritesheet('beamMid', 'assets/images/beam5mid.png', 1, 128, 11);
    //game.load.spritesheet('beamEnd', 'assets/images/beam5end.png', 75, 128, 11);

    //game.load.image('fuel', 'assets/images/fuelfull.png');
    game.load.image('fuelGlob', 'assets/images/fuelGlob.png');
    game.load.image('dot', 'assets/images/dot.png');
    game.load.image('speck', 'assets/images/speck.png');
    game.load.image('square', 'assets/images/geomstyle/square.png');
    game.load.image('blackhole', 'assets/images/blackhole.png');
    
    game.load.image('empty', 'assets/images/empty.png');
}

function create() {
    this.game.forceSingleUpdate = true
    //this.game.time.advancedTiming = true;

    // enable Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0;
    
    // Groups
    background = game.add.group(game.world, 'Background');
    midground = game.add.group(game.world, 'Midground');
    foreground = game.add.group(game.world, 'Foreground');
    hud = game.add.group(game.world, 'HUD');

    // Background
    SetupBackground();

    // HUD
    SetupHUD();
    
    
    // bullets group
    bulletPool = new Pool(game, Bullet, 6, 'bullets');
    bulletPool.enableBody = true;
    
    // beam group
    beamPool = new Pool(game, Beam, 3, 'beams');

    // fuel pool
    fuelPool = new Pool(game, Fuel, 4, 'fuels');

    // Explosion pool
    explosionPool = new Pool(game, Explosion, 10, 'explosions');
    
    // Enemies
    SetupEnemies();
    
    // The player
    friendlies = game.add.group(game.world, "Friendlies");
    player = new Player(game, game.world.width / 2, game.world.height / 2);
    friendlies.add(player);

    // Enemies
    EnemyStart();


    if (debugging) {
        DebugCreate();
    }
}


function update() {
    //game.physics.arcade.collide(stars, platforms);
    UpdateHUD();

    if (!paused) {
        EnemyManagerUpdate();
    }
}

function PauseGame() {
    this.game.physics.arcade.isPaused = true
    paused = true;
}

function UnpauseGame() {
    this.game.physics.arcade.isPaused = false;
    paused = false;
}

function SetupBackground() {
    //background.add.sprite(0, 0, 'sky');
    game.stage.backgroundColor = 0x111111
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

function render() {


    /*
    game.debug.text("bullets: " + bulletPool.children.length, 100, 380 );
    game.debug.text("stars: " + asteroidPool.children.length, 100, 400 );
    game.debug.text("fps: " + this.game.time.fps, 100, 360);
    */

    //game.debug.text("Energy: " + Math.round(player.energy), 100, 60);
    //game.debug.text("Charge: " + Math.round(player.chargeShotExponential * 100) / 100, 100, 80);
    //game.debug.text("HP: " + player.health, 100, 100);
    //game.debug.body(player);

    /*
    if (debugPos != null) {
        //console.log(debugPos);
        var circle = new Phaser.Circle(debugPos.x, debugPos.y, 10);
        game.debug.geom(circle, 'rgba(0,255,0,1)');
    }
    */
    
    //somelines.forEach(function(line) {
    //        game.debug.geom(line, 'rgba(255,0,0,1)' ) ;
    //}, this);
    //game.debug.geom(beamRay, 'rgba(255,0,0,1)' ) ;
    //game.debug.text("physicsElapsed: " + this.game.time.physicsElapsed, 100, 60);
    /*
    asteroidPool.forEachAlive(function(o) {
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
    //game.debug.text("emitters: " + explosionPool.children.length, 100, 380);

    /*
    asteroidPool.forEachAlive(function(o) {
        //var circle = new Phaser.Circle(o.x, o.y, (o.radius + player.chargeShotExponential * 30) *2 );
        //game.debug.geom(circle, '#cfffff', false);
        game.debug.body(o);
    }, this);
    */
}