

spawnTimers = [];

function EnemyStart() {
    SetupPlatforms();
    SetupSpawners();
    SetupStars();
    SetupSquares();
}

function SetupSpawners() {
    spawnerPool = new Pool(game, Spawner, 4, 'spawners');
}

function SetupStars() {
    starPool = new Pool(game, Star, 10, 'stars');
    starPool.enableBody = true;

    //game.time.events.loop(1000, SpawnStar, this);
    AddTimer(1, SpawnStar);
    //SpawnStar();
}

function SetupSquares() {
    squarePool = new Pool(game, Square, 5, 'squares');
    squarePool.enableBody = true;

    //game.time.events.loop(3000, SpawnSquare, this);
    AddTimer(3, SpawnSquare);
}

function SpawnStar() {
    spawnerPool.create(Math.random() * game.width, Math.random() * game.height, {pool: starPool, data: {x: Math.random() * 200 - 100, y: Math.random() * 200 - 100}})
    //starPool.create(Math.random() * game.width, Math.random() * game.height, {x: Math.random() * 200 - 100, y: Math.random() * 200 - 100});
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
    // Collisions between the player and enemies
    game.physics.arcade.overlap(player, starPool, HitEnemy, null, this);
    game.physics.arcade.overlap(player, squarePool, HitEnemy, null, this);
}

function HitEnemy (player, enemy) {
    enemy.Hit(100);
    player.Hit(enemy.hitDamage);
}