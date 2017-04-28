

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    this.anchor.set(0.5);

    this.chargeGraphic = midground.add(new Phaser.Sprite(this.game, 0, 0, 'bullet'));
    this.chargeGraphic.anchor.setTo(0.5);

    // Setup input (arrow keys)
    this.cursors = game.input.keyboard.createCursorKeys();

    // Setup physics
    this.game.physics.arcade.enable(this);
    this.body.bounce.setTo(2, 2);
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = new Phaser.Signal() 
    this.body.onWorldBounds.add(hitWorldBounds, this);
    this.body.setSize(20, 20, 10, 10);
    this.drag = 0.93;

    // Variables
    
    // Health
    this.healthMax = 100;

    // Movement
    this.moveAccel = 2.5;
    this.maxMoveSpeed = 100;
    this.minBounceSpeed = 800;

    // Weapon firing
    this.minChargeShotTime = 0.01;
    this.maxChargeShotTime = 0.3;
    this.recoil = -840;
    this.bulletSpeed = 1200;
    this.bulletHeadStart = 20;

    // Energy
    this.energyMax = 100;
    this.energyRechargeSpeed = 1;
    this.energyFirstStep = 10;
    this.energyStep = 2.2;
    
    
    // Setup initial values
    this.initialValues(x, y);
    
    //this.animations.add('left', [0, 1, 2, 3], 10, true);
    //this.animations.add('right', [5, 6, 7, 8], 10, true);

    midground.add(this);
};

Player.prototype.initialValues = function() {
    // Setup initial values
    this.health = this.healthMax;
    this.mouseFired = false;
    this.chargingShot = false;
    this.hasDoneFirstCharge = false;
    this.energy = this.energyMax;
    this.currentChargeShotTime = 0;
    this.chargeShotPercent = 0;
    this.chargeShotExponential = 0;
    this.chargeGraphic.visible = false;

    // Update HUD
    score = 0;
    scoreText.text = 'Score: ' + score;
    hpBar.scale.x = 1;
    energyBar.scale.x = 1;
}

Player.prototype.stdReset = function(x, y) {
    this.reset(x, y, this.healthMax);
    this.initialValues();
}

Player.prototype.update = function() {
    var hitPlatform = game.physics.arcade.collide(this, platforms);

    this.rotation = game.physics.arcade.angleToPointer(this);

    this.CheckMouseInput();

    if (this.chargingShot) {
        this.KeepChargingShot();
    }

    if (this.energy < this.energyMax) {
        this.energy += this.energyRechargeSpeed;
        this.energy = Math.min(this.energy, this.energyMax);
    }
    

    this.ApplyDrag();
}

Player.prototype.KeepChargingShot = function() {
    // Move forwards slightly
    //this.body.velocity.x += Math.cos(this.rotation) * this.moveAccel;
    //this.body.velocity.y += Math.sin(this.rotation) * this.moveAccel;
    if (!this.hasDoneFirstCharge) {
        if (!this.TryFirstChargeStep()) {
            return;
        }
    }

    var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    this.chargeGraphic.x = x;
    this.chargeGraphic.y = y;


    if (this.energy < this.energyStep) {
        return
    }

    if (this.currentChargeShotTime >= this.maxChargeShotTime) {
        // Weapon is already fully charged
        this.currentChargeShotTime = this.maxChargeShotTime;
        return;
    }

    this.energy -= this.energyStep;
    
    //this.chargeShotPercent = (this.currentChargeShotTime - this.minChargeShotTime) / (this.maxChargeShotTime - this.minChargeShotTime);
    this.UpdateChargeShot();
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
    this.TryFirstChargeStep();
}

Player.prototype.TryFirstChargeStep = function() {
    if (this.energy < this.energyFirstStep) {
        return false;
    }

    this.hasDoneFirstCharge = true;
    this.energy -= this.energyFirstStep;
    var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    this.chargeGraphic.x = x;
    this.chargeGraphic.y = y;
    
    this.chargeGraphic.visible = true;
    
    this.UpdateChargeShot();

    return true;
}

Player.prototype.UpdateChargeShot = function() {
    this.currentChargeShotTime += 0.01;
    this.currentChargeShotTime = Math.min(this.currentChargeShotTime, this.maxChargeShotTime);

    this.chargeShotPercent = this.currentChargeShotTime / this.maxChargeShotTime;
    this.chargeShotExponential = this.chargeShotPercent * this.chargeShotPercent

    this.chargeGraphic.scale.setTo(this.chargeShotExponential);
}

Player.prototype.Fire = function() {
    
    this.chargingShot = false;
    this.chargeGraphic.visible = false;

    if (this.currentChargeShotTime > this.minChargeShotTime)
    {
        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;

        beamPool.create(x, y, {direction: this.rotation, power: this.chargeShotExponential});

        // bulletPool.create(x, y, {speed: this.bulletSpeed, power: this.chargeShotExponential, rotation: this.rotation});

        // Propel backwards
        var chargeRecoil = this.recoil * (0.1 + this.chargeShotExponential);
        this.body.velocity.x += Math.cos(this.rotation) * chargeRecoil;
        this.body.velocity.y += Math.sin(this.rotation) * chargeRecoil;
    }

    this.currentChargeShotTime = 0;
    this.chargeShotExponential = 0;
    this.hasDoneFirstCharge = false;
}

Player.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;

    if (this.health <= 0) {
        player.stdReset(game.world.width / 2, game.world.height / 2)
    }
}