

function MoveTowardsTarget() {
    if (this.target == null) return;


    if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration * this.game.time.physicsElapsed;
    }

    var vectorTo = Phaser.Point.subtract(this.target.position, this.position);
    vectorTo.setMagnitude(this.speed);
    this.body.velocity = vectorTo;
}

function TurnTowardsTarget() {
    if (this.target == null) return;


    //if (this.speed < this.maxSpeed) {
    //    this.speed += this.acceleration * this.game.time.physicsElapsed;
    //}

    var vectorTo = Phaser.Point.subtract(this.target.position, this.position);
    vectorTo.setMagnitude(this.acceleration);

    this.body.velocity = Phaser.Point.add(this.body.velocity, vectorTo);
    if (this.body.velocity.getMagnitude() > this.maxSpeed) {
        this.body.velocity.setMagnitude(this.maxSpeed);
    }
}