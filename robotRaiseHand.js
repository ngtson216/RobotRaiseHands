"use strict";
var canvas;
var gl;
var numPositions = 384;
var program;
var positions = [];
var colors = [];
var rotateValue = 0;
var theta = [0, 0, 0];
var uTheta;

var vertices = [ 
    //head vertices
    vec3(-75, 275, 50), vec3(0, 350, 50), vec3(75, 275, 50), vec3(0, 200, 50),
    vec3(-75, 275, -50), vec3(0, 350, -50), vec3(75, 275, -50), vec3(0, 200, -50), 

    //body vertices 
    vec3(-100, -100, 50), vec3(-100, 200, 50), vec3(100, 200, 50), vec3(100, -100, 50),
    vec3(-100, -100, -50), vec3(-100, 200, -50), vec3(100, 200, -50), vec3(100, -100, -50),

    //left leg vertices 
    vec3(-100, -400, 50), vec3(-100, -100, 50), vec3(-30, -100, 50), vec3(-30, -400, 50),
    vec3(-100, -400, -50), vec3(-100, -100, -50), vec3(-30, -100, -50), vec3(-30, -400, -50),

    //right leg vertices 
    vec3(30, -400, 50), vec3(30, -100, 50), vec3(100, -100, 50), vec3(100, -400, 50),
    vec3(30, -400, -50), vec3(30, -100, -50), vec3(100, -100, -50), vec3(100, -400, -50),

    //left foot vertices 
    vec3(-130, -450, 50), vec3(-130, -400, 50), vec3(-30, -400, 50), vec3(-30, -450, 50),
    vec3(-130, -450, -50), vec3(-130, -400, -50), vec3(-30, -400, -50), vec3(-30, -450, -50),

    //right foot vertices 
    vec3(30, -450, 50), vec3(30, -400, 50), vec3(130, -400, 50), vec3(130, -450, 50),
    vec3(30, -450, -50), vec3(30, -400, -50), vec3(130, -400, -50), vec3(130, -450, -50)
];

var left_arm_vertices = [ 
    vec3(-140, -220, 50), vec3(-140, 200, 50), vec3(-100, 200, 50), vec3(-100, -220, 50),
    vec3(-140, -220, -50), vec3(-140, 200, -50), vec3(-100, 200, -50), vec3(-100, -220, -50)
];

var right_arm_vertices = [ 
    vec3(100, -220, 50), vec3(100, 200, 50), vec3(140, 200, 50), vec3(140, -220, 50),
    vec3(100, -220, -50), vec3(100, 200, -50), vec3(140, 200, -50), vec3(140, -220, -50)
];

var newLeftArmsVertices = left_arm_vertices; 
var newRightArmsVertices = right_arm_vertices;

window.onload = function init() 
{
    canvas = document.getElementById("gl-canvas"); 
    gl = canvas.getContext('webgl2'); 
    if (!gl) alert("WebGL 2.0 isn't available"); 
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    
    document.addEventListener("keydown", function(event) {
        switch(event.key) {                                
            case "ArrowUp": 
                theta[0] = theta[0] > 0 ? theta[0] - 2 : 360; 
                break;
            case "ArrowDown": 
                theta[0] = theta[0] < 360 ? theta[0] + 2 : 0;
                break;
            case "ArrowLeft": 
                theta[1] = theta[1] > 0 ? theta[1] - 2 : 360;
                break;
            case "ArrowRight": 
                theta[1] = theta[1] < 360 ? theta[1] + 2 : 0;
                break;
        }
    });
    
    document.getElementById("HandUpDown").onmousemove = function (event) { 
        rotateValue = parseInt(event.target.value); 
        newLeftArmsVertices = transform_rotate(left_arm_vertices, -rotateValue, -120, 180);  
        newRightArmsVertices = transform_rotate(right_arm_vertices, rotateValue, 120, 180);  
        positions = [];
        buildCube(); 
        render();   
    }

    buildCube();

    gl.viewport(0, 0, canvas.width, canvas.height); 
    gl.clearColor(1.0, 1.0, 1.0, 1.0); 

    gl.enable(gl.DEPTH_TEST); 

    program = initShaders(gl, "vertex-shader", "fragment-shader");                                                                  
    gl.useProgram(program);

    var uUserCoordinates = gl.getUniformLocation(program, "uUserCoordinates");
    gl.uniform3f(uUserCoordinates, canvas.width, canvas.height, canvas.width); 
    uTheta = gl.getUniformLocation(program, "uTheta"); 
    render();
}

