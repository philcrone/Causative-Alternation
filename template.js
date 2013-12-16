var numberOfQuestions = 12; // or if you have a fixed stim set, it may make sense to eliminate this variable and use its length as the counter
var exp_delay = 2500;
var anim_time = 1000;

var sentence_types = [	"intrans_pos_true",
						"intrans_neg_true",
						"trans_pos_true",
						"trans_neg_true",
						"peri_pos_true",
						"peri_neg_true",
						"intrans_pos_false",
						"intrans_neg_false",
						"trans_pos_false",
						"trans_neg_false",
						"peri_pos_false",
						"peri_neg_false"];
var exp_sentences = shuffle(sentence_types);

var verbs = ["cheem","dax","zook","blonk","plaz","brilt","wazz","rill","teck","noop","harn","stull"]
var exp_verbs = shuffle(verbs);

var animations = [fill, grow, shrink, glow, disappear, change_color];
var exp_animations = shuffle(animations).concat(shuffle(animations));
console.log(exp_animations);

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
}

function glow(element, delay_time){
	var glow_stuff = element.glow({opacity:-0.05, width:50, color:element.attr("stroke")});
	var glow_anim = Raphael.animation({opacity:0.05}, anim_time);
	glow_stuff.animate(glow_anim.delay(delay_time))
}	

function disappear(element, delay_time){
	var disappear_anim = Raphael.animation({"stroke-opacity":0}, anim_time);
	element.animate(disappear_anim.delay(delay_time))
}

$(document).ready(function() {
    showSlide("instructions");
    $("#instructions #mustaccept").hide();
});

function clearPaper(p){
    var paperDom = p.canvas;
    paperDom.parentNode.removeChild(paperDom);
}

function showSlide(id) {
	$(".slide").hide();
	$("#"+id).show();
}

function shuffle(v) { // non-destructive.
    newarray = v.slice(0);
    for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
};

function random(a,b) {
    if (typeof b == "undefined") {
	a = a || 2;
	return Math.floor(Math.random()*a);
    } else {
	return Math.floor(Math.random()*(b-a+1)) + a;
    }
}

Array.prototype.random = function() { return this[random(this.length)]; }

