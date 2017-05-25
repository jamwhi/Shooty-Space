

Rapidgun.prototype = Object.create(Weapon.prototype);
Rapidgun.prototype.constructor = Rapidgun;

function Rapidgun (game, ship) {
    Weapon.call(this, game, 'turret1', ship);
    this.dischargePool = bulletPool;
    
    this.fireOffset = 20;
    this.reloadTime = 0.07;
    this.weaponRange = 250;
    this.damage = 10;
    this.dischargeSize = 0.2;
    this.dischargeLifeTime = 0.5;
    this.piercing = false;
    this.speed = 750;
    this.spread = 0.3;
}


Rapidgun.prototype.Trigger = function(target) {
    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        size: this.dischargeSize,
        timeAlive: this.dischargeLifeTime,
        targetGroups: enemies,
        speed: this.speed,
        rotation: this.GetAngleToTarget(target) + this.AddSpread()
    }
    
    var p = this.GetDischargePoint();
    this.Fire(p, data);
}

Rapidgun.prototype.AddSpread = function() {
    return (Math.random() * 2 - 1) * this.spread;
}