

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
    this.dischargeLifeTime = 0.2;
    this.piercing = false;
}

Laser.prototype.Trigger = function(target) {
    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        width: this.dischargeSize,
        timeAlive: this.dischargeLifeTime,
        targetGroups: enemies,
        rotation: this.GetAngleToTarget(target)
    }

    this.Fire(this.GetDischargePoint(), data);
}
