var Data;
(function (Data) {
    //This method uses simple math to check if two circles have collided
    function checkCollision(circle1, circle2) {
        if (circle1 == circle2) {
            return false;
        }
        var exp1 = Math.pow((circle2._x - circle1._x), 2);
        var exp2 = Math.pow((circle2._y - circle1._y), 2);
        var expR = Math.pow((circle1.radius + circle2.radius), 2);
        if (exp1 + exp2 < expR) {
            return true;
        }
        else {
            return false;
        }
    }
    Data.checkCollision = checkCollision;
    //Multiplies the vx and vy of a circle by a constant factor to simulate inertia
    function inertia(circle) {
        circle.vx = circle.vx * (1 - View.inertia);
        circle.vy = circle.vy * (1 - View.inertia);
    }
    Data.inertia = inertia;
    //Reverses the circle's velocity if collided with the boundaries of the canvas
    function reverse(circle, height, width) {
        if (circle._x + (circle.radius * 2) >= width) {
            circle._x = width - (circle.radius * 2) - 1;
            circle.vx *= -1;
        }
        else if (circle._x - (circle.radius * 2) <= 0) {
            circle._x = (circle.radius * 2) + 1;
            circle.vx *= -1;
        }
        if (circle._y + (circle.radius * 2) >= height) {
            circle._y = height - (circle.radius * 2) - 1;
            circle.vy *= -1;
        }
        else if (circle._y - (circle.radius * 2) <= 0) {
            circle._y = (circle.radius * 2) + 1;
            circle.vy *= -1;
        }
    }
    Data.reverse = reverse;
    //Reacts to two circles colliding
    function collide(circle1, circle2) {
        //If these two circles have already collided in this frame, don't collide them
        if (circle1.collided && circle2.collided) {
            return;
        }
        var x1 = circle1._x;
        var x2 = circle2._x;
        var y1 = circle1._y;
        var y2 = circle2._y;
        var t1 = ((2 * circle1.vx * (x1 - x2)) + (2 * circle1.vy * (y1 - y2))) / (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        var t2 = ((2 * circle2.vx * (x1 - x2)) + (2 * circle2.vy * (y1 - y2))) / (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        circle2._x = (((circle1.radius + circle2.radius + 1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))) * (x2 - x1)) + x1;
        circle2._y = (((circle1.radius + circle2.radius + 1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))) * (y2 - y1)) + y1;
        circle1.vx = circle1.vx - (t1 * (x1 - x2));
        circle1.vy = circle1.vy - (t1 * (y1 - y2));
        circle2.vx = circle2.vx - (t2 * (x1 - x2));
        circle2.vy = circle2.vy - (t2 * (y1 - y2));
        var cm1 = Math.sqrt(Math.pow(circle1.vx, 2) + Math.pow(circle1.vy, 2));
        var cm2 = Math.sqrt(Math.pow(circle2.vx, 2) + Math.pow(circle2.vy, 2));
        if (cm1 < 0.01) {
            circle1.vx = ((cm2 / 2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))) * (x1 - x2);
            circle1.vy = ((cm2 / 2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))) * (y1 - y2);
            console.log("cm1 " + cm1);
        }
        else {
            var scalar = (((cm1 + cm2) / 2) / cm1);
            circle1.vx *= scalar;
            circle1.vy *= scalar;
            console.log("cm1 " + cm1);
            console.log("scalar " + scalar);
        }
        if (cm2 < 0.01) {
            circle2.vx = ((cm1 / 2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))) * (x2 - x1);
            circle2.vy = ((cm1 / 2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))) * (y2 - y1);
            console.log("cm2 " + cm2);
        }
        else {
            var scalar2 = (((cm1 + cm2) / 2) / cm2);
            circle2.vx *= scalar2;
            circle2.vx *= scalar2;
            console.log("cm2 " + cm2);
            console.log("scalar2 " + scalar2);
        }
        //If the mouse is currently being clicked on for the slingshot animation, don't give it a velocity
        if (circle1.pickedUp) {
            circle1.vx = 0;
            circle1.vy = 0;
        }
        if (circle2.pickedUp) {
            circle2.vx = 0;
            circle2.vy = 0;
        }
        circle1.collided = true;
        circle2.collided = true;
    }
    Data.collide = collide;
    function resetCollisions(circles) {
        for (var i = 0; i < circles.length; i++) {
            circles[i].collided = false;
        }
    }
    Data.resetCollisions = resetCollisions;
    function radiusIncrease(circle, mouse) {
        var dx = circle._x - mouse._x;
        var dy = circle._y - mouse._y;
        var distance = Math.sqrt((dx * dx) + (dy * dy));
        var ratio = 20 / distance;
        if (ratio > 1) {
            ratio = 1;
        }
        circle.renderRadius = (5 * circle.radius) * ratio;
        circle.vx *= 1;
        circle.vy *= 1;
    }
    Data.radiusIncrease = radiusIncrease;
    function radiusReset(circle) {
        circle.renderRadius = circle.radius;
    }
    Data.radiusReset = radiusReset;
    function sign(x) {
        return (x > 0) - (x < 0);
    }
    Data.sign = sign;
})(Data || (Data = {}));
//# sourceMappingURL=Core.js.map