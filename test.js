var paper = Raphael(0, 0, 600, 600);
var exp_delay = 2500;
var anim_time = 1000;

var coordinates = [[200,200],[400,200],[300,400]];
var exp_coordinates = shuffle(coordinates);

var colors = ["red","blue","green"];
var exp_colors = shuffle(colors);

var shapes = ["circle", "square", "triangle"];
var exp_shapes = shuffle(shapes);

var causation_types = [trans, intrans];
var exp_causation = shuffle(causation_types)[0];

var obj_1;
var obj_2;
var obj_3;
var objs = [obj_1, obj_2, obj_3];

for (var i=0; i < objs.length;i++){
	if (exp_shapes[i] == "circle"){
		objs[i] = paper.circle(0,0,50);
	}
	else if (exp_shapes[i] == "square"){
		objs[i] = paper.rect(-44, -44,88,88,0);
	}
	else if (exp_shapes[i] == "triangle"){
		objs[i] = paper.path("M-50,-43.5L50,-43.5L0,43.5Z");
	}
	objs[i].transform("t" + exp_coordinates[i][0] + "," + exp_coordinates[i][1]);
	objs[i].attr("stroke-width", 5);
	objs[i].attr("stroke", exp_colors[i]);
}

function shuffle(v) { // non-destructive.
    var newarray = v.slice(0);
    for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
}

var elements = get_elements();

function move_to(elements){
	var move = Raphael.animation({transform:elements[1].attr("transform")},anim_time, "bounce");
	elements[0].animate(move.delay(exp_delay));
}

function fill(element,delay_time){
	var fill_anim = Raphael.animation({fill:element.attr("stroke")}, anim_time);
	element.animate(fill_anim.delay(delay_time))
}

function grow(element, delay_time){
	var grow_anim = Raphael.animation({transform:element.attr("transform")+"s2"}, anim_time);
	element.animate(grow_anim.delay(delay_time));
}

function shrink(element, delay_time){
	var grow_anim = Raphael.animation({transform:element.attr("transform")+"s0.25"}, anim_time);
	element.animate(grow_anim.delay(delay_time));
}

function change_color(element, delay_time){
	var element_color = Raphael.getRGB(element.attr("stroke")).toString();
	element_color = element_color.replace("#","");
	hexnum = element_color.toUpperCase();
  	var splitnum = hexnum.split("");
  	var resultnum = "";
  	var simplenum = "FEDCBA9876".split("");
  	var complexnum = new Array();
  	complexnum.A = "5";
  	complexnum.B = "4";
  	complexnum.C = "3";
  	complexnum.D = "2";
  	complexnum.E = "1";
  	complexnum.F = "0";
	
	for(i=0; i<6; i++){
    if(!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]]; 
    } else if(complexnum[splitnum[i]]){
      resultnum += complexnum[splitnum[i]]; 
    } else {
      alert("Hex colors must only include hex numbers 0-9, and A-F");
      return false;
    }
  	};
  	
  	var color_anim = Raphael.animation({stroke:"#"+resultnum}, anim_time);
  	element.animate(color_anim.delay(delay_time));
	console.log(element_color);
	console.log(resultnum);
}

function glow(element, delay_time){
	var glow_stuff = element.glow({width:50, color:element.attr("stroke")});
	glow_stuff.hide();
	setTimeout(function(){glow_stuff.show()}, delay_time);
}	

function disappear(element, delay_time){
	var disappear_anim = Raphael.animation({"stroke-opacity":0}, anim_time);
	element.animate(disappear_anim.delay(delay_time))
}

var animations = [fill, grow, shrink, change_color, glow, disappear];
var exp_animations = shuffle(animations);

function intrans (animation, element){
	animation(element,exp_delay);
}

function trans (animation, elements){
	var element1 = elements[0];
	var element2 = elements[1];
	element1.toFront();
	move_to(elements);
	animation(element2,anim_time+exp_delay);
}

function get_elements () {
	var shuffled_objs = shuffle(objs);
	console.log(shuffled_objs);
	return [shuffled_objs[0], shuffled_objs[1]];
}

if (exp_causation == intrans){
	exp_causation(exp_animations[0], elements[0]);
}
else {
	exp_causation(exp_animations[0], elements);
}