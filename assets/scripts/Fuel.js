

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
}


Fuel.prototype.stdReset = function(x, y) {
    this.reset(x, y);
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
        
    }
}

Fuel.prototype.Explode = function(Fuel, platform) {
    this.kill();
}