


function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    this.anchor.set(0.5);

    // Setup physics
    this.game.physics.arcade.enable(this);
    this.body.drag.setTo(300);
    this.body.bounce.setTo(0.6);
    //this.body.worldBounce = new Phaser.Point(2, 2);
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = new Phaser.Signal() 
    this.body.onWorldBounds.add(hitWorldBounds, this);

    // Setup variables
    this.nextFire = 0;
    this.fireRate = 300;
    this.recoil = -120;
    this.bulletSpeed = 1200;
    this.bulletHeadStart = 20;
    this.timeToPowerUp = 1;
    this.bounceMultiplier = 2;
    this.minBounceSpeed = 300;
    
    //this.animations.add('left', [0, 1, 2, 3], 10, true);
    //this.animations.add('right', [5, 6, 7, 8], 10, true);

    // Setup input (arrow keys)
    this.cursors = game.input.keyboard.createCursorKeys();

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    var hitPlatform = game.physics.arcade.collide(this, platforms);

    this.rotation = game.physics.arcade.angleToPointer(this);
    
    if (game.input.activePointer.isDown)
    {
        this.Fire();
    }
}

function hitWorldBounds(sprite, up, down, left, right) {
    console.log(up, down, left, right);
    if (up) {
        if (this.body.velocity.y < this.minBounceSpeed) {
            this.body.velocity.y = this.minBounceSpeed;
        }
    } else if (down) {
        if (this.body.velocity.y > -this.minBounceSpeed) {
            this.body.velocity.y = -this.minBounceSpeed;
        }
    }

    if (left) {
        if (this.body.velocity.x < this.minBounceSpeed) {
            this.body.velocity.x = this.minBounceSpeed;
        }
    } else if (right) {
        if (this.body.velocity.x > -this.minBounceSpeed) {
            this.body.velocity.x = -this.minBounceSpeed;
        }
    }
}

Player.prototype.Fire = function() {
    if (game.time.now > this.nextFire)
    {
        this.nextFire = game.time.now + this.fireRate;
        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
        bulletPool.create(x, y, {speed: this.bulletSpeed, power: 1, rotation: this.rotation});

        // propel backwards
        this.body.velocity.x += Math.cos(this.rotation) * this.recoil;
        this.body.velocity.y += Math.sin(this.rotation) * this.recoil;
    }
}