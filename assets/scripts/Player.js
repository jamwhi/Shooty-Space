

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    this.anchor.set(0.5);

    // Setup physics
    this.game.physics.arcade.enable(this);
    //this.body.drag.setTo(300, 300);
    
    this.body.bounce.setTo(2, 2);
    //this.body.worldBounce = new Phaser.Point(2, 2);
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = new Phaser.Signal() 
    this.body.onWorldBounds.add(hitWorldBounds, this);
    this.body.setA
    this.body.setSize(20, 20, 10, 10);

    // Setup variables
    this.drag = 0.93;
    this.mouseFired = false;
    this.canFire = true;
    this.chargingShot = false;
    this.currentChargeShotTime = 0;
    this.minChargeShotTime = 0;
    this.maxChargeShotTime = 0.6;
    this.chargeShotPercent = 0;
    this.chargeShotExponential = 0;
    this.fireRate = 0.2;
    this.reload = 0;
    this.recoil = -840;
    this.bulletSpeed = 1200;
    this.bulletHeadStart = 20;
    this.timeToPowerUp = 1;
    this.minBounceSpeed = 800;
    this.chargeGraphic = game.add.sprite(0, 0, 'bullet');
    this.chargeGraphic.anchor.setTo(0.5);
    this.chargeGraphic.visible = false;

    this.moveAccel = 2.5;
    this.maxMoveSpeed = 100;
    this.health = 100;
    
    //this.animations.add('left', [0, 1, 2, 3], 10, true);
    //this.animations.add('right', [5, 6, 7, 8], 10, true);

    // Setup input (arrow keys)
    this.cursors = game.input.keyboard.createCursorKeys();

    game.add.existing(this);
};


Player.prototype.update = function() {
    var hitPlatform = game.physics.arcade.collide(this, platforms);

    this.rotation = game.physics.arcade.angleToPointer(this);

    this.CheckMouseInput();

    if (this.chargingShot) {
        this.KeepChargingShot();
    }

    if (this.reload > 0) {
        this.reload -= this.game.time.physicsElapsed;
    }

    this.ApplyDrag();
}

Player.prototype.KeepChargingShot = function() {
    // Move forwards slightly
    //this.body.velocity.x += Math.cos(this.rotation) * this.moveAccel;
    //this.body.velocity.y += Math.sin(this.rotation) * this.moveAccel;


    var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    this.chargeGraphic.x = x;
    this.chargeGraphic.y = y;
    this.currentChargeShotTime += 0.01;
    this.currentChargeShotTime = Math.min(this.currentChargeShotTime, this.maxChargeShotTime);
    //this.chargeShotPercent = (this.currentChargeShotTime - this.minChargeShotTime) / (this.maxChargeShotTime - this.minChargeShotTime);
    this.chargeShotPercent = this.currentChargeShotTime / this.maxChargeShotTime;
    this.chargeShotExponential = this.chargeShotPercent * this.chargeShotPercent
    this.chargeGraphic.scale.setTo(this.chargeShotExponential);
}

Player.prototype.ApplyDrag = function() {
    var m = this.body.velocity.getMagnitude();

    //if (this.chargingShot && m < this.maxMoveSpeed) {
        // ignore drag
/*  } else*/ if (m > 0.1) {
        this.body.velocity.setMagnitude(m * this.drag);
    } else {
        this.body.velocity.setTo(0);
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
    this.currentChargeShotTime = 0;
    this.chargeShotPercent = 0;
    this.chargeShotExponential = 0;
}

Player.prototype.Fire = function() {
    
    this.chargingShot = false;
    this.chargeGraphic.visible = false;

    if (this.reload > 0) {
        return;
    }

    if (this.currentChargeShotTime > this.minChargeShotTime)
    {
        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;

        beamPool.create(x, y, {direction: this.rotation, power: this.chargeShotExponential});

        // bulletPool.create(x, y, {speed: this.bulletSpeed, power: this.chargeShotExponential, rotation: this.rotation});


        // Propel backwards
        var chargeRecoil = this.recoil * this.chargeShotExponential;
        this.body.velocity.x += Math.cos(this.rotation) * chargeRecoil;
        this.body.velocity.y += Math.sin(this.rotation) * chargeRecoil;
    }

    this.reload = this.fireRate;
    this.currentChargeShotTime = 0;
    this.chargeShotExponential = 0;
}

Player.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;
    if (this.health <= 0) {
        player.reset(game.world.width / 2, game.world.height / 2, 100)
        
        // Update score
        score = 0;
        scoreText.text = 'Score: ' + score;
    }
}