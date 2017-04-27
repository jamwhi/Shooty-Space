

function Star (game) {
    Phaser.Sprite.call(this, game, 0, 0, 'star');
    this.game = game;
    this.exists = false;
    this.alive = false;
    this.radius = this.width * 0.5;

    this.health = 100;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.hitDamage = 20;
    this.hitTime = 1;
    this.hitTimeCurrent = 0;

    this.hitTint = 0xff0000; // red
}

Star.prototype = Object.create(Phaser.Sprite.prototype);
Star.prototype.constructor = Star;

Star.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.health = 100;
    this.exists = true;
    this.hitTimeCurrent = 0;
    this.tint = 0xffffff;
}

Star.prototype.Spawn = function(x, y, data) {
    this.stdReset(x, y);
    this.speed = data;
    this.rotation = Math.random() * Phaser.Math.PI2;
    this.rotSpeed = Math.random() * 4 - 2;
    this.body.velocity.x = -this.speed;
    
    return this;
}

Star.prototype.update = function() {
    if (this.alive) {
        //game.physics.arcade.overlap(this, platforms, this.Explode, null, this);
        //game.physics.arcade.overlap(this, stars, this.HitStar, null, this);
        this.rotation += this.rotSpeed * this.game.time.physicsElapsed;
        this.CheckBounds();
        this.CheckHitTime();
    }
}

Star.prototype.CheckBounds = function() {
    if (this.x > 850 || this.x < -50 || this.y > 650 || this.y < -50) {
        this.OutOfBounds();
    }
}

Star.prototype.CheckHitTime = function() {
    if (this.hitTimeCurrent > 0) {
        var step = Math.round((1 - (this.hitTimeCurrent / this.hitTime)) * 100);
        //console.log(Phaser.Color.interpolateColor(this.hitTint, 0xffffff, 255, step));
        this.tint = Phaser.Color.interpolateColorWithRGB(this.hitTint, 0xff, 0xff, 0xff, 100, step);
        //this.tint = this.hitTint;
        this.hitTimeCurrent -= this.game.time.physicsElapsed;
    }
}

Star.prototype.Explode = function(bullet, platform) {

    emitter = game.add.emitter(this.x, this.y, 10);
    emitter.makeParticles('dot');
    //emitter.gravity = 1000;
    emitter.x = this.x;
    emitter.y = this.y;
    
    //emitter.setXSpeed(-100, 100);
    //emitter.setYSpeed(0, 0);
    //emitter.width = 20;
    //emitter.height = 20;
    emitter.setAlpha(0.8, 1, 3000);
    emitter.setScale(1, 0.1, 1, 0.1, 2000, Phaser.Easing.Quadratic.Out);

    emitter.start(true, 2000, null, 10);

    emitter.forEach(function(particle) {
        particle.body.allowGravity = false;
    }, this);

    score += 1;
    scoreText.text = 'Score: ' + score;

    this.kill();
}

Star.prototype.Hit = function(hitDamage) {
    this.health -= hitDamage;

    if (this.health <= 0) {
        this.Explode();
    } else {
        this.hitTimeCurrent = this.hitTime;
    }
}

Star.prototype.OutOfBounds = function() {
    this.kill();
}


function tweenTint(obj, startColor, endColor, time) {    
    // create an object to tween with our step value at 0    
    var colorBlend = {step: 0};    
    // create the tween on this object and tween its step property to 100    
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
    // run the interpolateColor function every time the tween updates, feeding it the    
    // updated value of our tween each time, and set the result as our tint    
    colorTween.onUpdateCallback(function() {      
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
    });        
    // set the object to the start color straight away    
    obj.tint = startColor;            
    // start the tween    
    colorTween.start();
}