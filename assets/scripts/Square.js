

Square.prototype = Object.create(Enemy.prototype);
Square.prototype.constructor = Square;

function Square (game) {
    Enemy.call(this, game, 'square');

    this.maxHealth = 50;
    this.health = this.maxHealth;
    this.hitDamage = 20;
    this.maxSpeed = 200;
    this.acceleration = 5;
}

// data: {speed}
Square.prototype.Spawn = function(x, y, data) {
    if (data.speed == null) data.speed = 200;
    
    Enemy.prototype.Spawn.call(this, x, y, data);

    this.speed = data.speed;
    this.rotation = Math.random() * Phaser.Math.PI2;
    this.rotSpeed = Math.random() * 4 - 2;
    this.body.velocity.x = -this.speed;
    this.target = player;
    return this;
}

Square.prototype.update = function() {
    if (this.alive) {
        Enemy.prototype.update.call(this);

        // move towards player

        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;
        this.CheckBounds();

        this.Movement();
    }
}

Square.prototype.Movement = TurnTowardsTarget;

Square.prototype.Explode = function(bullet, platform) {
    
    explosionPool.create(this.x, this.y);

    score += 4;
    scoreText.text = 'Score: ' + score;

    this.kill();
}