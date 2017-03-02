///// my init
var sunAngle = -1;
var sunPos = {x:0, y:0};
var sunCenter = {x:0, y:0};
var sunRadius;
var sunAngleIncrement= (Math.PI*2)/360;

/////// define event listener
var event = new CustomEvent("sunMoved", {});
// Add an event listener
document.addEventListener("sunMoved", function(e) {
//    console.log(e.clientX + ", " + e.clientY); // Prints "Example of an event"
    if (mouse !== undefined) myOnMouseMove(e);
});

var cycleOfDay = 60000; // miliseconds
var cycleStage = 0;
var fps = 12;
var cycleIncrement = 1000/fps;
var dayState;
var percentDay = 0.4;
var percentNight = 0.2;
var percentDusk = 0.2;
var stopAfter = 3;

var previousState = "";

everyTick();

var mouse = {x: 0, y: 0};
var myWidth = 0, myHeight = 0;
var mouseIsDown = false;
var mouseIsDownDivision = false;

// document.addEventListener('mousemove', myOnMouseMove, false);
// // // // // // // // // // nothin but functions
function everyTick() {
//    console.log("EVERYTIC");
    var screenSize = currentScreenSize();
    var x1 = screenSize.x/2;
    var y1 = screenSize.y;
    var xa = x1*6;
    var a = (0.75*y1)/(1+ Math.cos(2*Math.PI*x1/xa));
    var x = (cycleStage/cycleOfDay)*xa;
    var fx = a*(1-Math.cos(2*Math.PI*x/xa));
    var xoffset = x-(xa/2)+x1;
//    if (xoffset < 0) xoffset = 0;
//    if (xoffset > screenSize.x) xoffset = screenSize.x;
//    console.log( xoffset.toString() + ", " + fx.toString());
    event.clientX = xoffset;
    event.clientY = screenSize.y - fx;
    document.dispatchEvent(event);
    cycleStage += cycleIncrement;
    if (cycleStage > cycleOfDay) cycleStage -= cycleOfDay;

    var mL;
    if (cycleStage/cycleOfDay < .5) {
        mL = (cycleStage / cycleOfDay) * 200;
    }
    else {
        mL = (100 - (cycleStage / cycleOfDay) * 100) * 2;
    }
    mL = 100- (10 + mL*.5);
    mL = mL.toFixed(0);
    console.log(mL);

    if (document.getElementsByTagName("BODY")[0]) {
        if (sunInButton)
            document.getElementsByTagName("BODY")[0].style.color = "black";
        else
            document.getElementsByTagName("BODY")[0].style.color = "hsl(123, 50%, " + mL + "%)";

    }
    setTimeout(function () {
        everyTick();
    }, cycleIncrement);
//    }
}

function stateOfDay () {
    var dayState;
    if (cycleStage/cycleOfDay >= 1) cycleStage = 0;
    if (cycleStage/cycleOfDay < percentDay) dayState = "Day";
    else if (cycleStage/cycleOfDay < percentDay + percentDusk)  dayState = "Dusk";
    else if (cycleStage/cycleOfDay < percentDay + percentDusk + percentNight)  dayState = "Night";
    else dayState = "Dawn";

    return dayState;
}

function toRad(degrees) { return (degrees/360)*(Math.PI*2); }
function toDeg(radians) { return (radians/(Math.PI*2))*360; }

function currentScreenSize() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {x:x, y:y};
}
function CarculateCircleCenter(p1, p2, p3) {
    var center = {x:0, y:0};
    var ma = (p2.y - p1.y) / (p2.x - p1.x);
    var mb = (p3.y - p2.y) / (p3.x - p2.x);
    center.x = (ma * mb * (p1.y - p3.y) + mb * (p1.x + p2.x) - ma * (p2.x + p3.x)) / (2 * (mb - ma));
    center.y = (-1 / ma) * (center.x - (p1.x + p2.x) / 2) + (p1.y + p2.y) / 2;
    return center;
}



