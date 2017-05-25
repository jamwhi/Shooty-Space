

Shotgun.prototype = Object.create(Weapon.prototype);
Shotgun.prototype.constructor = Shotgun;

function Shotgun (game, ship) {
    Weapon.call(this, game, 'turret3', ship);
    this.dischargePool = bulletPool;
    
    this.fireOffset = 20;
    this.reloadTime = 0.6;
    this.weaponRange = 200;
    this.damage = 30;
    this.dischargeSize = 0.2;
    this.dischargeLifeTime = 0.4;
    this.piercing = false;
    this.speed = 750;
}


Shotgun.prototype.Trigger = function(target) {
    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        size: this.dischargeSize,
        timeAlive: this.dischargeLifeTime,
        targetGroups: enemies,
        speed: this.speed,
        rotation: this.GetAngleToTarget(target)
    }
    
    var p = this.GetDischargePoint();
    this.Fire(p, data);
    data.rotation += 0.15;
    this.Fire(p, data);
    data.rotation += 0.15;
    this.Fire(p, data);
    data.rotation -= 0.45;
    this.Fire(p, data);
    data.rotation -= 0.15;
    this.Fire(p, data);
}
