

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    this.anchor.set(0.3, 0.5);

    this.chargeGraphic = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'bullet'));
    this.chargeGraphic.anchor.setTo(0.5);

    // Setup input (arrow keys)
    this.cursors = game.input.keyboard.createCursorKeys();

    // Setup physics
    this.game.physics.arcade.enable(this);
    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = new Phaser.Signal() 
    this.body.onWorldBounds.add(hitWorldBounds, this);
    this.body.setSize(20, 20, 1, 10);
    this.drag = 0.93;

    // Variables
    
    // Health
    this.healthMax = 100;
    this.fuel = 0;
    this.maxFuel = 5;

    // Movement
    this.moveAccel = 2.5;
    this.maxMoveSpeed = 100;
    this.minBounceSpeed = 500;

    this.maxSpeed = 300;
    this.acceleration = 30;
    this.slowDistance = 100;

    // Weapon firing
    this.minChargeShotTime = 0.3;
    this.maxChargeShotTime = 0.7;
    this.bulletSpeed = 1200;
    this.bulletHeadStart = 30;
    this.minRecoil = 0;
    this.maxRecoil = -1600;
    this.chargeGraphic.x = Math.cos(this.rotation) * this.bulletHeadStart;
    this.chargeGraphic.y = Math.sin(this.rotation) * this.bulletHeadStart;

    this.reloadTime = 0.7;

    // Energy
    this.energyMax = 100;
    this.energyRechargeSpeed = 0.4;
    this.energyRechargeSpeedSlow = 0.4;
    this.energyToShoot = 0;
    this.energyToShootMaxCharged = 40;
    this.energyRechargeDelay = 0.5;

    // Hit
    this.hitTime = 1;
    this.hitTint = 0xff0000; // red

    // Other
    this.fuelGetDistance = 75;
    
    // Setup initial values
    this.initialValues(x, y);
    
    //this.animations.add('left', [0, 1, 2, 3], 10, true);
    //this.animations.add('right', [5, 6, 7, 8], 10, true);

    midground.add(this);


    this.Movement = ArriveTowardsTarget;
    this.target = game.input;
};

Player.prototype.initialValues = function() {
    // Setup initial values
    this.health = this.healthMax;
    this.mouseFired = false;
    this.chargingShot = false;
    this.currentChargeShotTime = 0;
    this.chargeShotPercent = 0;
    this.chargeShotExponential = 0;
    this.chargeGraphic.visible = false;
    this.energy = this.energyMax;
    this.energyRechargeDelayCurrent = 0;
    this.hitTimeCurrent = 0;
    this.tint = 0xffffff;
    this.moving = false;

    this.reloadCurrent = this.reloadTime;

    // Update HUD
    UpdateScore(0);
}

Player.prototype.stdReset = function(x, y) {
    this.reset(x, y, this.healthMax);
    this.initialValues();
}

Player.prototype.update = function() {
    // Check collisions with platforms
    var hitPlatform = game.physics.arcade.collide(this, platforms);

    // Rotate to pointer
    this.rotation = game.physics.arcade.angleToPointer(this);

    this.CheckMouseInput();

    // Charge shot up
    if (this.chargingShot) {
        this.KeepChargingShot();
    } 
    
    // Recharge energy
    if (this.energyRechargeDelayCurrent <= 0) {
        if (this.energy < this.energyMax) {
            if (this.chargingShot) {
                this.energy += this.energyRechargeSpeedSlow
            } else {
                this.energy += this.energyRechargeSpeed;
            }
            this.energy = Math.min(this.energy, this.energyMax);
        }
    } else {
        this.energyRechargeDelayCurrent -= this.game.time.physicsElapsed;
    }

    this.Weapon();

    this.Movement();

    this.CheckHitTime();

    //this.ApplyDrag();

    this.CheckCollisions();

    this.FindCloseFuel();
}

Player.prototype.Weapon = function() {
    this.reloadCurrent -= this.game.time.physicsElapsed;
    if (this.reloadCurrent <= 0) {
        this.Fire();
        this.reloadCurrent = this.reloadTime;
    }
}

Player.prototype.FindCloseFuel = function() {
    fuelPool.forEach(function (f) {
        if (f.target == null && f.position.distance(this) < this.fuelGetDistance) {
            f.HomeTo(this);
        }
    }, this);
}


Player.prototype.CheckHitTime = function() {
    if (this.hitTimeCurrent > 0) {
        var step = Math.round((1 - (this.hitTimeCurrent / this.hitTime)) * 100);
        this.tint = Phaser.Color.interpolateColorWithRGB(this.hitTint, 0xff, 0xff, 0xff, 100, step);
        this.hitTimeCurrent -= this.game.time.physicsElapsed;

        if (this.hitTimeCurrent <= 0) {
            this.tint = 0xffffff;
        }
    }
}