var experiment = {
    data: {},
    intro: function () {
    	if (turk.previewMode) {
	    	$("#instructions #mustaccept").show();
		} else {
	    	showSlide("intro");
	    }
    },
    next: function(num) {
    	if (num == numberOfQuestions) {
   // or "if (stimuli.length == 0) {...}", etc: test whether it's time to end the experiment
		    showSlide("language");
		    $("#lgerror").hide();
		    $("#lgbox").keypress(function(e){ // capture return so that it doesn't restart experiment
		    	if (e.which == 13) {
		    		return(false);
		    	}
		    });
		    $("#lgsubmit").click(function(){
				var lang = document.getElementById("lgbox").value;
				if (lang.length > 2) {
				    //lang = lang.slice(3,lang.length);
				    experiment.data.language = lang;
				    showSlide("finished");
				    setTimeout(function() { turk.submit(experiment.data) }, 1000);
				}
				return(false);
			});
		} else { 
			showSlide("stage");
			//var startTime = new Date.getTime();
			qdata = {};
			var startTime = (new Date()).getTime(); 
			$("#error").hide();
			var judgment = false;
			var paper = Raphael("canvas", 450, 450);

			var coordinates = [[150,150],[300,150],[225,300]];
			var exp_coordinates = shuffle(coordinates);

			var colors = ["red","blue","green"];
			var exp_colors = shuffle(colors);

			var shapes = ["circle", "square", "triangle"];
			var exp_shapes = shuffle(shapes);

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
				objs[i].data('shape',exp_shapes[i]);
				objs[i].data('color',exp_colors[i]);
				objs[i].transform("t" + exp_coordinates[i][0] + "," + exp_coordinates[i][1]);
				objs[i].attr("stroke-width", 7);
				objs[i].attr("stroke", exp_colors[i]);
				}

			var elements = shuffle(objs);

			function move_to(){
				var move = Raphael.animation({transform:elements[1].attr("transform")},anim_time, "bounce", move_back());
				elements[0].animate(move.delay(exp_delay));
			}

			function move_back(){
				var move = Raphael.animation({transform:elements[0].attr("transform")},anim_time, "bounce");
				elements[0].animate(move);
			}

			function intrans (animation){
				animation(elements[0],exp_delay);
			}

			function trans (animation){	
				elements[0].toFront();
				move_to();
				animation(elements[1],anim_time+exp_delay);
			}
			
			qdata.sentence_type = exp_sentences[num];
			qdata.question = num + 1;
			qdata.verb = exp_verbs[num];
			qdata.obj1 = elements[0].data("color") + " " + elements[0].data("shape");
			qdata.obj2 = elements[1].data("color") + " " + elements[1].data("shape");
			qdata.obj3 = elements[2].data("color") + " " + elements[2].data("shape");

			if (exp_sentences[num] == "intrans_pos_true"){
				intrans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " " + exp_verbs[num]+"ed."); 
			}
			else if (exp_sentences[num] == "intrans_neg_true"){
				intrans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[1].data("color") + " " + elements[1].data("shape") + " didn't " + exp_verbs[num] +"."); 
			}
			else if (exp_sentences[num] == "trans_pos_true"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " " + exp_verbs[num] + "ed the "+ elements[1].data("color") + " " + elements[1].data("shape") + "."); 
			}
			else if (exp_sentences[num] == "trans_neg_true"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[2].data("color") + " " + elements[2].data("shape") + " didn't " + exp_verbs[num] + " the "+ elements[1].data("color") + " " + elements[1].data("shape") + "."); 
			}
			else if (exp_sentences[num] == "peri_pos_true"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " caused the "+ elements[1].data("color") + " " + elements[1].data("shape") + " to " + exp_verbs[num]+"."); 
			}
			else if (exp_sentences[num] == "peri_neg_true"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[2].data("color") + " " + elements[2].data("shape") + " didn't cause the "+ elements[1].data("color") + " " + elements[1].data("shape") + " to " + exp_verbs[num]+".");
			}
			else if (exp_sentences[num] == "intrans_pos_false"){
				intrans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[1].data("color") + " " + elements[1].data("shape") + " " + exp_verbs[num]+"ed."); 
			}
			else if (exp_sentences[num] == "intrans_neg_false"){
				intrans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " didn't " + exp_verbs[num] +"."); 
			}
			else if (exp_sentences[num] == "trans_pos_false"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[1].data("color") + " " + elements[1].data("shape") + " " + exp_verbs[num] + "ed the "+ elements[2].data("color") + " " + elements[2].data("shape") + "."); 
			}
			else if (exp_sentences[num] == "trans_neg_false"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " didn't " + exp_verbs[num] + " the "+ elements[1].data("color") + " " + elements[1].data("shape") + "."); 
			}
			else if (exp_sentences[num] == "peri_pos_false"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[1].data("color") + " " + elements[1].data("shape") + " caused the "+ elements[2].data("color") + " " + elements[2].data("shape") + " to " + exp_verbs[num]+"."); 
			}
			else if (exp_sentences[num] == "peri_neg_false"){
				trans(exp_animations[num]);
				$("#questiontxt").html('The '+ elements[0].data("color") + " " + elements[0].data("shape") + " didn't cause the "+ elements[1].data("color") + " " + elements[1].data("shape") + " to " + exp_verbs[num]+".");
			}
			$(".rating").change(function() {
				qdata.response = $(this).attr("value");
				judgment = true;
        	});
	    	$("#continue").click(function() {
	    		if (!judgment) { // test for answer meeting relevant parameters -- e.g., all questions answered
	    			// if no, show some text saying so and ask them to answer appropriately
	    			$("#error").show()
	    		} else { // advance to next question
	    			var endTime = (new Date()).getTime(); 
	    			qdata.rt = endTime - startTime;
	    			$("#continue").unbind('click'); // remove this fxn after using it once, so we can reuse the button
					$('.rating').attr('checked',false);
	    			//qdata.rt = new Date.getTime() - startTime;
	    			clearPaper(paper);
	    			experiment.data['q' + num + 'data'] = qdata; // add trial data to experiment.data object, which is what we'll eventually submit to MTurk
	    			experiment.next(num + 1);
	    		}
	    	});
	    	// if you're using a progress bar, uncomment next line to advance that
	    	// $('.bar').css('width', (200.0 * num / numberOfQuestions) + 'px');

	    	
	    }
	}
}