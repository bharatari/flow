/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="../../typings/createjs-lib/createjs-lib.d.ts" />

module View {
    export class Circle extends createjs.Shape {
        renderRadius: number;
        radius: number;
        vx: number;
        vy: number;
        _x: number;
        _y : number;
        collided: boolean;
        color: string;
        pickedUp: boolean = false;
        constructor(radius, x?, y?) {
            super();
            this.radius = this.renderRadius = radius;
            if(x && y) {
                this._x = x;
                this._y = y;
                this.vx = 0;
                this.vy = 0;
                this.graphics.drawCircle(this._x, this._y, this.renderRadius);
            }
        }
        move() {
            //Check for collision with boundary
            Data.reverse(this, View.height, View.width);
            //Move circle using velocity components
            this._x += this.vx;
            this._y += this.vy;
            //Slow down the velocity by a constant "inertia" factor
            Data.inertia(this);
            //Draw the circle
            this._draw();
        }
        _draw() {
            this.graphics.clear();
            this.graphics.beginFill(this.color).drawCircle(this._x, this._y, this.renderRadius);
        }
    }
}