

Rapidgun.prototype = Object.create(Weapon.prototype);
Rapidgun.prototype.constructor = Rapidgun;

function Rapidgun (game, ship, friendlyToPlayer) {
    Weapon.call(this, game, 'turret1', ship);
    this.dischargePool = bulletPool;
    
    this.fireOffset = 20;
    this.reloadTime = 0.3;
    this.weaponRange = 9000; //250;
    this.damage = 10;
    this.dischargeSize = 0.2;
    this.dischargeLifeTime = 0.5;
    this.piercing = false;
    this.speed = 750;
    this.spread = 0.3;
    this.leadTarget = true;

    if (friendlyToPlayer) {
        this.targetGroups = enemies;
    } else {
        this.targetGroups = friendlies;
    }
}


Rapidgun.prototype.Trigger = function(target) {
    var rot = this.leadTarget ? this.LeadTarget(target) : this.GetAngleToTarget(target);
    rot += this.AddSpread();

    var data = {
        damage: this.damage, 
        piercing: this.piercing,
        size: this.dischargeSize,
        timeAlive: this.dischargeLifeTime,
        targetGroups: this.targetGroups,
        speed: this.speed,
        rotation: rot
    }
    
    var p = this.GetDischargePoint();
    this.Fire(p, data);
}

Rapidgun.prototype.AddSpread = function() {
    return (Math.random() * 2 - 1) * this.spread;
}

Rapidgun.prototype.LeadTarget = function(target) {
    var pos = target.position.clone();
    var d = pos.distance(this.world);
    var timeTo = d / this.speed;

    pos.x += target.body.velocity.x * timeTo;
    pos.y += target.body.velocity.y * timeTo;
	
	d = pos.distance(this.world);
	timeTo = d / this.speed;

	pos.x = target.position.x + target.body.velocity.x * timeTo;
	pos.y = target.position.y + target.body.velocity.y * timeTo;
	
    return game.physics.arcade.angleBetween(this.world, pos);
}