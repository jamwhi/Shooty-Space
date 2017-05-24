

Pickup.prototype = Object.create(Phaser.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

function Pickup (game, spriteData, ship) {
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

    // Pickup stats
    this.fireOffset = 20;
    this.reloadTime = 0.3;
    this.PickupRange = 250;
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

Pickup.prototype.update = function() {
    this.position = this.ship.position;
    // Check if the Pickup can shoot (has cooled down / reloaded). If so, check for valid targets
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
        console.log("1");
        this.reloadCurrent = this.reloadTime;
        this.Trigger(this.currentTarget);
    } else {
        this.reloadCurrent -= this.game.time.physicsElapsed;
    }
}