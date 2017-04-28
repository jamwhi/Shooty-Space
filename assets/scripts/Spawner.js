

Spawner.prototype = Object.create(Phaser.Sprite.prototype);
Spawner.prototype.constructor = Spawner;

function Spawner (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'blackhole');

    this.game = game;
    this.exists = false;
    this.alive = false;
    this.radius = this.width * 0.5;
    this.anchor.setTo(0.5);


    this.spawnTime = 2;
    this.popInTime = 1.5;
    this.popOutTime = 0.2;

    
    this.initialValues();
}

Spawner.prototype.initialValues = function() {
    this.spawnTimer = 0;
    this.spawned = false;
    this.spawnPool = null;
    this.spawnData = null;
    this.scale.setTo(0);
}

Spawner.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.initialValues();
}

Spawner.prototype.Spawn = function(x, y, data) {
    this.stdReset(x, y);
    this.rotSpeed = 0.5;
    this.spawnPool = data.pool;
    this.spawnData = data.data;

    return this;
}

Spawner.prototype.SpawnEnemy = function() {
    this.spawnPool.create(this.x, this.y, this.spawnData);
    this.spawned = true;
}

Spawner.prototype.update = function() {
    if (this.alive) {
        this.spawnTimer += this.game.time.physicsElapsed;
        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;

        if (this.spawned) {
            this.LeavingAnimation();

        } else {
            this.IncomingAnimation();

            // Spawner
            if (this.spawnTimer > this.spawnTime) {
                this.SpawnEnemy();
            }
        }
    }
}

Spawner.prototype.IncomingAnimation = function() {
    if (this.spawnTimer < this.popInTime) {
        var t = this.spawnTimer / this.popInTime;
        t = t * t * t * t;
        this.scale.setTo(t);
    }
}

Spawner.prototype.LeavingAnimation = function() {
    var t = 1 - ((this.spawnTimer - this.spawnTime) / this.popOutTime);
    t = t * t;
    this.scale.setTo(t);

    if (this.spawnTimer > this.spawnTime + this.popOutTime) {
        this.Explode();
    }
}

Spawner.prototype.Explode = function() {
    this.kill();
}