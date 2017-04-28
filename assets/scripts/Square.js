

Square.prototype = Object.create(Enemy.prototype);
Square.prototype.constructor = Square;

function Square (game) {
    Enemy.call(this, game, 'square');

    this.maxHealth = 200;
    this.health = this.maxHealth;
    this.hitDamage = 20;
}

Square.prototype.Spawn = function(x, y, data) {
    Enemy.prototype.Spawn.call(this, x, y, data);

    this.speed = data;
    this.rotation = Math.random() * Phaser.Math.PI2;
    this.rotSpeed = Math.random() * 4 - 2;
    this.body.velocity.x = -this.speed;
    
    return this;
}

Square.prototype.update = function() {
    if (this.alive) {
        Enemy.prototype.update.call(this);

        // move towards player

        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;
        this.CheckBounds();
    }
}

Square.prototype.Explode = function(bullet, platform) {

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

    score += 4;
    scoreText.text = 'Score: ' + score;

    this.kill();
}