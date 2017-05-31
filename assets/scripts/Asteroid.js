

Asteroid.prototype = Object.create(Enemy.prototype);
Asteroid.prototype.constructor = Asteroid;

function Asteroid (game) {
    this.spriteString = 'asteroid1' + Math.floor((Math.random() * 4) + 1); // random between 1 and 4 (inclusive)
    Enemy.call(this, game, this.spriteString);

    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.hitDamage = 20;

    this.fuelSpawnChance = 0.2;
    this.fuelMinTier = 2;
}

// data: {tier, x, y} 
Asteroid.prototype.Spawn = function(x, y, data) {
    if (data.tier == null) data.tier = 1;
    if (data.x == null) data.x = 0;
    if (data.y == null) data.y = 0;

    Enemy.prototype.Spawn.call(this, x, y, data);

    //  1  2  3  4  5
    //  1  2  4  8  16
    this.tier = data.tier;
    this.spriteString = this.spriteString = 'asteroid' + this.tier + Math.floor((Math.random() * 4) + 1); // random between 1 and 4 (inclusive)
    this.loadTexture(this.spriteString);
    this.body.setSize(this.width, this.height);
    this.radius = this.width * 0.5;

    //this.scale.setTo(1 / Math.pow(2, this.tier-1));
    this.maxHealth = 100 / this.tier;

    this.health = this.maxHealth;

    this.rotation = Math.random() * Phaser.Math.PI2;
    this.body.angularVelocity = Math.random() * 200 - 100;
    this.body.velocity.x = data.x;
    this.body.velocity.y = data.y;
    
    return this;
}

Asteroid.prototype.Explode = function(bullet, platform) {

    explosionPool.create(this.x, this.y);

    score += 1;
    scoreText.text = 'Score: ' + score;

    if (this.tier < 3) {
        for (var i = 0; i < this.tier + 1; i++) {
            asteroidPool.create(this.x, this.y, {
                tier: this.tier + 1,
                x: Math.random() * 200 - 100, 
                y: Math.random() * 200 - 100
            });
        }
    }

    if (this.tier <= this.fuelMinTier) {
        if (Math.random() < this.fuelSpawnChance) {
            fuelPool.create(this.x, this.y, {});
        }
    }

    this.kill();
}