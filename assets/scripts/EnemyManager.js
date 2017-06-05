

spawnTimers = [];

function SetupEnemies() {
    enemies = game.add.group(game.world, "Enemies");
    midground.add(enemies);
}

function EnemyStart() {
    
    SetupPlatforms();
    SetupSpawners();
    SetupAsteroids();
    SetupSquares();
    SetupShooters();

    SetupTimers();
}

function SetupSpawners() {
    spawnerPool = new Pool(game, Spawner, 4, 'spawners');
}

function SetupAsteroids() {
    asteroidPool = new Pool(game, Asteroid, 20, 'asteroids', enemies);
    asteroidPool.enableBody = true;
}

function SetupSquares() {
    squarePool = new Pool(game, Square, 3, 'squares', enemies);
    squarePool.enableBody = true;
}

function SetupShooters() {
    shooterPool = new Pool(game, Shooter, 1, 'shooters', enemies);
    shooterPool.enableBody = true;
}

function SetupTimers() {
    //AddTimer(4, SpawnSquare);
    //AddTimer(10, SpawnAsteroid);
    //SpawnAsteroid();
    SpawnShooter();
}


function SetupPlatforms() {
    // Platforms group (ground and 2 ledges)
    //platforms = game.add.group();

    // Enable physics for all objects in playforms group
    //platforms.enableBody = true;
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

function SpawnAsteroid() {
    spawnerPool.create(Math.random() * game.width, Math.random() * game.height, {pool: asteroidPool, data: {
        tier: 1,
        x: Math.random() * 200 - 100, 
        y: Math.random() * 200 - 100
    }});
}


function SpawnSquare() {
    squarePool.create(800, Math.random() * 600, {speed: 200});
}

function SpawnShooter() {
    shooterPool.create(700, Math.random() * 600, {speed: 100});
}

function EnemyManagerUpdate() {
    CheckTimers();
    //CheckEnemyCollisions();
}

function AddTimer(time, funct) {
    var newTimer = {
        currentTime: 0,
        triggerTime: time,
        fire: funct
    };
    spawnTimers.push(newTimer);
}

function CheckTimers() {
    spawnTimers.forEach(function(t) {
        t.currentTime += game.time.physicsElapsed;
        if (t.currentTime > t.triggerTime) {
            t.currentTime -= t.triggerTime;
            t.fire();
        }
    }, this);
}

function CheckEnemyCollisions() {
    // Collisions between the enemies and other things
    
}