Player.prototype.CheckCollisions = function() {
    // Enemies

    //if (this.hitTimeCurrent <= 0) {
        enemies.forEach(function(enemyPool) {
            game.physics.arcade.overlap(player, enemyPool, this.HitEnemy, null, this);
        }, this);
    //}

    game.physics.arcade.overlap(player, fuelPool, this.CollectFuel, null, this);
}

Player.prototype.CollectFuel = function(player, fuel) {
    this.fuel++;
    fuelBar.Set(this.fuel);
    fuel.Collect();
}

Player.prototype.HitEnemy = function(player, enemy) {
    //if (this.hitTimeCurrent > 0) return;
    enemy.Hit(1000);
    this.Hit(enemy.hitDamage);
}

Player.prototype.KeepChargingShot = function() {

    //var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    //var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    //this.chargeGraphic.x = x;
    //this.chargeGraphic.y = y;

    if (this.currentChargeShotTime >= this.maxChargeShotTime) {
        // Weapon is already fully charged
        this.currentChargeShotTime = this.maxChargeShotTime;
        return;
    }
    
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
            this.MouseDown();
        }
    } else {
        if (!game.input.activePointer.isDown) {
            // Mouse Up
            this.mouseFired = false;
            this.MouseUp();
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

Player.prototype.CanFire = function() {
    if (this.chargingShot) {
        if (this.currentChargeShotTime >= this.minChargeShotTime) {
            return true;
        } else {
            return false;
        }
    }

    if (this.energy >= this.energyToShoot) {
        return true;
    }
    return false;
}


Player.prototype.MouseDown = function() {
    // Mouse Down
    //this.Fire();
    //this.StartCharge();

    this.moving = true;
}

Player.prototype.MouseUp = function() {
    // Mouse Up
    //this.Fire();

    this.moving = false;
}

Player.prototype.StartCharge = function() {
    this.chargingShot = true;
    
    //var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
    //var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;
    //this.chargeGraphic.x = x;
    //this.chargeGraphic.y = y;
    
    this.chargeGraphic.visible = true;
    
    this.UpdateChargeShot();
}

Player.prototype.UpdateChargeShot = function() {
    this.currentChargeShotTime += 0.01;
    this.currentChargeShotTime = Math.min(this.currentChargeShotTime, this.maxChargeShotTime);

    this.chargeShotPercent = this.currentChargeShotTime / this.maxChargeShotTime;
    this.chargeShotExponential = this.chargeShotPercent * this.chargeShotPercent

    this.chargeGraphic.scale.setTo(this.chargeShotExponential);
}


Player.prototype.Fire = function() {


    var closest = null;
    var closestD = 99999;
    var d;

    enemies.forEach(function (f) {
    
        f.forEachAlive(function (e) {
            if (!closest) {
                closest = e;
                closestD = e.position.distance(this);
            } else {
                d = e.position.distance(this);
                if (d < closestD) {
                    closest = e;
                    closestD = d;
                }
            }
            
        }, this);
    }, this);

    if (!closest) return;
    var angle = game.physics.arcade.angleBetween(this.position, closest.position);
    //var vectorTo = Phaser.Point.subtract(closest.position, this.position);

    var x = this.x + Math.cos(angle) * this.bulletHeadStart;
    var y = this.y + Math.sin(angle) * this.bulletHeadStart;

    beamPool.create(x, y, {direction: angle, power: this.chargeShotExponential});
}


/*
Player.prototype.Fire = function() {

    if (this.CanFire()) {
        
        if (this.chargingShot) {
            this.energy -= this.chargeShotExponential * this.energyToShootMaxCharged;
        } else {
            this.energy -= this.energyToShoot;
        }

        this.energy = Math.max(this.energy, 0);

        var x = this.x + Math.cos(this.rotation) * this.bulletHeadStart;
        var y = this.y + Math.sin(this.rotation) * this.bulletHeadStart;

        beamPool.create(x, y, {direction: this.rotation, power: this.chargeShotExponential});

        // bulletPool.create(x, y, {speed: this.bulletSpeed, power: this.chargeShotExponential, rotation: this.rotation});

        // Propel backwards
        var chargeRecoil = this.minRecoil + (this.maxRecoil - this.minRecoil) * (this.chargeShotExponential);
        this.body.velocity.x += Math.cos(this.rotation) * chargeRecoil;
        this.body.velocity.y += Math.sin(this.rotation) * chargeRecoil;

        this.energyRechargeDelayCurrent = this.energyRechargeDelay;

    }

    this.chargingShot = false;
    this.chargeGraphic.visible = false;

    this.currentChargeShotTime = 0;
    this.chargeShotExponential = 0;

}
*/

Player.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;

    if (this.health <= 0) {
        player.stdReset(game.world.width / 2, game.world.height / 2)
    } else {
        this.hitTimeCurrent = this.hitTime;
    }
}