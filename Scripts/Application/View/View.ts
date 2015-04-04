/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="../../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="Circle.ts" />
/// <reference path="Stage.ts" />
/// <reference path="../Data/Core.ts" />

module View {
    export var circleCount: number;
    export var inertia: number;
    export var maxradius: number;
    export var maxvelocity: number;
    //Stage from EaselJS Library
    export var stage: createjs.Stage;
    //Quad Tree
    export var tree: any;
    //Array of all circles in the simulation
    export var circles: Circle[];
    export var width: number;
    export var height: number;
    var mouseX: number = null;
    var mouseY: number = null;
    var mouseDragX: number;
    var mouseDragY: number;
    //This method is called to setup the simulation
    export function setupView(circleCount, inertia, maxradius, maxvelocity, width, height) {
        this.circleCount = circleCount;
        this.inertia = inertia;
        this.maxradius = maxradius;
        this.maxvelocity = maxvelocity;
        this.width = width;
        this.height = height;
        //Get canvas HTML element from index.html
        var canvas = document.getElementById("main");
        View.stage = new View.Stage(0.1, width, height, canvas);
        View.tree = new QuadTree({
            x: 0,
            y: 0,
            width: width,
            height: height
        });
        View.circles = new Array();
        var colors = [
            "#FF0000",
            "#000000",
           // "#FFFF00",
            "#919191"
        ];
        //Initializing circles and adding them to the stage and quadtree
        for (var i = 0; i < circleCount; i++) {
            var circle = new View.Circle(Math.ceil((Math.random() + 0.5) * maxradius) + 2);
            circle.color = colors[Math.floor(Math.random()*colors.length)];
            circle._x = Math.random() * width;
            circle._y = Math.random() * height;
            circle.vx = Math.random() * maxvelocity;
            circle.vy = Math.random() * maxvelocity;
            circle.snapToPixel = true;
            circle.graphics.beginFill(circle.color).drawCircle(circle._x, circle._y , circle.radius);
            //The following three events are used for the "slingshot" mouse interaction
            circle.addEventListener("mousedown", mouseDown);
            circle.addEventListener("pressmove", pressMouse);
            circle.addEventListener("pressup", pressUp);
            View.tree.insert(circle);
            View.stage.addChild(circle);
            View.circles.push(circle);
        }
        View.stage.update();
        //Listening for mouse movement for mouse hover animation
        View.stage.addEventListener("stagemousemove", mouseMove);
        //This ticker runs at 60 frames per second to render our circles
        createjs.Ticker.addEventListener("tick", updateStage);
        createjs.Ticker.setFPS(60);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSound("Assets/Breeze.mp3", "sound");
        createjs.Sound.on("fileload", playSong, this);
    }
    function playSong() {
        var instance = createjs.Sound.play("sound");
        instance.on("complete", playSong);
    }
    function mouseDown(event: createjs.MouseEvent) {
        this.mouseDragX = event.stageX;
        this.mouseDragY = event.stageY;
        event.target.pickedUp = true;
    }
    function pressMouse(event: createjs.MouseEvent) {
        event.target.vx = 0;
        event.target.vy = 0;
        event.target._x = event.stageX;
        event.target._y = event.stageY;
    }
    function pressUp(event: createjs.MouseEvent) {
        var dx = this.mouseDragX - event.stageX;
        var dy = this.mouseDragY - event.stageY;
        dx = dx / 30;
        dy = dy / 30;
        event.target.vx = dx;
        event.target.vy = dy;
        event.target.pickedUp = false;
    }
    function mouseMove(event: createjs.MouseEvent) {
        this.mouseX = event.stageX;
        this.mouseY = event.stageY;
    }
    export function updateStage(event) {
        for (var i = 0; i < View.circles.length; i++) {
            //If the mouse is on the canvas, run the mouse hover animation
            if(this.mouseX && this.mouseY) {
                var mouseCircle = new Circle(200, this.mouseX, this.mouseY);
                //Check if circle "collides" with mouse's radius
                if(Data.checkCollision(View.circles[i], mouseCircle)){
                    //Increase the circle's radius
                    Data.radiusIncrease(View.circles[i], mouseCircle);
                }
                else {
                    //If the mouse hasn't collided with the circle, make sure to reset the circle's radius
                    Data.radiusReset(View.circles[i]);
                }
            }
        }
        //Check for collisions between circles using a QuadTree
        checkCollisions();
        for (var i = 0; i < View.circles.length; i++) {
            //Render the all of the circles on the stage
            View.circles[i].move();
        }
        View.stage.update(event);
    }
    export function checkCollisions() {
        for (var i = 0; i < View.circles.length; i++) {
            var circle = View.circles[i];
            //Spatial Partitioning with QuadTree
            var array = View.tree.retrieve(circle);
            for (var e = 0; e < array.length; e++) {
                if (Data.checkCollision(View.circles[i], array[e])) {
                    Data.collide(View.circles[i], array[e]);
                }
            }
        }
        //Reset the collided boolean value for all circles
        Data.resetCollisions(circles);
    }
    //This method renders the first few "intro" screens using CSS Animations
    export function start() {
        $("#overlay").removeClass("invisible").addClass("opaque").addClass("animate");
        $("#overlay-title").removeClass("invisible").addClass("animate");
        $("#overlay-controls").addClass("animate");
        $("#title").addClass("animate");
        setTimeout(function() {
            $("#overlay-title").addClass("opaque").removeClass("transparent");
            $("#title").addClass("fadeUp");
        }, 1000);
        setTimeout(function() {
            $("#overlay-title").addClass("transparent").removeClass("opaque");
        }, 4000);
        setTimeout(function() {
            $("#overlay-title").addClass("invisible");
            $("#overlay-controls").removeClass("invisible");
        }, 5000);
        setTimeout(function() {
            $("#overlay-controls").addClass("opaque").removeClass("transparent");
        }, 6000);
        $("#start").click(function() {
            var circles = $("#circles").val();
            var inertia = $("#inertia").val();
            var maxradius = $("#maxradius").val();
            var maxvelocity = $("#maxvelocity").val();
            View.setupView(circles, inertia, maxradius, maxvelocity, 1000, 800);
            $("#overlay").addClass("transparent").removeClass("opaque");
            setTimeout(function() {
                $("#overlay").addClass("invisible");
            }, 1000);
        });
    }
}
