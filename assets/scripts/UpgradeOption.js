

UpgradeOption.prototype = Object.create(Phaser.Sprite.prototype);
UpgradeOption.prototype.constructor = UpgradeOption;

function UpgradeOption(x, y, spriteName, storedUpgrade) {
    Phaser.Sprite.call(this, game, x, y, spriteName);

    this.storedUpgrade = new storedUpgrade();
    
    this.infoText = this.storedUpgrade.infoText;
    var w = 200;
    var h = 65;

    // Graphic (this can be removed / replaced if there is a background for the sprite itself above (upgrade))
    this.bg = game.add.graphics(0, 0);
    this.bg.beginFill(0xFFFFFF, 0.5);
    this.bg.lineStyle(2, 0xffffff, 1);
    this.bg.drawRoundedRect(-w/2, -h/2, w, h, 3);
    this.addChild(this.bg);

    // Text
    //var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };
    this.text = hud.add(new Phaser.Text(game, 0, 0, this.infoText, { fontSize: '36px', fill: '#ff0000' }));
    this.text.anchor.setTo(0.5, 0.5);
    this.addChild(this.text);

    // Mask
    this.contentMask = game.add.graphics(0,0);
    this.contentMask.beginFill(0xFFFFFF, 1);
    this.contentMask.drawRoundedRect(-w/2, -h/2, w, h, 3);
    this.bg.addChild(this.contentMask);
    this.text.mask = this.contentMask;
    this.mask = this.contentMask; // If using background for sprite, this sets up the mask for it too
    this.Buttonise();
}


UpgradeOption.prototype.Show = function(delay) {
    this.bg.scale.setTo(0.05, 0);
    var t1 = game.add.tween(this.bg.scale).to({y: 1}, 500, "Quart.easeOut", false, delay);
    var t2 = game.add.tween(this.bg.scale).to({x: 1}, 400, "Quart.easeOut");
    t1.chain(t2);
    t2.onComplete.add(function() {
        this.inputEnabled = true;
    }, this);
    t1.start();
}

UpgradeOption.prototype.Hide = function(delay) {
    this.bg.scale.setTo(1, 1);
    this.inputEnabled = false;

    var t1 = game.add.tween(this.bg.scale).to({x: 0, y: 0}, 400, "Quart.easeIn", true, delay);
    //var t2 = game.add.tween(this.bg.scale).to({y: 0}, 500, "Quart.easeIn", false, delay);
    //t1.chain(t2);
    //t1.start();
    //t2.start();
}

UpgradeOption.prototype.Select = function() {
    this.storedUpgrade.Deliver();
    HideUpgradeScreen(this);
}

UpgradeOption.prototype.Buttonise = function() {
    // Make clickable

    this.events.onInputOver.add(function() {
        this.bg.tint = 0xa0aaaa;
    }, this);
    this.events.onInputDown.add(function() {
        this.bg.tint = 0x777777;
    }, this);
    this.events.onInputOut.add(function() {
        this.bg.tint = 0xeeeeee;
    }, this);
    this.events.onInputUp.add(function() {
        this.bg.tint = 0xeeeeee;
        if (!this.input.pointerOver())
            return;
        this.Select();
    }, this);
}