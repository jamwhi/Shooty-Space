

Pool.prototype = Object.create(Phaser.Group.prototype);
Pool.prototype.constructor = Pool;

function Pool(game, spriteType, instances, name, group) {
    if (group == null) {
        group = midground;
    }
    // Call super (Phaser.Group) from which the Pool is extended
    Phaser.Group.call(this, game, group, name);

    this.game = game;
    this.spriteType = spriteType; // Needed when creating new objects in the pool

    if (instances > 0) { // Preload instances to the group
        var sprite;
        
        for (var i = 0; i < instances; i++) {
            sprite = this.add(new spriteType(game)); // Add new sprite
        }
    }
}


Pool.prototype.create = function(x, y, data) {
    // Find the first child that has a false exist property:
    var obj = this.getFirstExists(false);

    if (!obj) {
      // We failed to find an available child, so create one now and add it to the pool
      obj = new this.spriteType(this.game);
      this.add(obj, true);
    }

    // Call the new object's Spawn method
    return obj.Spawn(x, y, data);
}