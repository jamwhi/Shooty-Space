

function Beam (game) {
    this.game = game;

    // Create a bitmap texture for drawing lines
    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.lineWidth = "4";
    //this.game.add.image(0, 0, this.bitmap);

    Phaser.Sprite.call(this, game, 0, 0, this.bitmap);
    
    this.exists = false;
    this.alive = false;

    //this.minSize = 0.2;
    this.maxSize = 1;
    this.size = this.maxSize;
    this.timeAlive = 0.5;
    this.time = 0;
    this.direction = 0;

    this.power = 1;

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
}

Beam.prototype = Object.create(Phaser.Sprite.prototype);
Beam.prototype.constructor = Beam;

Beam.prototype.stdReset = function(x, y) {
    this.reset(0, 0);
    this.exists = true;
    this.alive = true;
    this.time = 0;
}

Beam.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);
    this.power = data.power
    this.x1 = x;
    this.y1 = y;
    this.direction = data.direction;
    this.x2 = this.x1 + Math.cos(this.direction) * 500;
    this.y2 = this.y1 + Math.sin(this.direction) * 500;
    //this.x2 = 50;
    //this.y2 = 50;

    this.alive = true;
    this.exists = true;

    this.Fire();
}

Beam.prototype.update = function() {
    if (this.alive) {
        this.time += this.game.time.physicsElapsed;

        this.Draw();

        if (this.time >= this.timeAlive) {
            // Clear the bitmap where we are drawing
            this.bitmap.clear();
            //this.bitmap.destroy()
            this.kill();
        }
    }
}

Beam.prototype.Draw = function() {
    // Clear the bitmap where we are drawing
    this.bitmap.clear();

    // Draw the line
    this.bitmap.context.beginPath();
    this.bitmap.context.moveTo(this.x1, this.y1);
    this.bitmap.context.lineTo(this.x2, this.y2);
    this.bitmap.context.stroke();

    // This just tells the engine it should update the texture cache
    this.bitmap.dirty = true;
}

Beam.prototype.Fire = function() {
    var ray = new Phaser.Line(this.x1, this.y1, this.x2, this.y2);
    var hits = this.RayHit(ray, starPool);

    hits.forEach(function(o) {
        this.HitStar(o);
    }, this)

    //this.game.Physics.Arcade.isPaused = true;
}

// Given a ray and an array of objects to intersect with, 
// returns an array of objects within that group that the ray intersects with 
// or null if the ray does not intersect any
var allLines = [];
Beam.prototype.RayHit = function(ray, hitGroup) {

    var hits = [];
    allLines = [];
    hitGroup.forEachAlive(function(o) {
        //console.log(o);
        // Create an array of lines that represent the four edges of each wall
        var lines = [
            new Phaser.Line(o.x - o.width / 2, o.y - o.height / 2,
                            o.x + o.width / 2, o.y - o.height / 2),
            new Phaser.Line(o.x - o.width / 2, o.y - o.height / 2,
                            o.x - o.width / 2, o.y + o.height / 2),
            new Phaser.Line(o.x + o.width / 2, o.y - o.height / 2,
                            o.x + o.width / 2, o.y + o.height / 2),
            new Phaser.Line(o.x - o.width / 2, o.y + o.height / 2,
                            o.x + o.width / 2, o.y + o.height / 2)
        ];
        allLines.push(lines);
        // Test each of the edges in this object against the ray.
        // If the ray intersects any of the edges then the object must be in the way.
        for(var i = 0; i < lines.length; i++) {
            var intersect = Phaser.Line.intersects(ray, lines[i]);
            if (intersect) {
                hits.push(o);
                break;
                // Find the closest intersection
                //distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                //if (distance < distanceToWall) {
                //    distanceToWall = distance;
                //    closestIntersection = intersect;
                //}
            }
        }
    }, this);
    
    return hits;
}

Beam.prototype.HitStar = function(star) {
    star.Explode();
    if (this.power >= 1) {

    } else {
        //this.Explode();
    }

    score += 1;
    scoreText.text = 'Score: ' + score;
}