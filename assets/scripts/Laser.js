

Laser.prototype = Object.create(Weapon.prototype);
Laser.prototype.constructor = Laser;

function Laser (game, ship) {
    Weapon.call(this, game, 'turret', ship);
    this.dischargePool = beamPool;

    this.fireOffset = 20;
    this.reloadTime = 0.3;
    this.weaponRange = 250;
    this.damage = 50;
    this.dischargeSize = 15;
    this.dischargeTime = 0.2;
    this.piercing = false;
}

Laser.prototype.Fire = function(target) {
    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        width: this.dischargeSize,
        timeAlive: this.dischargeTime,
        targetGroups: enemies
    }

    Weapon.prototype.Fire.call(this, target, data);
}
