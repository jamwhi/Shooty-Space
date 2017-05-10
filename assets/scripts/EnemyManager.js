

spawnTimers = [];

function EnemyStart() {
    enemies = game.add.group();
    midground.add(enemies);
    
    SetupPlatforms();
    SetupSpawners();
    SetupAsteroids();
    SetupSquares();
}

function SetupSpawners() {
    spawnerPool = new Pool(game, Spawner, 4, 'spawners');
}

function SetupAsteroids() {
    asteroidPool = new Pool(game, Asteroid, 100, 'asteroids', enemies);
    asteroidPool.enableBody = true;

    AddTimer(10, SpawnAsteroid);
    SpawnAsteroid();
}

function SetupSquares() {
    squarePool = new Pool(game, Square, 5, 'squares', enemies);
    squarePool.enableBody = true;

    AddTimer(4, SpawnSquare);
}

function SpawnAsteroid() {
    spawnerPool.create(Math.random() * game.width, Math.random() * game.height, {pool: asteroidPool, data: {
        tier: 1,
        x: Math.random() * 200 - 100, 
        y: Math.random() * 200 - 100
    }});
    //asteroidPool.create(Math.random() * game.width, Math.random() * game.height, {x: Math.random() * 200 - 100, y: Math.random() * 200 - 100});
}

function SpawnSquare() {
    squarePool.create(800, Math.random() * 600, 200);
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

function EnemyManagerUpdate() {
    CheckTimers();
    //CheckEnemyCollisions();
}

function AddTimer(t, f) {
    var newTimer = {
        currentTime: 0,
        triggerTime: t,
        fire: f
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