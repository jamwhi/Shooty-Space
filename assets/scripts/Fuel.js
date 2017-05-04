

Fuel.prototype = Object.create(Phaser.Sprite.prototype);
Fuel.prototype.constructor = Fuel;

function Fuel (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'fuel');
    this.game = game;
    this.exists = false;
    this.alive = false;

    this.anchor.setTo(0.5);
    this.scale.setTo(0.4);
    this.game.physics.arcade.enable(this);

    this.target = null;
    this.maxSpeed = 900;
    this.acceleration = 800;

    this.speed = 0;
}


Fuel.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.speed = 0;
}

Fuel.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);
    //this.speed = data.speed;
    //this.rotation = data.rotation;
    this.x = x;
    this.y = y;
    
    //this.body.velocity.x = Math.cos(this.rotation) * this.speed;
    //this.body.velocity.y = Math.sin(this.rotation) * this.speed;
}

Fuel.prototype.update = function() {
    if (this.alive) {
        if (this.target != null) {
            if (this.speed < this.maxSpeed) {
                this.speed += this.acceleration * this.game.time.physicsElapsed;
            }

            var vectorTo = Phaser.Point.subtract(this.target.position, this.position);
            vectorTo.setMagnitude(this.speed);
            this.body.velocity = vectorTo;
        }
    }
}

Fuel.prototype.Explode = function(Fuel, platform) {
    this.kill();
}

Fuel.prototype.Collect = function() {
    this.kill();
}

Fuel.prototype.HomeTo = function(target) {
    this.target = target;
}