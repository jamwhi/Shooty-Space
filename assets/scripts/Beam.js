

function Beam (game) {
    this.game = game;

    Phaser.Sprite.call(this, game, 0, 0, "beam");
    
    this.exists = false;
    this.alive = false;

    //this.minSize = 0.2;
    this.maxSize = 10;
    this.size = this.maxSize;
    this.timeAlive = 0.5;
    this.time = 0;

    this.power = 1;
    this.maxWidth = 30;
    this.beamWidth = 1;

    this.x2 = 0;
    this.y2 = 0;

    this.anchor.setTo(0, 0.5);
}

Beam.prototype = Object.create(Phaser.Sprite.prototype);
Beam.prototype.constructor = Beam;

Beam.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.exists = true;
    this.alive = true;
    this.time = 0;
}

Beam.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);
    this.power = data.power
    this.x = x;
    this.y = y;
    this.rotation = data.direction;
    this.x2 = this.x + Math.cos(this.rotation) * 1000;
    this.y2 = this.y + Math.sin(this.rotation) * 1000;

    this.size = Math.max(0.5, this.power * this.maxSize);
    this.beamWidth = this.power * this.maxWidth;

    this.alive = true;
    this.exists = true;

    this.Fire();
}

Beam.prototype.update = function() {
    if (this.alive) {
        this.time += this.game.time.physicsElapsed;

        this.scale.setTo(1, (1 - (this.time / this.timeAlive)) * this.size);

        if (this.time >= this.timeAlive) {
            this.kill();
        }
    }
}

Beam.prototype.Fire = function() {
    var ray = new Phaser.Line(this.x, this.y, this.x2, this.y2);
    //var hits = this.RayHit(ray, starPool);
    var hits = this.RayHitCircles(ray, starPool);

    hits.forEach(function(o) {
        this.HitStar(o);
    }, this)

    //this.game.Physics.Arcade.isPaused = true;
}

// Given a ray and an array of objects to intersect with, 
// returns an array of objects within that group that the ray intersects with 
// or null if the ray does not intersect any
Beam.prototype.RayHit = function(ray, hitGroup) {

    var hits = [];
    hitGroup.forEachAlive(function(o) {

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

Beam.prototype.RayHitCircles = function(ray, hitGroup) {
    var hits = [];
    
    hitGroup.forEachAlive(function(o) {
        var closestPoint = this.ClosestPointOnBeamToPoint(o, true);
        if (closestPoint.distance(o) <= o.radius + this.beamWidth) {
            hits.push(o);
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

Beam.prototype.ClosestPointOnBeamToPoint = function(P, clamp) {
    //def GetClosestPoint(A, B, P)
    var A = new Phaser.Point(this.x, this.y);
    var B = new Phaser.Point(this.x2, this.y2);

    var AP = new Phaser.Point(P.x - A.x, P.y - A.y)     // Storing vector A->P
    var AB = new Phaser.Point(B.x - A.x, B.y - A.y)     // Storing vector A->B

    var ABsq = AB.getMagnitudeSq();

    var APdotAB = AP.dot(AB);

    var t = APdotAB / ABsq; // The normalized "distance" from A to closest point

    if (clamp) {
        if (t < 0) {
            t = 0;
        } else if (t > 1) {
            t = 1;
        }
    }
    return new Phaser.Point(A.x + AB.x*t, A.y + AB.y*t) // Add the distance to A, moving towards B
}