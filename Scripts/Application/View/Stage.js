var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var View;
(function (View) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(force, width, height, canvas) {
            this.setBounds(0, 0, width, height);
            canvas.setAttribute("height", height);
            canvas.setAttribute("width", width);
            _super.call(this, canvas);
        }
        return Stage;
    })(createjs.Stage);
    View.Stage = Stage;
})(View || (View = {}));
//# sourceMappingURL=Stage.js.map