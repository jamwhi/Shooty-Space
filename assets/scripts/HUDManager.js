

function Bar(spriteName, x, y, showDiff) {
    this.bg = hud.add(new Phaser.Sprite(game, x-1, y-1, 'barbg'));

    this.diffSpriteName = spriteName + "Diff";
    Phaser.Sprite.call(this, game, x, y, spriteName);
    hud.add(this);

    // width of sprite is 256 pixels

    this.max = 100;
    this.showDifference = showDiff;

    this.diffBar = null;
    this.diffScale = 0;


    this.current = this.max;
    this.previous = this.current;
    this.t = 1;
    this.tEnd = 1;
    this.tDelay = 0.5;
}

Bar.prototype = Object.create(Phaser.Sprite.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.Set = function(n) {
    if (n == this.current) return;

    this.previous = this.current;
    this.current = n;
    this.scale.x = this.current / this.max;

    if (this.showDifference) {
        if (this.diffBar != null) this.diffBar.kill();
        this.diffBar = hud.add(new Phaser.Sprite(this.game, this.x, this.y, this.diffSpriteName));
        if (this.previous < this.current) this.diffBar.anchor.x = 1;
        this.diffScale = Math.abs(this.current - this.previous) / this.max;
        this.diffBar.scale.x = this.diffScale;
        this.diffBar.x = this.x + this.scale.x * 256;

        this.t = 0;
    }
}

Bar.prototype.SetValue = function(n) {
    this.current = n;
    this.previous = n;
    this.scale.x = this.current / this.max;
}

Bar.prototype.update = function() {
    if (this.showDifference && this.t < this.tEnd) {
        this.t += this.game.time.physicsElapsed;

        if (this.t > this.tDelay) {
            this.diffBar.scale.x = this.diffScale - ((this.t - this.tDelay) / (this.tEnd - this.tDelay)) * this.diffScale
        }

        if (this.t >= this.tEnd) {
            this.diffBar.kill();
        }
    }
}

function SetupHUD() {
    
    scoreText = hud.add(new Phaser.Text(game, 16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }));

    hpBar = new Bar('hpbar', 20, 60, true);
    energyBar = new Bar('energybar', 20, 75, false);
    fuelBar = new Bar('fuelbar', 20, 90, true);
    fuelBar.max = 5;
    fuelBar.SetValue(0);
}

function UpdateHUD() {
    hpBar.Set(player.health);
    energyBar.Set(player.energy);
}

function UpdateScore(newScore) {
    score = newScore;
    scoreText.text = 'Score: ' + score;
}