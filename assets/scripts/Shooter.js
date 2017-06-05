

Shooter.prototype = Object.create(Enemy.prototype);
Shooter.prototype.constructor = Shooter;

function Shooter (game) {
    Enemy.call(this, game, 'turret3');
    
    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;

    this.maxHealth = 50;
    this.health = this.maxHealth;
    this.hitDamage = 20;

    this.weapon = new Rapidgun(this.game, this);
    this.weapon.reloadTime = 1.1;
}

// data: {speed}
Shooter.prototype.Spawn = function(x, y, data) {
    if (data.speed == null) data.speed = 200;
    
    Enemy.prototype.Spawn.call(this, x, y, data);

    this.speed = data.speed;
    if (x > 0) this.body.velocity.x = -this.speed;
    else this.body.velocity.x = this.speed;
    if (y > 0) this.body.velocity.y = -this.speed;
    else this.body.velocity.y = this.speed;

    this.target = player;
    return this;
}

Shooter.prototype.MoreUpdate = function() {
    // move towards player

    /*this.CheckBounds();

    this.Movement();*/
}

Shooter.prototype.Movement = TurnTowardsTarget;

Shooter.prototype.Explode = function(bullet, platform) {
    
    explosionPool.create(this.x, this.y);

    score += 4;
    scoreText.text = 'Score: ' + score;

    this.kill();
}