let x = 460;
let y = 573;
const pull = 5000;
let attraction = pull;
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const resolution = 50;
let clicked = false;
c.width = window.innerWidth;
c.height = 1000;

let dimensions = ["t","x","y"];
let lightspeed = 100;
let mass = 250000; 
let pointx = 0;
let pointy = 0;
let d = 0.5
let stimeelapsed = 3 * lightspeed

console.log("schwarzschild radius: "+2*mass/(lightspeed**2))

//let christoffel = [[[chris(0, 0, 0), chris(0, 0, 1), chris(0, 0, 2)],
//    [chris(0, 1, 0), chris(0, 1, 1), chris(0, 1, 2)],
//    [chris(0, 2, 0), chris(0, 2, 1), chris(0, 2, 2)]], 
//    [[chris(1, 0, 0), chris(1, 0, 1), chris(1, 0, 2)],
//    [chris(1, 1, 0), chris(1, 1, 1), chris(1, 1, 2)],
//    [chris(1, 2, 0), chris(1, 2, 1), chris(1, 2, 2)]],
//    [[chris(2, 0, 0), chris(2, 0, 1), chris(2, 0, 2)],
//    [chris(2, 1, 0), chris(2, 1, 1), chris(2, 1, 2)],
//    [chris(2, 2, 0), chris(2, 2, 1), chris(2, 2, 2)]]];

//console.log(christoffel)

function update(x, y) {
    console.log("trying to update")
    ctx.clearRect(0, 0, c.width, c.height);
    //console.log(e.offsetX, e.offsetY);
    let points = [];
    for (let i = -1; i <= c.clientWidth / resolution + 1; i++) {
        //console.log(`i = ${i}`);
        let column = [];
        for (let j = -1; j <= c.clientHeight / resolution; j++) {
            pointx = resolution * i;
            pointy = resolution * j;
            //if (Math.sqrt((pointx-x)**2+(pointy-y)**2) < 2*mass/(lightspeed**2)) {
                //console.log(pointx + " - " + x + " = " + (pointx - x))
                //console.log(pointx - x + "**2 = "+(pointx - x) ** 2)
                //console.log(pointy + " - " + y + " = " + (pointx - y))
                //console.log(pointy - y + "**2 = "+(pointy - y) ** 2)
                //console.log("    point " + pointx + "-" + x + ", " + pointy + "-" + y +" equates to " + Math.sqrt((pointx - x) ** 2 + (pointy - y) ** 2) + ", which is within " + 2 * mass / (lightspeed ** 2) +" of point "+x+", "+y)
                //continue;
            //}
            let pointnow = newton(pointx, pointy);
            column.push(pointnow);
        };
        points.push(column);
    };
    console.log(points)
    ctx.strokeStyle = "#790e9e"
    ctx.lineWidth = 5;
    for (let i = 0; i < points.length-1; i++) {
        for (let j = 0; j < points[i].length-1; j++) { 
            ctx.beginPath();
            ctx.moveTo(points[i][j + 1].nx, points[i][j + 1].ny);
            ctx.lineTo(points[i][j].nx, points[i][j].ny);
            ctx.lineTo(points[i + 1][j].nx, points[i + 1][j].ny);
            ctx.stroke();
        }
    }
}


// DIFFERENT VISUAL EFFECTS


function gr(px, py) {
    //console.log("finding path of point " +px+", "+py)
    let p = [0,px,py];
    let v = [lightspeed,0,0];
    let a = [-(accel(0, v)), -(accel(1, v)), -(accel(2, v))];
    //console.log("starting with p = "+p+", t = "+t+", v = "+v+", a = "+a)
    while (p[0] < stimeelapsed){
        //console.log("inting number " + t);
        //console.log("updating from t = " + t + ", p = " + p + ", v = " + v + ", a = " + a)
        let vsmall = []
        let asmall = []
        for (let z = 0; z < 3; z++) {
            vsmall.push(v[z] * d);
            //console.log("        trying to scale value "+z+", multiplying "+a[z]+" by "+d)
            asmall.push(a[z] * d);
        }
        //console.log("    scaled vectors are v = "+vsmall+", a = "+asmall)
        p = math.add(p, vsmall)
        v = math.add(v, asmall) 
        a = [-(accel(0, v)), -(accel(1, v)), -(accel(2, v))]
        //console.log("done, now t = " + t + ", p = " + p + ", v = " + v + ", a = " + a)
    }
    let point = {
        nx: p[1],
        ny: p[2]
    }
    //console.log("point " +px+", "+py+" ended up at "+p)
    return point;
}

