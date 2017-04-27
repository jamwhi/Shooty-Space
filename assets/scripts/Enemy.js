

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

function Enemy (game, spriteData) {
    Phaser.Sprite.call(this, game, 0, 0, spriteData);

    // Setup stuff that all enemy types have as the same
    this.game = game;
    this.exists = false;
    this.alive = false;
    this.radius = this.width * 0.5;
    this.anchor.setTo(0.5);

    this.hitTime = 1;
    this.hitTimeCurrent = 0;
    this.hitTint = 0xff0000; // red
    this.game.physics.arcade.enable(this);

    // Setup some defaults that enemies may change
    this.maxHealth = 100;
    this.hitDamage = 20;
    this.health = this.maxHealth;
}

Enemy.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.health = this.maxHealth;
    this.hitTimeCurrent = 0;
    this.tint = 0xffffff;
}

Enemy.prototype.Spawn = function(x, y, data) {
    this.stdReset(x, y);
    
    return this;
}

Enemy.prototype.update = function() {
    if (this.alive) {
        this.CheckHitTime();
    }
}

Enemy.prototype.CheckBounds = function() {
    if (this.x > this.game.width + this.width || 
        this.x < -this.width || 
        this.y > this.game.height + this.height || 
        this.y < -this.height) 
    {
        this.OutOfBounds();
    }
}

Enemy.prototype.CheckHitTime = function() {
    if (this.hitTimeCurrent > 0) {
        var step = Math.round((1 - (this.hitTimeCurrent / this.hitTime)) * 100);
        //console.log(Phaser.Color.interpolateColor(this.hitTint, 0xffffff, 255, step));
        this.tint = Phaser.Color.interpolateColorWithRGB(this.hitTint, 0xff, 0xff, 0xff, 100, step);
        //this.tint = this.hitTint;
        this.hitTimeCurrent -= this.game.time.physicsElapsed;
    }
}

Enemy.prototype.Explode = function(bullet, platform) {
    this.kill();
}

Enemy.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;

    if (this.health <= 0) {
        this.Explode();
    } else {
        this.hitTimeCurrent = this.hitTime;
    }
}

Enemy.prototype.OutOfBounds = function() {
    this.kill();
}