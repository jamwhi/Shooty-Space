

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    this.anchor.set(0.3, 0.5);

    midground.add(this);
    

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
    this.slowDistance = 80;

    // Weapons
    //this.weapon = new Rapidgun(this.game, this);
    this.weapon = null;

    /*
    // Energy
    this.energyMax = 100;
    this.energyRechargeSpeed = 0.4;
    this.energyRechargeSpeedSlow = 0.4;
    this.energyRechargeDelay = 0.5;
    */

    // Hit
    this.hitTime = 1;
    this.hitTint = 0xff0000; // red

    // Other
    this.fuelGetDistance = 75;
    
    // Setup initial values
    this.initialValues(x, y);
    
    //this.animations.add('left', [0, 1, 2, 3], 10, true);
    //this.animations.add('right', [5, 6, 7, 8], 10, true);



    this.Movement = ArriveTowardsTarget;
    this.target = game.input;
};

Player.prototype.initialValues = function() {
    // Setup initial values
    this.health = this.healthMax;
    this.mouseFired = false;
    this.energy = this.energyMax;
    this.energyRechargeDelayCurrent = 0;
    this.hitTimeCurrent = 0;
    this.tint = 0xffffff;

    this.chargingShot = false;
    /*
    this.currentChargeShotTime = 0;
    this.chargeShotPercent = 0;
    this.chargeShotExponential = 0;
    */

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

    //this.CheckMouseInput();

    // Charge shot up
    if (this.chargingShot) {
        weapon.KeepChargingShot();
    } 
    
    //this.RechargeEnergy();

    this.Movement();

    this.CheckHitTime();

    //this.ApplyDrag();

    this.CheckCollisions();

    this.FindCloseFuel();
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

    if (this.fuel >= this.maxFuel) {
        // Level up
        ShowUpgradeScreen();
    }
}

Player.prototype.HitEnemy = function(player, enemy) {
    //if (this.hitTimeCurrent > 0) return;
    enemy.Hit(1000);
    this.Hit(enemy.hitDamage);
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

    //weapon.StartCharge();
}


Player.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;

    if (this.health <= 0) {
        player.stdReset(game.world.width / 2, game.world.height / 2)
    } else {
        this.hitTimeCurrent = this.hitTime;
    }
}



Player.prototype.Equip = function(newEq) {
    this.weapon = newEq;
}




/*              Unused right now


Player.prototype.RechargeEnergy = function() {
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


Player.prototype.MouseDown = function() {
    // Mouse Down
    //this.Fire();
    //this.StartCharge();
}

Player.prototype.MouseUp = function() {
    // Mouse Up
    //this.Fire();
}

*/