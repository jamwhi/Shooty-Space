

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

function Weapon (game, spriteData, ship) {
    Phaser.Sprite.call(this, game, 0, 0, spriteData);
    this.anchor.set(0.5, 0.5);

    this.game = game;
    this.ship = ship;
    midground.add(this);
    //ship.addChild(this);

    //this.chargeGraphic = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'bullet'));
    //this.chargeGraphic.anchor.setTo(0.5);

    // Discharge type
    this.dischargePool = bulletPool;

    // Weapon stats
    this.fireOffset = 20;
    this.reloadTime = 0.3;
    this.weaponRange = 250;
    this.damage = 50;
    this.dischargeSize = 15;
    this.dischargeLifeTime = 0.2;
    this.piercing = false;

    //this.recoil = -1600;
    //this.piercePower = 0.4;
    //this.minWidth = 15
    //this.maxWidth = 30
    //this.minTimeAlive = 0.2;
    //this.maxTimeAlive = 0.4;
    //this.minDamage = 40;
    //this.maxDamage = 100;

    //this.energyToShoot = 0;
    //this.energyToShootMaxCharged = 40;
    //this.minChargeShotTime = 0.3;
    //this.maxChargeShotTime = 0.7;
    //this.chargeGraphic.x = Math.cos(this.rotation) * this.fireOffset;
    //this.chargeGraphic.y = Math.sin(this.rotation) * this.fireOffset;


    // initial values
    this.currentTarget = null;
    this.rotateThisTick = false;

    this.reloadCurrent = this.reloadTime;

    //this.chargingShot = false;
    //this.currentChargeShotTime = 0;
    //this.chargeShotPercent = 0;
    //this.chargeShotExponential = 0;
    //this.chargeGraphic.visible = false;
}

Weapon.prototype.update = function() {

    if (paused) return;

    this.position = this.ship.position;
    // Check if the weapon can shoot (has cooled down / reloaded). If so, check for valid targets
    if (this.reloadCurrent <= 0) {
        this.CheckForTargets();
    }

    
    // Rotate towards current target if there is one
    if (this.currentTarget != null) {
        if (this.currentTarget.alive == true || this.rotateThisTick) {
            // Set rotation
            var angle = game.physics.arcade.angleBetween(this.world, this.currentTarget.position);
            this.rotation = angle - this.parent.rotation;
            this.rotateThisTick = false;
        } else {
            this.currentTarget = null;
        }
    }

    // Fire at target if able
    if (this.reloadCurrent <= 0 && this.currentTarget != null) {
        this.reloadCurrent = this.reloadTime;
        this.Trigger(this.currentTarget);
    } else {
        this.reloadCurrent -= this.game.time.physicsElapsed;
    }
}

Weapon.prototype.CheckForTargets = function() {
    var closest = null;
    var closestD = 99999;
    var d;

    // Loop through each enemy pool (and each enemy inside that pool) and return the closest enemy
    enemies.forEach(function (f) {
    
        f.forEachAlive(function (e) {
            if (!closest) {
                closest = e;
                closestD = e.position.distance(this.world);
            } else {
                d = e.position.distance(this.world);
                if (d < closestD) {
                    closest = e;
                    closestD = d;
                }
            }
            
        }, this);
    }, this);


    // Make sure the closest enemy is close enough to fire at
    if (closest && closestD < this.weaponRange) {
        this.currentTarget = closest;
        this.rotateThisTick = true;
    } else {
        this.currentTarget = null;
    }
}

Weapon.prototype.Trigger = function(target, data) {
    
    //var vectorTo = Phaser.Point.subtract(target.position, this.position);
    
    // Calculate beam stats
    /*
    // Calculating stats based on charge amount
    var piercing = this.chargeShotExponential >= this.piercePower;
    var size = Math.max(this.minSize, this.chargeShotExponential * this.maxSize);
    var timeAlive = this.minTimeAlive + this.chargeShotExponential * (this.maxTimeAlive - this.minTimeAlive);
    var beamWidth = this.minWidth + this.chargeShotExponential * (this.maxWidth - this.minWidth);
    */

    /*if (data == null) {
        data = {
            direction: angle, 
            damage: this.damage, 
            piercing: this.piercing,
            width: this.dischargeSize,
            timeAlive: this.dischargeLifeTime,
            targetGroups: enemies
        }
    }*/

    if (data == null) data = {};
    if (data.rotation == null) {
        data.rotation = this.GetAngleToTarget(target);
    }

    this.Fire(data);
}

Weapon.prototype.Fire = function(p, data) {
    this.dischargePool.create(p.x, p.y, data);
}

Weapon.prototype.GetDischargePoint = function() {
    var x = this.world.x + Math.cos(this.rotation) * this.fireOffset;
    var y = this.world.y + Math.sin(this.rotation) * this.fireOffset;

    return {x, y};
}

Weapon.prototype.GetAngleToTarget = function(target) {
    return game.physics.arcade.angleBetween(this.world, target.position);
}






/*
Unused charging code

Weapon.prototype.StartCharge = function() {
    this.chargingShot = true;
    
    //var x = this.x + Math.cos(this.rotation) * this.fireOffset;
    //var y = this.y + Math.sin(this.rotation) * this.fireOffset;
    //this.chargeGraphic.x = x;
    //this.chargeGraphic.y = y;
    
    this.chargeGraphic.visible = true;
    
    this.UpdateChargeShot();
}

Weapon.prototype.UpdateChargeShot = function() {
    this.currentChargeShotTime += 0.01;
    this.currentChargeShotTime = Math.min(this.currentChargeShotTime, this.maxChargeShotTime);

    this.chargeShotPercent = this.currentChargeShotTime / this.maxChargeShotTime;
    this.chargeShotExponential = this.chargeShotPercent * this.chargeShotPercent

    this.chargeGraphic.scale.setTo(this.chargeShotExponential);
}

Weapon.prototype.KeepChargingShot = function() {

    //var x = this.x + Math.cos(this.rotation) * this.fireOffset;
    //var y = this.y + Math.sin(this.rotation) * this.fireOffset;
    //this.chargeGraphic.x = x;
    //this.chargeGraphic.y = y;

    if (this.currentChargeShotTime >= this.maxChargeShotTime) {
        // Weapon is already fully charged
        this.currentChargeShotTime = this.maxChargeShotTime;
        return;
    }
    
    this.UpdateChargeShot();
}

*/

/*
Player.prototype.Fire = function() {

    if (this.CanFire()) {
        
        if (this.chargingShot) {
            this.energy -= this.chargeShotExponential * this.energyToShootMaxCharged;
        } else {
            this.energy -= this.energyToShoot;
        }

        this.energy = Math.max(this.energy, 0);

        var x = this.x + Math.cos(this.rotation) * this.fireOffset;
        var y = this.y + Math.sin(this.rotation) * this.fireOffset;

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










/*


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


*/