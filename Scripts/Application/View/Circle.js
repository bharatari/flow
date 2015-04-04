/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="../../typings/createjs-lib/createjs-lib.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var View;
(function (View) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(radius, x, y) {
            _super.call(this);
            this.pickedUp = false;
            this.radius = this.renderRadius = radius;
            if (x && y) {
                this._x = x;
                this._y = y;
                this.vx = 0;
                this.vy = 0;
                this.graphics.drawCircle(this._x, this._y, this.renderRadius);
            }
        }
        Circle.prototype.move = function () {
            //Check for collision with boundary
            Data.reverse(this, View.height, View.width);
            //Move circle using velocity components
            this._x += this.vx;
            this._y += this.vy;
            //Slow down the velocity by a constant "inertia" factor
            Data.inertia(this);
            //Draw the circle
            this._draw();
        };
        Circle.prototype._draw = function () {
            this.graphics.clear();
            this.graphics.beginFill(this.color).drawCircle(this._x, this._y, this.renderRadius);
        };
        return Circle;
    })(createjs.Shape);
    View.Circle = Circle;
})(View || (View = {}));
//# sourceMappingURL=Circle.js.map