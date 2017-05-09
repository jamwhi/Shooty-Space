

Asteroid.prototype = Object.create(Enemy.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid (game) {
    this.spriteString = 'asteroid' + Math.floor((Math.random() * 4) + 1); // random between 1 and 4 (inclusive)
    Enemy.call(this, game, this.spriteString);

    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.hitDamage = 20;

    this.fuelSpawnChance = 0.1;
    this.fuelMinTier = 2;
}

Asteroid.prototype.Spawn = function(x, y, data) {
    Enemy.prototype.Spawn.call(this, x, y, data);

    this.tier = data.tier;
    this.scale.setTo(1 / this.tier);
    this.maxHealth = 100 / this.tier;
    this.health = this.maxHealth;

    this.radius = this.width * 0.5;
    this.rotation = Math.random() * Phaser.Math.PI2;
    this.rotSpeed = Math.random() * 4 - 2;
    this.body.velocity.x = data.x;
    this.body.velocity.y = data.y;
    
    return this;
}

Asteroid.prototype.update = function() {
    if (this.alive) {
        Enemy.prototype.update.call(this);

        //game.physics.arcade.overlap(this, platforms, this.Explode, null, this);
        //game.physics.arcade.overlap(this, stars, this.HitAsteroid, null, this);
        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;
        //this.CheckBounds();
    }
}

Asteroid.prototype.Explode = function(bullet, platform) {

    var emitter = foreground.add(new Phaser.Particles.Arcade.Emitter(game, this.x, this.y, 10));
    emitter.makeParticles('dot');
    emitter.x = this.x;
    emitter.y = this.y;
    emitter.setAlpha(0.8, 1, 3000);
    emitter.setScale(1, 0.1, 1, 0.1, 2000, Phaser.Easing.Quadratic.Out);

    emitter.start(true, 2000, null, 10);

    emitter.forEach(function(particle) {
        particle.body.allowGravity = false;
    }, this);

    score += 1;
    scoreText.text = 'Score: ' + score;

    if (this.tier < 3) {
        for (var i = 0; i < 3; i++) {
            asteroidPool.create(this.x, this.y, {
                tier: 3,
                x: Math.random() * 200 - 100, 
                y: Math.random() * 200 - 100
            });
        }
        
    }

    this.kill();
}