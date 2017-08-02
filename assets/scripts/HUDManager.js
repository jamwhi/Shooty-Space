

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
	
	alertText = hud.add(new Phaser.Text(game, 0, 0, '', { boundsAlignV: "middle", boundsAlignH: "center", fontSize: '64px', fill: '#F00' }));
	alertText.setTextBounds(0, 0, game.width, game.height);

    hpBar = new Bar('hpbar', 20, 60, true);
    //energyBar = new Bar('energybar', 20, 75, false);
    fuelBar = new Bar('fuelbar', 20, 90, true);
    fuelBar.max = 5;
    fuelBar.SetValue(0);

    CreateUpgradeScreen();
	//ShowUpgradeScreen();
}

function UpdateHUD() {
    hpBar.Set(player.health);
    //energyBar.Set(player.energy);
}

function UpdateScore(newScore) {
    score = newScore;
    scoreText.text = 'Score: ' + score;
}

var alertFullText;
var alertIndex = 0;
function DisplayAlertText(text) {
	alertFullText = text;
	alertText.text = '';

	game.time.events.repeat(150, text.length, NextLetter, game);
	game.time.events.add(text.length * 150 + 1500, HideAlertText, game);
}

function NextLetter() {
	alertText.text += alertFullText[alertIndex++];
}

function HideAlertText() {
	game.add.tween(alertText).to( { alpha: 0 }, 1200, "Quart.easeIn", true);
}


var upgradeScreen;

function CreateUpgradeScreen() {
    upgradeScreen = game.add.group(hud, 'UpgradeScreen');
    upgradeScreen.position.setTo(game.width / 2, game.height / 2 - 80);

    /*for (var i = 0; i < 3; i++) {
        var gap = 15;
        var x = 0;
        var y = 0;
        if (i > 0) {
            y = upgradeScreen.getAt(i-1).y + upgradeScreen.getAt(i-1).bg.bottom + gap;
        }
        upgradeScreen.addChild(RandomUpgrade(x, y));
    }*/

    var gap = 15;
    var x = 0;
    var y = 0;

    upgradeScreen.addChild(new UpgradeOption(x, y, 'empty', Upgrade_Rapid));
    y = upgradeScreen.getAt(0).y + upgradeScreen.getAt(0).bg.bottom + gap;
    upgradeScreen.addChild(new UpgradeOption(x, y, 'empty', Upgrade_Laser));
    y = upgradeScreen.getAt(1).y + upgradeScreen.getAt(1).bg.bottom + gap;
    upgradeScreen.addChild(new UpgradeOption(x, y, 'empty', Upgrade_Shotgun));

    upgradeScreen.visible = false;
}

function ShowUpgradeScreen() {
    upgradeScreen.visible = true;
    var i = 0;
    var delay = 300;
    
    // Pause the game
    PauseGame();

    // Show each of the upgrade options
    upgradeScreen.forEach(function(up) {
        up.Show(i*delay);
        i++;
    }, this);
}

function HideUpgradeScreen(selected) {
    
    var delay = 500;

    // Hide each of the upgrade options
    upgradeScreen.forEach(function(up) {
        up.Hide ((up == selected) * delay)
    }, this);

    // After 1 second, make the upgrade screen invisible
    var timer = game.time.create(true);
    timer.add(1000, function() {

        upgradeScreen.visible = false;

        // Unpause the game
        UnpauseGame();

    });
    timer.start();
}