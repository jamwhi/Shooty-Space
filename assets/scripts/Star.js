


function Star (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'star');
    this.game = game;
    this.exists = false;
    this.alive = false;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
}

Star.prototype = Object.create(Phaser.Sprite.prototype);
Star.prototype.constructor = Star;

Star.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.exists = true;
}

Star.prototype.Spawn = function(x, y, data) {
    this.stdReset(x, y);
    this.speed = data;
    this.rotation = Math.random() * Math.PI2;
    this.rotSpeed = Math.random();
    this.body.velocity.x = -this.speed;
    
    return this;
}

Star.prototype.update = function() {
    if (this.alive) {
        //game.physics.arcade.overlap(this, platforms, this.Explode, null, this);
        //game.physics.arcade.overlap(this, stars, this.HitStar, null, this);

        this.CheckBounds();
    }
}

Star.prototype.CheckBounds = function() {
    if (this.x > 850 || this.x < -50 || this.y > 650 || this.y < -50) {
        this.kill();
    }
}

Star.prototype.Explode = function(bullet, platform) {
    this.kill();
}