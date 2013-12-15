var paper = Raphael(0, 0, 600, 600);
var coordinates = shuffle([[200,200],[400,200],[300,400]])
console.log(coordinates);
var red_circle = paper.circle(coordinates[0][0], coordinates[0][1], 50);
var blue_circle = paper.circle(coordinates[1][0], coordinates[1][1], 50);
var green_circle = paper.circle(coordinates[2][0], coordinates[2][1], 50);
red_circle.attr("stroke", "red");
red_circle.attr("stroke-width", 5);
blue_circle.attr("stroke", "blue");
blue_circle.attr("stroke-width", 5);
green_circle.attr("stroke", "green");
green_circle.attr("stroke-width", 5);
var circles = [red_circle, green_circle, blue_circle];

function fill(element,delay_time){
	var fill_anim = Raphael.animation({fill:element.attr("stroke")}, 1000);
	element.animate(fill_anim.delay(delay_time))
}

function intrans (animation, element){
	animation(element,0);
}

function trans (animation, elements){
	var element1 = elements[0];
	var element2 = elements[1];
	animation(element1,0);
	animation(element2,1000);
	var point1;
	var point2;
	if (element1.attr("cy") == element2.attr("cy")) {
		if (element1.attr("cx") < element2.attr("cx")) {
			point1 = (element1.attr("cx") + element1.attr("r") + 10) + "," + element1.attr("cy");
			point2 = (element2.attr("cx") - element2.attr("r") - 10) + "," + element2.attr("cy");
		} else {
			point1 = (element1.attr("cx") - element1.attr("r") - 10) + "," + element1.attr("cy");
			point2 = (element2.attr("cx") + element2.attr("r") + 10) + "," + element2.attr("cy");
		}
	} else {
		if (element1.attr("cy") < element2.attr("cy")) {
			if (element1.attr("cx") < element2.attr("cx")) {
			point1 = (element1.attr("cx") + element1.attr("r") - 10) + "," + (element1.attr("cy") + element1.attr("r") - 10);
			point2 = element2.attr("cx") + "," + (element2.attr("cy") - element2.attr("r") - 10);
			} else {
			point1 = (element1.attr("cx") - element1.attr("r") + 10) + "," + (element1.attr("cy") + element1.attr("r") - 10);
			point2 = element2.attr("cx") + "," + (element2.attr("cy") - element2.attr("r") - 10);
			}
		} else {
			if (element2.attr("cx") < element1.attr("cx")) {
			point1 = element1.attr("cx") + "," + (element1.attr("cy") - element1.attr("r") - 10);
			point2 = (element2.attr("cx") + element2.attr("r") - 10) + "," + (element2.attr("cy") + element2.attr("r") - 10);
			} else {
			point1 = element1.attr("cx") + "," + (element1.attr("cy") - element1.attr("r") - 10);
			point2 = (element2.attr("cx") - element2.attr("r") + 10) + "," + (element2.attr("cy") + element2.attr("r") - 10);
			}
		}
	}
	var path = paper.path("M"+point1+"L"+point2);
	path.attr("stroke-width", 3);
	path.attr("arrow-end","classic");
}

function simultaneous (animation, elements){
	element1 = elements[0];
	element2 = elements[1];
	animation(element1,0);
	animation(element2,0);
}

function get_elements () {
	var causer = circles[Math.floor(Math.random() * circles.length)];
	var new_circles  = []
	for (var i = 0; i < circles.length; i++){
		if (circles[i] != causer){
			new_circles.push(circles[i]);
			}
		}
	var causee = new_circles[Math.floor(Math.random() * new_circles.length)];
	return [causer, causee];
}

function shuffle(v) { // non-destructive.
    newarray = v.slice(0);
    for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
};

var causation_types = [intrans, trans, simultaneous];
var causation_type = causation_types[Math.floor(Math.random() * causation_types.length)];
var elements = get_elements();
if (causation_type == intrans){
	causation_type(fill, elements[0]);
}
else {
	causation_type(fill, elements);
}