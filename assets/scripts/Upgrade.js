

Upgrade.prototype = Object.create(Phaser.Sprite.prototype);
Upgrade.prototype.constructor = Upgrade;

function Upgrade(spriteName) {
    Phaser.Sprite.call(this, game, 0, 0, spriteName);
}

Upgrade.prototype.Deliver = function() {
    player.Equip(new this.equipment(game, player));
}

function Upgrade_Shotgun() {
    Upgrade.call(this, 'turret3');

    this.infoText = "Shotgun";
    this.equipment = Shotgun;
}
Upgrade_Shotgun.prototype = Object.create(Upgrade.prototype);
Upgrade_Shotgun.prototype.constructor = Upgrade_Shotgun;


function Upgrade_Rapid() {
    Upgrade.call(this, 'turret1');

    this.infoText = "Rapid";
    this.equipment = Rapidgun;
}
Upgrade_Rapid.prototype = Object.create(Upgrade.prototype);
Upgrade_Rapid.prototype.constructor = Upgrade_Rapid;


function Upgrade_Laser() {
    Upgrade.call(this, 'turret2');

    this.infoText = "Laser";
    this.equipment = Laser;
}
Upgrade_Laser.prototype = Object.create(Upgrade.prototype);
Upgrade_Laser.prototype.constructor = Upgrade_Laser;


function RandomUpgrade(x, y) {
    var r = Math.floor(Math.random() * 4);
    switch (r) {
        case 0:
            
            break;
        case 1:
            
            break;
        case 2:
            
            break;
        case 3:
            
            break;
        default:
            console.log(r);
            break;
    }
    return new Upgrade(x, y, 'empty', i)
}