function buildCube()
{
    quad(1, 0, 3, 2); quad(2, 3, 7, 6); quad(3, 0, 4, 7); quad(6, 5, 1, 2); quad(4, 5, 6, 7); quad(5, 4, 0, 1);
    quad(9, 8, 11, 10); quad(10, 11, 15, 14); quad(11, 8, 12, 15); quad(14, 13, 9, 10); quad(12, 13, 14, 15); quad(13, 12, 8, 9);
    quad(17, 16, 19, 18); quad(18, 19, 23, 22); quad(19, 16, 20, 23); quad(22, 21, 17, 18); quad(20, 21, 22, 23); quad(21, 20, 16, 17);
    quad(25, 24, 27, 26); quad(26, 27, 31, 30); quad(27, 24, 28, 31); quad(30, 29, 25, 26); quad(28, 29, 30, 31); quad(29, 28, 24, 25);
    quad(33, 32, 35, 34); quad(34, 35, 39, 38); quad(35, 32, 36, 39); quad(38, 37, 33, 34); quad(36, 37, 38, 39); quad(37, 36, 32, 33);
    quad(41, 40, 43, 42); quad(42, 43, 47, 46); quad(43, 40, 44, 47); quad(46, 45, 41, 42); quad(44, 45, 46, 47); quad(45, 44, 40, 41);

    LeftArm(1, 0, 3, 2); LeftArm(2, 3, 7, 6); LeftArm(3, 0, 4, 7); 
    LeftArm(6, 5, 1, 2); LeftArm(4, 5, 6, 7); LeftArm(5, 4, 0, 1);

    RightArm(1, 0, 3, 2); RightArm(2, 3, 7, 6); RightArm(3, 0, 4, 7); 
    RightArm(6, 5, 1, 2); RightArm(4, 5, 6, 7); RightArm(5, 4, 0, 1);
}

function quad(a, b, c, d)
{
    var vertexColors = vec3(0.0, 0.0, 0.0); 

    var indices = [a, b, b, c, c, d, d, a];
    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        colors.push(vertexColors);
    }
}

function LeftArm(a, b, c, d)
{
    var vertexColors = vec3(0.0, 0.0, 0.0);

    var indices = [a, b, b, c, c, d, d, a];
    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( newLeftArmsVertices[indices[i]] );
        colors.push(vertexColors);
    }
}

function RightArm(a, b, c, d)
{
    var vertexColors = vec3(0.0, 0.0, 0.0);

    var indices = [a, b, b, c, c, d, d, a];
    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( newRightArmsVertices[indices[i]] );
        colors.push(vertexColors);
    }
}

function supportRender() {
    var vBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW); 
    var positionLoc = gl.getAttribLocation(program, "aPosition"); 
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc); 

    var cBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc ); 
}

function render()
{
    supportRender();
    gl.uniform3fv(uTheta, theta); 
    gl.drawArrays(gl.LINES, 0, numPositions); 
    requestAnimationFrame(render); 
}

function transform_rotate(vertices_in, angle, x, y) {
    var angleInRadians = angle * Math.PI / 180; 

    var mat3_t = mat3(
        Math.cos(angleInRadians), -Math.sin(angleInRadians), (1 - Math.cos(angleInRadians)) * x + Math.sin(angleInRadians) * y,
        Math.sin(angleInRadians), Math.cos(angleInRadians), -Math.sin(angleInRadians) * x + (1 - Math.cos(angleInRadians)) * y,
        0.0, 0.0, 1.0
    ); 

    var vertices_out = []; 
    for(var i = 0; i < vertices_in.length; i++) {
        var vec3_p = vec3(vertices_in[i][0], vertices_in[i][1], 1.0);
        var vec3_q = mult(mat3_t, vec3_p);
    
        vertices_out.push(vec3(vec3_q[0], vec3_q[1], vertices_in[i][2])); 
    }

    return vertices_out;

}