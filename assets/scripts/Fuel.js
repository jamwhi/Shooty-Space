

Fuel.prototype = Object.create(Phaser.Sprite.prototype);
Fuel.prototype.constructor = Fuel;

function Fuel (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'empty');
    

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
    
    this.globRangeMax = 15;
    this.globRangeMin = 10;
    this.globSpeed = 1;
    this.glob2Max = 2.2;
    this.glob2Speed = 1;

    this.globRange = this.globRangeMin;
    this.glob2T = 1;
    this.globT = 0;
    this.glob2Dir = 1;

    this.globs = [];
    for (var i = 0; i < 4; i++) {
        var glob = this.addChild(game.make.sprite(0, 0, 'fuelGlob'));
        glob.x = -(this.globRange) + this.globRange * (i % 2) * 2;
        glob.y = -(this.globRange) + this.globRange * Math.floor(i / 2) * 2;
        this.globs.push(glob);
    } 
}


Fuel.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.speed = 0;
    this.Movement = null;
    this.target = null;
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

        // update globs animation
        this.glob2T += this.glob2Speed * this.game.time.physicsElapsed * this.glob2Dir;
        //var s = this.globSpeed * this.glob2T;
        this.globT += this.globSpeed * this.game.time.physicsElapsed * this.glob2T;
        if (this.globT >= 1) {
            this.globT = 0;
        }
        if (this.glob2T > this.glob2Max || this.glob2T < 1) {
            this.glob2Dir = -this.glob2Dir;
        }

        var globPos = (-1 + this.globT * 2) * this.globRange;
        if (this.globT < 0) globPos = -globPos;
        this.globs[0].position.x = globPos; // top left
        this.globs[1].position.y = globPos; // top right
        this.globs[2].position.y = -globPos; // bottom left
        this.globs[3].position.x = -globPos; // bottom right




        if (this.Movement) {
            this.Movement();
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
    this.Movement = MoveTowardsTarget;
}