function myOnMouseMove(e) {

    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY;
    updateDimensions();

    //if(mouseIsDown) {
    document.getElementById("sun").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';

    document.getElementById("sunDay").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';

    document.getElementById("sunSet").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';

    document.getElementById("waterReflectionContainer").style.perspectiveOrigin = (mouse.x/myWidth*100).toString() + "% -15%";
    document.getElementById("waterReflectionMiddle").style.left = (mouse.x-myWidth-(myWidth*0.03)).toString() + "px";

    var bodyWidth = document.getElementsByTagName("body")[0].clientWidth; ///////////////////////////////////////////////////////////////////// herey!!!!!

    document.getElementById("sun").style.width = (bodyWidth);
    document.getElementById("sun").style.left = "0px";
    document.getElementById("sunDay").style.width = (bodyWidth);
    document.getElementById("sunDay").style.left = "0px";

    var sky = document.getElementById("sun");
    var water = document.getElementById("water");
    var waterHeight = water.clientHeight;
    var skyHeight = sky.clientHeight;
    var skyRatio = mouse.y / skyHeight;
    var waterRatio = waterHeight / myHeight;
    document.getElementById("darknessOverlay").style.opacity = Math.min((mouse.y-(myHeight/2)) / (myHeight/2), 1);
    document.getElementById("darknessOverlaySky").style.opacity = Math.min((mouse.y-(myHeight*7/10)) / (myHeight-(myHeight*7/10)), 1);
    document.getElementById("moon").style.opacity = Math.min((mouse.y-(myHeight*9/10)) / (myHeight-(myHeight*9/10)), 0.65);
    document.getElementById("horizonNight").style.opacity = (mouse.y-(myHeight*4/5)) / (myHeight-(myHeight*4/5));

    document.getElementById("starsContainer").style.opacity = (mouse.y/myHeight-0.6);

    document.getElementById("waterDistance").style.opacity = (mouse.y/myHeight+0.6);
    document.getElementById("sunDay").style.opacity = (1-mouse.y/myHeight);
    document.getElementById("sky").style.opacity = Math.min((1-mouse.y/myHeight), 0.99);

    document.getElementById("sunSet").style.opacity = (mouse.y/myHeight-0.2);



    if(mouse.y > 0) {
        var clouds = document.getElementsByClassName("cloud");
        for(var i=0; i<clouds.length; i++) {
            clouds[i].style.left = Math.min(myWidth*(Math.pow(mouse.y,2)/Math.pow(myHeight/2,2)) * -1, 0);
        }
        //}

        var stars = document.getElementsByClassName('star');
        for(var i=0; i<stars.length; i++) {
            stars[i].style.opacity = (mouse.y/myHeight-0.6);
        }


        if(mouse.y > myHeight/2) {
            document.getElementById("sun").style.opacity = Math.min((myHeight-mouse.y) / (myHeight/2) + 0.2, 0.5);
            document.getElementById("horizon").style.opacity = (myHeight-mouse.y) / (myHeight/2) + 0.2;

            document.getElementById("waterReflectionMiddle").style.opacity = (myHeight-mouse.y) / (myHeight/2) - 0.1;
        } else {
            document.getElementById("horizon").style.opacity = Math.min(mouse.y / (myHeight/2), 0.99);

            document.getElementById("sun").style.opacity = Math.min(mouse.y / (myHeight/2), 0.5);
            document.getElementById("waterReflectionMiddle").style.opacity = mouse.y / (myHeight/2) - 0.1;
        }

    } else if (mouseIsDownDivision) {
        var sunElement = document.getElementById("sun");
        var water = document.getElementById("water");
        var division = document.getElementById("division");
        sunElement.style.height = (mouse.y).toString() + "px";
        document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
        division.style.top = (mouse.y).toString() + "px";
        var waterHeight = myHeight-mouse.y;
        water.style.height = waterHeight.toString() + "px";

        document.getElementById("sun").style.height = (mouse.y).toString() + "px";
        document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
        document.getElementById("horizon").style.height = (mouse.y).toString() + "px";
        document.getElementById("waterDistance").style.height = (myHeight-mouse.y).toString() + "px";
        document.getElementById("oceanRippleContainer").style.height = (myHeight-mouse.y).toString() + "px";
        document.getElementById("darknessOverlay").style.height = (myHeight-mouse.y).toString() + "px";
    }
}
function updateDimensions() {
    if( typeof( event.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = event.innerWidth;
        myHeight = event.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {

        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {

        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
}

function startMove() {
    mouseIsDown = true;
}

function stopMove() {
    mouseIsDown = false;
    mouseIsDownDivision = false;
    var sky = document.getElementById("sun");
}

function startDraggingDivision() {
    mouseIsDownDivision = true;
}

function windowResize() {
    updateDimensions();
    var skyHeight = document.getElementById("horizon").clientHeight;

    // update to new sky height
    skyHeight = document.getElementById("sun").clientHeight;
    document.getElementById("waterDistance").style.height = myHeight - skyHeight;
    document.getElementById("division").style.top = skyHeight;
}
function rgb2hsv(R, G, B) {
    var var_R = ( R / 255 );                     //RGB from 0 to 255
    var var_G = ( G / 255 );
    var var_B = ( B / 255 );

    var S, H, del_R, del_G, del_B;

    var var_Min = min( var_R, var_G, var_B );    //Min. value of RGB
    var var_Max = max( var_R, var_G, var_B );    //Max. value of RGB
    var del_Max = var_Max - var_Min;             //Delta RGB value

    var V = var_Max;

    if ( del_Max == 0 )                     //This is a gray, no chroma...
    {
        H = 0;                                //HSV results from 0 to 1
        S = 0;
    }
    else                                    //Chromatic data...
    {
        S = del_Max / var_Max;

        del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
        del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
        del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

        if      ( var_R == var_Max ) H = del_B - del_G;
        else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B;
        else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R;

        if ( H < 0 ) H += 1;
        if ( H > 1 ) H -= 1;
    }
    return {H:H, S:S, del_R:del_R, del_G:del_G, del_B:del_B, V:V};
}
/*
 var screenSize = currentScreenSize();
 sunCenter.x = screenSize.x/2;
 sunCenter.y = screenSize.y;
 sunRadius = Math.sqrt( Math.pow(screenSize.x/2, 2) + Math.pow(screenSize.y*3/4, 2) );
 if (sunRadius < screenSize.y*1.1) sunRadius = screenSize.y*1.1;
 var dayStartAngle = toRad(270) - Math.asin(sunCenter.x/sunRadius);
 var duskStartAngle = toRad(270) + Math.asin(sunCenter.x/sunRadius);
 var nightStartAngle = 0;
 var dawnStartAngle = toRad(180);


 var more = 0;
 var notY = screenSize.y/2;
 if (screenSize.y > screenSize.x) more = (screenSize.y - screenSize.x)/2;
 var p1 = {x:0 - more, y: notY};
 var p2 = {x: (screenSize.x/2.0), y: 0};
 var p3 = {x: screenSize.x + more, y: notY};
 var out="";
 var state = stateOfDay();
 if (state !== previousState) {
 previousState = state;
 console.log(state);
 }

 sunCenter = CarculateCircleCenter(p1, p2, p3);
 sunRadius = sunCenter.y*1.1;
 var y = sunCenter.y - notY;

 var startOfDayAngle;
 var endOfDayAngle;
 var DayAngle;
 var percentDayCompleted;


 if (state === "Day") {
 startOfDayAngle = toRad(270) - Math.acos(y / sunRadius);
 endOfDayAngle = toRad(360) - (startOfDayAngle - toRad(180));
 DayAngle = endOfDayAngle - startOfDayAngle;
 percentDayCompleted = (cycleStage / cycleOfDay) / percentDay;
 sunAngle = startOfDayAngle + DayAngle * (percentDayCompleted);

 sunPos.x = event.clientX = sunCenter.x + ( sunRadius * Math.cos(sunAngle) );
 sunPos.y = event.clientY = notY + ( sunRadius * Math.sin(sunAngle) );
 if (sunPos.y < 0) sunPos.y = 0;
 }
 else if (state === "Dusk") {
 startOfDayAngle = toRad(270) - Math.acos(y / sunRadius);
 endOfDayAngle = toRad(360) - (startOfDayAngle - toRad(180));
 DayAngle = endOfDayAngle - startOfDayAngle;
 percentDayCompleted = (cycleStage / cycleOfDay) / percentDay;
 sunAngle = startOfDayAngle + DayAngle * (percentDayCompleted);

 var percentDuskCompleted = (cycleStage - cycleOfDay*percentDay)/ ( cycleOfDay*(percentDay+percentDusk) - cycleOfDay*percentDay );
 //        percentDuskCompleted = Math.sin(toRad(percentDuskCompleted*90));
 //        console.log(percentDuskCompleted);

 sunPos.x = event.clientX = sunCenter.x + ( sunRadius * Math.cos(sunAngle) );
 sunPos.y = event.clientY = notY + ( sunRadius * Math.sin(sunAngle) )*(1 - percentDuskCompleted) + percentDuskCompleted*notY;
 if (sunPos.y < 0) sunPos.y = 0;    }
 else if (state === "Dawn") {
 startOfDayAngle = toRad(270) - Math.acos(y / sunRadius);
 endOfDayAngle = toRad(360) - (startOfDayAngle - toRad(180));
 DayAngle = endOfDayAngle - startOfDayAngle;
 percentDayCompleted = (cycleStage / cycleOfDay) / percentDay;
 sunAngle = startOfDayAngle + DayAngle * (percentDayCompleted);

 sunPos.x = event.clientX = sunCenter.x + ( sunRadius * Math.cos(sunAngle) );
 sunPos.y = event.clientY = notY + ( sunRadius * Math.sin(sunAngle) );
 if (sunPos.y < 0) sunPos.y = 0;
 //        console.log("dawn");
 }
 else {
 sunPos.x = event.clientX = (screenSize.x/2.0);
 sunPos.y = event.clientY = screenSize.y;
 }


 out += "Screen Size: " + screenSize.x.toString() + ", " + screenSize.y.toString();
 out += "\nSun Center: " + sunCenter.x.toString() + ", " + sunCenter.y.toString();
 out += "\nSun Radius: " + sunRadius.toString();
 out += "\nsin: " + Math.sin(sunAngle).toString();
 out += "\ncos: " + Math.cos(sunAngle).toString();
 out += "\nCycleStage: " + cycleStage.toString();
 out += "\ncycleOfDay: " + cycleOfDay.toString();
 out += "\npercentDay: " + percentDay.toString();
 out += "\nStart Of Day Angle: " + toDeg(startOfDayAngle).toString();
 out += "\nEnd Of Day Angle: " + toDeg(endOfDayAngle).toString();
 out += "\nDay Angle: " + toDeg(DayAngle).toString();
 out += "\n%day Complete: " + toDeg(percentDayCompleted).toString();
 out += "\nSun Postion: " + sunPos.x.toString() + ", " + sunPos.y.toString();
 out += "\nsunAngle: " + toDeg(sunAngle).toString();
 out += "\nState: " + stateOfDay();
 //    console.log(out);
 */


//////////////////////////////////

//     if (sunAngle === -1) {
//         console.log("true");
//         console.log("sunCenter.y " + (sunCenter.y).toString());
//         console.log("screenSize.y " + notY.toString());
//         console.log("y " + y.toString());
//         console.log("r " + sunRadius.toString());
//         sunAngle = Math.acos( y/sunRadius );
//         console.log("suggested start: " + toDeg(sunAngle));
//         console.log("x: " + sunRadius*Math.sin(sunAngle));
//         console.log("want: " + sunCenter.x.toString());
//         console.log("y: " + sunRadius*Math.cos(sunAngle));
//         console.log("want: " + y.toString());
//
//     }

//////////////////////////////////
//////////////////////////////////
////////////////////////////////////////////////////////////////////