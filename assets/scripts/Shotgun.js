

Shotgun.prototype = Object.create(Weapon.prototype);
Shotgun.prototype.constructor = Shotgun;

function Shotgun (game, ship) {
    Weapon.call(this, game, 'turret', ship);
    this.dischargePool = bulletPool;
    
    this.fireOffset = 20;
    this.reloadTime = 0.6;
    this.weaponRange = 200;
    this.damage = 30;
    this.dischargeSize = 0.2;
    this.dischargeTime = 0.4;
    this.piercing = false;
    this.speed = 750;
}


Shotgun.prototype.Fire = function(target) {
    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        size: this.dischargeSize,
        timeAlive: this.dischargeTime,
        targetGroups: enemies,
        speed: this.speed
    }
    
    Weapon.prototype.Fire.call(this, target, data);
    data.rotation += 0.15;
    Weapon.prototype.Fire.call(this, target, data);
    data.rotation += 0.15;
    Weapon.prototype.Fire.call(this, target, data);
    data.rotation -= 0.45;
    Weapon.prototype.Fire.call(this, target, data);
    data.rotation -= 0.15;
    Weapon.prototype.Fire.call(this, target, data);
}
