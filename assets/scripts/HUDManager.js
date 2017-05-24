

function Bar(spriteName, x, y, showDiff) {
    this.bg = hud.add(new Phaser.Sprite(game, x-1, y-1, 'barbg'));

    Phaser.Sprite.call(this, game, x, y, spriteName);
    hud.add(this);

    // width of sprite is 256 pixels

    this.max = 100;
    this.showDifference = showDiff;

    if (this.showDifference) {
        this.diffBar = hud.add(new Phaser.Sprite(this.game, this.x, this.y, spriteName + "Diff"));
        this.diffScale = 0;
        this.diffBar.visible = false;
    }

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
        this.diffBar.visible = true;
        if (this.previous < this.current) this.diffBar.anchor.x = 1;
        else this.diffBar.anchor.x = 0;
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
            this.diffBar.visible = false;
        }
    }
}

function SetupHUD() {
    
    scoreText = hud.add(new Phaser.Text(game, 16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }));

    hpBar = new Bar('hpbar', 20, 60, true);
    //energyBar = new Bar('energybar', 20, 75, false);
    fuelBar = new Bar('fuelbar', 20, 90, true);
    fuelBar.max = 5;
    fuelBar.SetValue(0);
}

function UpdateHUD() {
    hpBar.Set(player.health);
    //energyBar.Set(player.energy);
}

function UpdateScore(newScore) {
    score = newScore;
    scoreText.text = 'Score: ' + score;
}


function ShowUpgradeScreen() {
    for (var i = 0; i < 3; i++) {
        ShowUpgradeOption(i);
    }
}

function ShowUpgradeOption(position) {
    console.log("1");
    var w = 200;
    var h = 50;
    var gap = 15;

    var graphics = game.add.graphics(game.width / 2, 250 + position*(h + gap));
    graphics.beginFill(0xFFFFFF, 0.5);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.drawRoundedRect(-w/2, -h/2, w, h, 3);
    hud.add(graphics);

    
    graphics.scale.x = 0.05;
    graphics.scale.y = 0.1;
    console.log("2");
    var t = game.add.tween(graphics.scale).to({y: 1}, 400, "Quart.easeOut");
    t.chain(game.add.tween(graphics.scale).to({x: 1}, 400, "Quart.easeOut"));
    t.start();
    console.log("3");
}