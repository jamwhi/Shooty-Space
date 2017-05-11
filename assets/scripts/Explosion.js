

Explosion.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
Explosion.prototype.constructor = Explosion;

function Explosion (game) {
    Phaser.Particles.Arcade.Emitter.call(this, game, 0, 0, 10);

    this.makeParticles('dot');
    this.setAlpha(0.8, 1, 3000);
    this.setScale(1, 0.1, 1, 0.1, 2000, Phaser.Easing.Quadratic.Out);

    this.forEach(function(particle) {
        particle.body.allowGravity = false;
    }, this);

    this.kill();
}

Explosion.prototype.Spawn = function(x, y, data) {
    this.x = x;
    this.y = y;

    this.start(true, 2000, null, 10);
    game.time.events.add(4000, function(){this.kill()}, this);
}