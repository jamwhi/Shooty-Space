

// Requires: speed, maxSpeed, acceleration
// Moves straight at target at speed, which slowly increases with acceleration
function MoveTowardsTarget() {
    if (this.target == null) 
        return;


    if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration * this.game.time.physicsElapsed;
    }

    var vectorTo = Phaser.Point.subtract(this.target.position, this.position);
    vectorTo.setMagnitude(this.speed);
    this.body.velocity = vectorTo;
}

// Requires: maxSpeed, acceleration, newOffsetTimer
// Turns towards target with acceleration (can create orbiting behaviour)
function TurnTowardsTarget() {
    if (this.target == null) 
        return;


    //if (this.speed < this.maxSpeed) {
    //    this.speed += this.acceleration * this.game.time.physicsElapsed;
	//}
	
	// Add some randomness to the point being pursued

	this.newOffsetTimer -= this.game.time.physicsElapsed;

	if (this.newOffsetTimer <= 0) {
		this.newOffsetTimer = 1;
		this.randomTargetOffset = NewRandomOffset();
	}

    var vectorTo = Phaser.Point.add(Phaser.Point.subtract(this.target.position, this.position), this.randomTargetOffset);
    vectorTo.setMagnitude(this.acceleration);
    this.body.velocity = Phaser.Point.add(this.body.velocity, vectorTo);
    if (this.body.velocity.getMagnitude() > this.maxSpeed) {
        this.body.velocity.setMagnitude(this.maxSpeed);
    }
}

function NewRandomOffset() {
	return {x: Math.random() * 120 - 60, y: Math.random() * 120 - 60};
}

// Requires: maxSpeed, acceleration, slowDistance
// Turns towards target with acceleration and slows down when close and stops at target, i.e. 'arrives' 
function ArriveTowardsTarget() {
    if (this.target == null) 
        return;


    var vectorTo = Phaser.Point.subtract(this.target.position, this.position);
    vectorTo.setMagnitude(this.acceleration);
    this.body.velocity = Phaser.Point.add(this.body.velocity, vectorTo);

    var d = this.target.position.distance(this);
    var max = this.maxSpeed;
    if (d < this.slowDistance) {
        max = this.maxSpeed * d / this.slowDistance;
        // If max is low enough, just set it to 0
        if (max < 5) 
            max = 0;
    }
    
    if (this.body.velocity.getMagnitude() > max) {
        this.body.velocity.setMagnitude(max);
    }
}

// Wanders aimlessly around the screen
function Wander() {
    // Wander code
}