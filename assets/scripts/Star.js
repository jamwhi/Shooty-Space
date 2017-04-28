

Star.prototype = Object.create(Enemy.prototype);
Star.prototype.constructor = Star;

function Star (game) {
    Enemy.call(this, game, 'star');

    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.hitDamage = 20;
}

Star.prototype.Spawn = function(x, y, data) {
    Enemy.prototype.Spawn.call(this, x, y, data);

    this.speed = data;
    this.rotation = Math.random() * Phaser.Math.PI2;
    this.rotSpeed = Math.random() * 4 - 2;
    this.body.velocity.x = data.x;
    this.body.velocity.y = data.y;
    
    return this;
}

Star.prototype.update = function() {
    if (this.alive) {
        Enemy.prototype.update.call(this);

        //game.physics.arcade.overlap(this, platforms, this.Explode, null, this);
        //game.physics.arcade.overlap(this, stars, this.HitStar, null, this);
        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;
        //this.CheckBounds();
    }
}

Star.prototype.Explode = function(bullet, platform) {

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

    this.kill();
}