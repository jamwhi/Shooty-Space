

function Bullet (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'bullet');
    this.game = game;
    this.exists = false;
    this.alive = false;

    //this.minSize = 0.2;
    this.maxSize = 1;

    this.power = 1;
    this.hitDamage = 50;

    this.anchor.setTo(0.5);
    this.scale.setTo(0.4);
    this.game.physics.arcade.enable(this);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.exists = true;
}

Bullet.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);
    this.power = data.power
    this.scale.setTo(this.power * this.maxSize);
    this.speed = data.speed;
    this.rotation = data.rotation;
    this.x = x;
    this.y = y;
    
    this.body.velocity.x = Math.cos(this.rotation) * this.speed;
    this.body.velocity.y = Math.sin(this.rotation) * this.speed;
}

Bullet.prototype.update = function() {
    if (this.alive) {
        game.physics.arcade.overlap(this, platforms, this.Explode, null, this);
        game.physics.arcade.overlap(this, starPool, this.HitStar, null, this);

        this.CheckBounds();
    }
}

Bullet.prototype.CheckBounds = function() {
    if (this.x > 800 || this.x < 0 || this.y > 600 || this.y < 0) {
        this.kill();
    }
}

Bullet.prototype.Explode = function(bullet, platform) {
    this.kill();
}

Bullet.prototype.HitStar = function(bullet, star) {
    star.Hit(this.hitDamage);
    if (this.power >= 1) {

    } else {
        this.Explode();
    }
}