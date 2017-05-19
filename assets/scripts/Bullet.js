

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

function Bullet (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'bullet');
    this.game = game;

    this.exists = false;
    this.alive = false;

    this.anchor.setTo(0.5);
    this.scale.setTo(0.4);
    this.game.physics.arcade.enable(this);

    this.time = 0;
}


Bullet.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.time = 0;
}

Bullet.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);

    this.damage = data.damage;
    this.speed = data.speed;
    this.size = data.size;
    this.rotation = data.rotation;
    this.piercing = data.piercing;
    this.targetGroups = data.targetGroups;
    this.timeAlive = data.timeAlive;
    
    this.body.velocity.x = Math.cos(this.rotation) * this.speed;
    this.body.velocity.y = Math.sin(this.rotation) * this.speed;

    this.scale.setTo(this.size);
}

Bullet.prototype.update = function() {
    if (this.alive) {
        this.targetGroups.forEach(function(group) {
            game.physics.arcade.overlap(this, group, this.HitEnemy, null, this);
        }, this);

        this.CheckBounds();

        this.time += this.game.time.physicsElapsed;

        var t = this.time / this.timeAlive;
        t = t * t;
        this.body.velocity.setMagnitude((1 - t) * this.speed);


        if (this.time >= this.timeAlive) {
            this.kill();
        }
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

Bullet.prototype.HitEnemy = function(bullet, enemy) {
    enemy.Hit(this.damage);
    if (this.piercing) {

    } else {
        this.Explode();
    }
}