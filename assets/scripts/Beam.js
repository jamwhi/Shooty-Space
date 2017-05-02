

Beam.prototype = Object.create(Phaser.Sprite.prototype);
Beam.prototype.constructor = Beam;

function Beam (game) {
    this.game = game;

    Phaser.Sprite.call(this, game, 0, 0, "beam2");
    this.animations.add('firing');

    this.exists = false;
    this.alive = false;

    //this.minSize = 0.2;
    this.pixelWidth = 441; // This is the number of pixels in the texture itself. Must be changed based on imported texture
    this.pixelsPreOffset = 23;
    this.pixelsPostOffset = 23;

    this.maxSize = 3;
    this.size = this.maxSize;
    this.minTimeAlive = 0.3;
    this.maxTimeAlive = 0.8;
    this.timeAlive = 0.1;
    this.time = 0;

    this.timeBetweenHits = 0.1;
    this.timeSinceLastHit = 0;

    this.power = 1;
    this.piercePower = 0.4;
    this.piercing = false;
    this.maxWidth = 50;
    this.minWidth = 15;
    this.beamWidth = 15;

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;

    this.minDamage = 50;
    this.maxDamage = 200;
    this.hitDamage = 50;

    this.anchor.setTo(0, 0.5);
}


Beam.prototype.stdReset = function(x, y) {
    this.reset(x, y);
    this.exists = true;
    this.alive = true;
    this.time = 0;
    this.scale.setTo(2, 1);
}

Beam.prototype.Spawn = function(x, y, data) {
    // Shoot it in the right direction
    this.stdReset(x, y);
    this.power = data.power
    if (this.power >= this.piercePower) {
        this.piercing = true;
    } else {
        this.piercing = false;
    }
    this.rotation = data.direction;
    this.x1 = x;
    this.y1 = y;
    this.x2 = this.x + Math.cos(this.rotation) * 1000;
    this.y2 = this.y + Math.sin(this.rotation) * 1000;

    this.size = Math.max(0.5, this.power * this.maxSize);
    this.timeAlive = this.minTimeAlive + this.power * (this.maxTimeAlive - this.minTimeAlive);
    this.beamWidth = this.minWidth + this.power * (this.maxWidth - this.minWidth);
    this.hitDamage = this.minDamage + (this.maxDamage - this.minDamage) * this.power;

    this.alive = true;
    this.exists = true;

    

    this.animations.play('firing', 60, true);

    this.Fire();

    this.x = this.x1 + Math.cos(this.rotation) * -this.pixelsPreOffset * 2 * this.scale.x;
    this.y = this.y1 + Math.sin(this.rotation) * -this.pixelsPreOffset * 2 * this.scale.x;
}

Beam.prototype.update = function() {
    if (this.alive) {
        this.time += this.game.time.physicsElapsed;
        

        var t = this.time / this.timeAlive;
        t = t * t * t * t;
        this.scale.y = (1 - t) * this.size;

        if (this.piercing) {
            this.timeSinceLastHit += this.game.time.physicsElapsed;
            if (this.timeSinceLastHit > this.timeBetweenHits) {
                this.timeSinceLastHit -= this.timeBetweenHits;
                this.Fire();
            }
        }
       

        if (this.time >= this.timeAlive) {
            this.kill();
        }
    }
}

Beam.prototype.Fire = function() {
    var ray = new Phaser.Line(this.x1, this.y1, this.x2, this.y2);
    //var hits = this.RayHit(ray, starPool);
    var hits = this.RayHitCircles(ray, [starPool, squarePool]);

    if (hits.length > 0) {

        if (!this.piercing) {
            var c = this.ClosestHit(hits);
            this.HitStar(c);
            this.scale.x = (c.position.distance(this) - c.radius) / (this.pixelWidth - this.pixelsPreOffset - this.pixelsPostOffset);
        } else {
            hits.forEach(function(o) {
                this.HitStar(o);
            }, this)
        }
    }
}


Beam.prototype.ClosestHit = function(hits) {
    var closest = hits[0];
    
    var closestD = hits[0].position.distance(this);
    var first = true;

    hits.forEach(function(hit) {
        
        if (first == true) {
            first = false;
        } else {
            var d = hit.position.distance(this);
            if (d < closestD) {
                closestD = d;
                closest = hit;
            }
        }

        
    }, this);

    return closest;
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

Beam.prototype.RayHitCircles = function(ray, hitGroups) {
    var hits = [];
    
    hitGroups.forEach(function(g) {
        g.forEachAlive(function(o) {
            var closestPoint = this.ClosestPointOnBeamToPoint(ray, o, true);
            if (closestPoint.distance(o) <= o.radius + this.beamWidth) {
                hits.push(o);
            }
        }, this);
    }, this)

    return hits;
}

Beam.prototype.HitStar = function(star) {
    star.Hit(this.hitDamage);
    if (this.power >= 1) {

    } else {
        //this.Explode();
    }
}

Beam.prototype.ClosestPointOnBeamToPoint = function(ray, P, clamp) {
    //def GetClosestPoint(A, B, P)
    //var A = new Phaser.Point(this.x1, this.y1);
    //var B = new Phaser.Point(this.x2, this.y2);
    var A =  ray.start;
    var B = ray.end;

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