function newton(px, py) {
    //return ([px,py]+pull*([x,y]-[px,py]))/(pull(Math.sqrt((x-px)**2+(y-py)**2)))
    let point = {
        nx: px - ((attraction * (px - x)) / (attraction + (Math.sqrt(((x - px) ** 2) + ((y - py) ** 2)) ** 2))),
        ny: py - ((attraction * (py - y)) / (attraction + (Math.sqrt(((x - px) ** 2) + ((y - py) ** 2)) ** 2)))
    }
    return point;
}

function shine(color, squish) {
    if ((color * squish).toString(16).includes(".")) {
        return (color * squish).toString(16).substring(0, (color * squish).toString(16).indexOf(".")).padStart(2, "0")
    }
    else {
        return (color * squish).toString(16).substring(0, 2).padStart(2, "0")
    }
}


// FUNCTIONALITY


function g(i) {
    switch(i){
        // time-time component
        case 0: 
            return "-(1 - " + mass + " / ((" + lightspeed + " ^ 2) * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y + ") ^ 2)))^2 / (1 + " + mass + " / ((" + lightspeed + " ^ 2) * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y +") ^ 2)))^2"
        // space components 
        default:
            return "(1 + (" + mass + " / (" + lightspeed + " ^ 2 * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y +") ^ 2)))^4)"
    }   
}

function G(i) {
    switch (i) {
        // time-time component
        case 0:
            return "1/(-(1 - " + mass + " / ((" + lightspeed + " ^ 2) * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y + ") ^ 2)))^2 / (1 + " + mass + " / ((" + lightspeed + " ^ 2) * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y + ") ^ 2)))^2)"
        // space components 
        default:
            return "1/((1 + " + mass + " / (" + lightspeed + " ^ 2 * 2 * sqrt((x - " + x + ") ^ 2 + (y - " + y + ") ^ 2)))^4)"
    }
}

function accel(k, v){
    //console.log("finding acceleration");
    let temp = 0;
    //console.log("temp value, "+temp+", should be 0");
    //console.log("v = " + v);
    for(let p = 0; p < 3; p++){
        for (let q = 0; q < 3; q++) {
            //console.log("adding "+christoffel[k][p][q]+" * "+v[p]+" * "+v[q])
            temp += (math.evaluate(christoffel[k][p][q], { x: pointx, y: pointy }) * v[p] * v[q]);
            //console.log("temp is now "+temp)
        }
    }
    return temp;
}

function chris(k,i,j){
    console.log("my boy chris "+k+", "+i+", "+j)
    if (!kronecker(k, i) && !kronecker(k, j) && !kronecker(i, j)) return "0";
    return math.simplify((G(k) +" * ("+
        kronecker(k, i)+ " * " + math.derivative(g(k).toString(), dimensions[j]).toString()
        +"+"+ kronecker(k, j) +"*"+ math.derivative(g(k).toString(), dimensions[i]).toString()
        +"-"+ kronecker(i, j) +"*"+ math.derivative(g(i).toString(), dimensions[k]).toString()) +")/2").toString();
}

function kronecker(x,y){
    if(x==y) return 1;
    return 0;
}

c.addEventListener("resize", function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
})

document.addEventListener("mousedown", function () {
    clicked = true;
})

document.addEventListener("mouseup", function () {
    clicked = false;
})

setInterval(function changeAttraction() {
    attraction = attraction + (pull * (1+clicked) - attraction) / 2;
    update(x, y)
}, 16);

document.addEventListener("mousemove", function (e) {
    x = e.pageX;
    y = e.pageY;
    update(x, y);
});
