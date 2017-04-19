


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
    this.mouseFired = false;
    this.canFire = true;
    this.chargingShot = false;
    this.currentChargeShotTime = 0;
    this.minChargeShotTime = 0.2;
    this.maxChargeShotTime = 0.6;
    this.fireRate = 300;
    this.recoil = -120;
    this.bulletSpeed = 1200;
    this.bulletHeadStart = 20;
    this.timeToPowerUp = 1;
    this.bounceMultiplier = 2;
    this.minBounceSpeed = 350;
    this.chargeGraphic = game.add.sprite(0, 0, 'bullet');
    this.chargeGraphic.anchor.setTo(0.5);
    this.chargeGraphic.visible = false;
    
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

    this.CheckMouseInput();

    if (this.chargingShot) {
        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
        this.chargeGraphic.x = x;
        this.chargeGraphic.y = y;
        this.currentChargeShotTime += 0.01;
        this.currentChargeShotTime = Math.min(this.currentChargeShotTime, this.maxChargeShotTime);
        this.chargeGraphic.scale.setTo(this.currentChargeShotTime);
    }
}

Player.prototype.CheckMouseInput = function() {
    if (!this.mouseFired) {
        if (game.input.activePointer.isDown) {
            // Mouse Down
            this.mouseFired = true;

            this.StartCharge();
        }
    } else {
        if (!game.input.activePointer.isDown) {
            // Mouse Up
            this.mouseFired = false;

            this.Fire();
        }
    }
}

function hitWorldBounds(sprite, up, down, left, right) {
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

Player.prototype.StartCharge = function() {
    this.chargingShot = true;

    var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    this.chargeGraphic.x = x;
    this.chargeGraphic.y = y;
    this.chargeGraphic.visible = true;
    this.chargeGraphic.scale.setTo(0.01);
    this.currentChargeShotTime = 0.01;
}

Player.prototype.Fire = function() {
    this.chargingShot = false;
    this.chargeGraphic.visible = false;

    if (this.currentChargeShotTime > this.minChargeShotTime)
    {
        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
        bulletPool.create(x, y, {speed: this.bulletSpeed, power: this.currentChargeShotTime, rotation: this.rotation});

        // propel backwards
        this.body.velocity.x += Math.cos(this.rotation) * this.recoil;
        this.body.velocity.y += Math.sin(this.rotation) * this.recoil;
    }

    this.currentChargeShotTime = 0;
}