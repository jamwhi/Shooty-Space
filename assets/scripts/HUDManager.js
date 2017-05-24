

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

    CreateUpgradeScreen();
    HideUpgradeScreen();
}

function UpdateHUD() {
    hpBar.Set(player.health);
    //energyBar.Set(player.energy);
}

function UpdateScore(newScore) {
    score = newScore;
    scoreText.text = 'Score: ' + score;
}


var upgradeScreen;

function CreateUpgradeScreen() {
    upgradeScreen = game.add.sprite(game.width / 2, game.height / 2, 'empty');
    upgradeScreen.upgrades = [];
    for (var i = 0; i < 3; i++) {
        var newUpgrade = CreateUpgradeOption(i - 1, i);
        upgradeScreen.upgrades.push(newUpgrade)
        upgradeScreen.addChild(newUpgrade);
    }
}

function ShowUpgradeScreen() {
    upgradeScreen.visible = true;
    upgradeScreen.upgrades.forEach(function(u) {
        u.t1.start();
    }, this);
}

function HideUpgradeScreen() {
    upgradeScreen.visible = false;
}

function CreateUpgradeOption(yPos, listNum) {

    // Variables
    var w = 200;
    var h = 65;
    var gap = 15;
    var x = 0;
    var y = yPos*(h + gap);

    var upgrade = game.add.sprite(x, y, 'empty');
    upgrade.type = listNum;

    // Graphic (this can be removed / replaced if there is a background for the sprite itself above (upgrade))
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xFFFFFF, 0.5);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.drawRoundedRect(-w/2, -h/2, w, h, 3);
    upgrade.addChild(graphics);
    upgrade.g = graphics;


    // Text
    var text = hud.add(new Phaser.Text(game, 0, 0, 'THING ' + upgrade.type, { fontSize: '36px', fill: '#ff0000' }));
    text.anchor.setTo(0.5, 0.5);
    //var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };
    upgrade.addChild(text);


    // Mask
    var mask = game.add.graphics(0,0);
    mask.beginFill(0xFFFFFF, 1);
    mask.drawRoundedRect(-w/2, -h/2, w, h, 3);
    graphics.addChild(mask);
    text.mask = mask;
    upgrade.mask = mask; // If using background for sprite, this sets up the mask for it too



    // Animation / tween
    graphics.scale.setTo(0.05, 0.1);
    var delay = listNum * 300;
    var t1 = game.add.tween(graphics.scale).to({y: 1}, 500, "Quart.easeOut", false, delay);
    var t2 = game.add.tween(graphics.scale).to({x: 1}, 400, "Quart.easeOut");

    
    t2.onComplete.add(function() {
        // Make clickable
        upgrade.inputEnabled = true;

        upgrade.events.onInputOver.add(function() {
            this.g.tint = 0xa0aaaa;
        }, upgrade);
        upgrade.events.onInputDown.add(function() {
            this.g.tint = 0x777777;
        }, upgrade);
        upgrade.events.onInputOut.add(function() {
            this.g.tint = 0xeeeeee;
        }, upgrade);
        upgrade.events.onInputUp.add(SelectUpgrade, upgrade);
    }, this);

    t1.chain(t2);
    upgrade.t1 = t1;


    return upgrade;
}

function SelectUpgrade() {
    this.g.tint = 0xeeeeee;
    
    if (!this.input.pointerOver())
        return;
    
    console.log(this.type);
    HideUpgradeScreen();
}