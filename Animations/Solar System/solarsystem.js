class Body{
    constructor(x, y, fixed=false, vx=0, vy=0, hasField=false, mass=0, display=true, radius=5, color="white"){
        this.x = x;
        this.y = y;
        this.fixed = fixed;
        this.vx = vx;
        this.vy = vy;
        this.hasField = hasField;
        this.mass = mass;
        this.display = display;
        this.radius = radius;
        this.color = color;
    }
    speed(){
        var s = Math.sqrt(Math.pow(this.vx,2)+Math.pow(this.vy,2));
        if(typeof s == undefined){
            return 0;
        }else{
            return Math.sqrt(Math.pow(this.vx,2)+Math.pow(this.vy,2));
        }
    }
    draw(){
        drawCircle(this.x,this.y,this.radius,this.color);
    }
    move(){
        if(!this.fixed){
            this.x += this.vx;
            this.y += this.vy;
            var d;
            for(var i=0;i<bodies.length;i++){
                if(bodies[i]==this){
                    continue;
                }
                if(bodies[i].hasField){
                    d = distance(this,bodies[i]);
                    this.vx += bodies[i].mass*gravitation*(bodies[i].x-this.x)/Math.pow(d,3);
                    this.vy += bodies[i].mass*gravitation*(bodies[i].y-this.y)/Math.pow(d,3);
                }
            }
        }
    }
}

function e(id){
    return document.getElementById("id");
}

function getSize(){
    height = window.innerHeight-5;
    width = window.innerWidth-5;
    canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    ctx.translate(canvas.width/2, canvas.height/2);
}

function rad(angle) {
  return angle * (Math.PI / 180);
}

function clearScreen(alpha=0){
    if(alpha==0){
        ctx.clearRect(0-width/view.scale/2,0-height*view.scale/2,width/view.scale,height*view.scale);
    }else{
        ctx.fillStyle = "rgba(0, 0, 0, "+alpha+")";
        ctx.fillRect(0-width/view.scale/2,0-height*view.scale/2,width/view.scale,height*view.scale);
    }
}

function distance(p1,p2){
    return Math.abs(p1.x-p2.x)+Math.abs(p1.y-p2.y);
}

function angle(p1,p2){
    return Math.atan((p2.y-p1.y)/(p2.x-p1.x));
}

function drawCircle(x,y,radius,color){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

var bodies = new Array;

var view = {
	x: 0, // Center x and y
	y: 0, // 
	scale: 1 //n means: everything is n times as small/ (1/n) times as big 
}

function wheel(event){
    var delta = 0;
    if(!event){
        event = window.event;
    }
    if(event.wheelDelta){
            delta = event.wheelDelta/120;
    }else if(event.detail){
        delta = -event.detail/3;
    }
    if(delta){
        handle(delta);
    }
    if(event.preventDefault){
        event.preventDefault();
    }
    event.returnValue = false;
}

function handle(delta){
    if (delta < 0){
        ctx.scale(1.1,1.1);
        view.scale *= 1.1;
    }else{
        ctx.scale(0.9,0.9);
        view.scale *= 0.9;
    }
    clearScreen();
}

function main(){
    clearScreen(0.2);
    for(var i=0;i<bodies.length;i++){
        bodies[i].draw();
        bodies[i].move();
    }
}

var ctx;
var canvas;
var clock;




/*
    * HOW TO CREATE NEW BODIES:
    * 
    * Below this comment you see the section where the bodies are initialized.
    * The syntax for changing or creating them is as follows: 
    * 
    *    var varName = new Body(x,y,fixed,vx,vy,hasField,mass,display,radius,color);
    *    bodies.push(varName);
    * 
    * These Properties have the following meaning:
    *
    * x,y:      Starting position. The coordinate system is centered around 0,0     (numbers)
    * fixed:    If you want a body to be fixed and unable to move, set this to true (boolean)
    * vx,vy:    Starting velocity in x and y direction                              (numbers)
    * hasField: This property tells if the body should have its own gratity field   (boolean)
    * mass:     Mass of the body. if hasField is true, it sets the gravity strength (number) 
    * display:  If you want to hide your body, set this to false                    (boolean)
    * radius:   Display radius in pixels (without zoom)                             (number)
    * color:    Color of the body                                                   (color str)
    *
    * To change the overall gravitation, you can change the gravitation var as well!
    *
    *
    * If you created a cool systhem, leave it in the comments!
    * In a future version I'm going to add those as presets with your name!
    *
    *
*/


var earth = new Body(100,0,false,0,2,true,5,true,2,"blue");
bodies.push(earth);
var moon = new Body(105,0,false,0,1.25,true,0.3,true,1,"gray");
bodies.push(moon);
var mars = new Body(150,0,false,0,1.5,true,10,true,3,"red");
bodies.push(mars);
var sun = new Body(0,0,true,0,-0.002,true,1000,true,10,"yellow");
bodies.push(sun);

var gravitation = 1;






function start(){
    window.addEventListener('resize', getSize);
    if(window.addEventListener){
        /** DOMMouseScroll is for mozilla. */
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    /** IE/Opera. */
    window.onmousewheel = document.onmousewheel = wheel;
    getSize();
    clock = setInterval(main, 33); //Call main function 30 times per second
    
}