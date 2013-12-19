var exp_delay = 2500;
var anim_time = 1000;

var transitivity = ["intrans_intrans","intrans_trans","trans","periphrastic"];
var question_trans = ["trans", "periphrastic"];
var polarity = ["pos","neg"];
var veracity = ["true","false"];
var sentence_types = [];

for (var i = 0; i < transitivity.length; i++){
	for (var j = 0; j < polarity.length; j++) {
		if (transitivity[i] == "intrans_trans"){
				for (var l = 0; l < question_trans.length; l++){
					var sentence_obj = {trans: transitivity[i], pol: polarity[j], question_trans: question_trans[l]};
					sentence_types.push(sentence_obj);
				}
		}
		else {
			for (var k = 0; k < veracity.length; k++) {
				var sentence_obj = {trans: transitivity[i], pol: polarity[j], ver: veracity[k]};
				sentence_types.push(sentence_obj);
			}
		}
	}	
}


var exp_sentences = shuffle(sentence_types);
console.log(exp_sentences);
var numberOfQuestions = exp_sentences.length; // or if you have a fixed stim set, it may make sense to eliminate this variable and use its length as the counter

var verbs = [	"cheem","dax","zook","blonk",
				"plaz","brilt","wazz","rill",
				"teck","noop","harn","stull",
				"rish", "quapp","dack", "prib"]
var exp_verbs = shuffle(verbs);

var easing_types = ["bounce", "elastic", "backOut"]

var animations = [fill, grow, shrink, glow, disappear, change_color];
var exp_animations = shuffle(animations).concat(shuffle(animations)).concat(shuffle(animations).slice(0,4));

function fill(element,delay_time){
	var fill_anim = Raphael.animation({fill:element.attr("stroke")}, anim_time);
	element.animate(fill_anim.delay(delay_time))
}

function grow(element, delay_time){
	var grow_anim = Raphael.animation({transform:element.attr("transform")+"s1.5"}, anim_time);
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
    $(".numquestions").html(numberOfQuestions);
	$("#totaltime").html(Math.round(numberOfQuestions/4,0));
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
    example: function () {
    		var example_qdata = {};
    		if (example_paper != null){
    			clearPaper(paper);
    		}
    		var example_paper = Raphael("example_canvas", 400, 350);
    	
			var example_coordinates = shuffle([[100,100],[300,100],[200,250]]);

			var example_colors = shuffle(["red","blue","green"]);

			var example_shapes = shuffle(["circle", "square", "triangle"]);
			
			var slide_easing = easing_types.random()

			var example_obj_1;
			var example_obj_2;
			var example_obj_3;
			var example_objs = [example_obj_1, example_obj_2, example_obj_3];

			for (var i=0; i < example_objs.length;i++){
				if (example_shapes[i] == "circle"){
					example_objs[i] = example_paper.circle(0,0,50);
				}
				else if (example_shapes[i] == "square"){
					example_objs[i] = example_paper.rect(-44, -44,88,88,0);
				}
				else if (example_shapes[i] == "triangle"){
					example_objs[i] = example_paper.path("M-50,-43.5L50,-43.5L0,43.5Z");
				}
				example_objs[i].data('shape',example_shapes[i]);
				example_objs[i].data('color',example_colors[i]);
				example_objs[i].transform("t" + example_coordinates[i][0] + "," + example_coordinates[i][1]);
				example_objs[i].attr("stroke-width", 7);
				example_objs[i].attr("stroke", example_colors[i]);
				}

			var example_elements = shuffle(example_objs);

			function example_move_to(){
				var move = Raphael.animation({transform:example_elements[1].attr("transform")},anim_time, slide_easing);
				example_elements[0].animate(move.delay(exp_delay/2));
			}

			function example_trans (animation){	
				example_elements[0].toFront();
				example_move_to();
				animation(example_elements[1],anim_time+exp_delay);
			}
			var example_animation = exp_animations.random();
			var example_verb = "vlomp"
			example_trans(example_animation);
			$("#example").prop("disabled",true);
			var example_subject = example_elements[0];
			var example_object = example_elements[1];
			$("#example_questiontxt").html('The '+ example_subject.data("color") + " " + example_subject.data("shape") + " caused the " + example_object.data("color") + " " + example_object.data("shape") + " to " + example_verb + "."); 
    		example_qdata.question = "example";
    		example_qdata.trans = "periphrastic";
    		example_qdata.pol = "pos";
    		example_qdata.ver = "true";
    		example_qdata.obj1_color = example_elements[0].data("color");
			example_qdata.obj1_shape = example_elements[0].data("shape");
			example_qdata.obj2_color = example_elements[1].data("color");
			example_qdata.obj2_shape = example_elements[1].data("shape");
			example_qdata.obj3_color = example_elements[2].data("color");
			example_qdata.obj3_shape = example_elements[2].data("shape");
    		$(".example_rating").change(function() {
				example_qdata.response = $(this).attr("value");
				judgment = true;
        	});
        	experiment.data['exdata'] = example_qdata; 
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
			var qdata = {};
			var startTime = (new Date()).getTime(); 
			
			$("#no_answer").hide();
			$("#too_fast").hide();
			$(".responseobjects").hide();

			var judgment = false;

			var paper = Raphael("canvas", 400, 350);

			var coordinates = [[100,100],[300,100],[200,250]];
			var exp_coordinates = shuffle(coordinates);

			var colors = ["red","blue","green"];
			var exp_colors = shuffle(colors);

			var shapes = ["circle", "square", "triangle"];
			var exp_shapes = shuffle(shapes);
			
			var slide_easing = easing_types.random()

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
				var move = Raphael.animation({transform:elements[1].attr("transform")},anim_time, slide_easing);
				elements[0].animate(move.delay(exp_delay));
			}

			function intrans (animation){
				animation(elements[0],exp_delay);
			}

			function trans (animation){	
				elements[0].toFront();
				move_to();
				animation(elements[1],anim_time+exp_delay);
			}
			
			qdata.transitivity = exp_sentences[num].trans;
			qdata.polarity = exp_sentences[num].pol;
			qdata.veracity = exp_sentences[num].ver;
			qdata.question = num + 1;
			qdata.verb = exp_verbs[num];
			qdata.obj1_color = elements[0].data("color");
			qdata.obj1_shape = elements[0].data("shape");
			qdata.obj2_color = elements[1].data("color");
			qdata.obj2_shape = elements[1].data("shape");
			qdata.obj3_color = elements[2].data("color");
			qdata.obj3_shape = elements[2].data("shape");

			if (exp_sentences[num].trans == "intrans_intrans"){
				intrans(exp_animations[num]);
				setTimeout(function() {$(".responseobjects").show()}, exp_delay+anim_time);
				var subject;
				if (exp_sentences[num].pol == "pos") {
					if (exp_sentences[num].ver == "true"){
						subject = elements[0];
					}
					else {
						subject = elements[1];
					}
					$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " " + exp_verbs[num]+"ed."); 
				}
				else {
					if (exp_sentences[num].ver == "true"){
						subject = elements[1];
					}
					else {
						subject = elements[0];
					}
					$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " didn't " + exp_verbs[num] +"."); 
				}
			}
			else if (exp_sentences[num].trans == "intrans_trans"){
				qdata.question_trans = exp_sentences[num].question_trans
				intrans(exp_animations[num]);
				setTimeout(function() {$(".responseobjects").show()}, exp_delay+anim_time);
				var subject = elements[1];
				var object = elements[0];
				if (exp_sentences[num].pol == "pos") {
					qdata.veracity = "false"
					if (exp_sentences[num].question_trans == "trans"){
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " " + exp_verbs[num]+"ed the " + object.data("color") + " " + object.data("shape") + ".");
					}
					else {
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " caused the " + object.data("color") + " " + object.data("shape") + " to " + exp_verbs[num] + ".");
					}
				}
				else {
					qdata.veracity = "true"
					if (exp_sentences[num].question_trans == "trans"){
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " didn't " + exp_verbs[num]+ " the " + object.data("color") + " " + object.data("shape") + ".");
					}
					else {
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " didn't cause the " + object.data("color") + " " + object.data("shape") + " to " + exp_verbs[num] + ".");
					}
				}
			}
			else {
				trans(exp_animations[num]);
				setTimeout(function() {$(".responseobjects").show()}, exp_delay + (2 * anim_time));
				var subject;
				var object;
				var present;
								
				if (exp_sentences[num].ver == "true"){
					subject = elements[0];
					object = elements[1];
					present = elements[2];
				}
				else {
					subject = elements[2];
					object = elements[1];
					present = elements[0];
				}
				
				if (exp_sentences[num].trans == "trans") {
					if (exp_sentences[num].pol == "pos"){
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " " + exp_verbs[num] + "ed the "+ object.data("color") + " " + object.data("shape") + "."); 
					}
					else {
						$("#questiontxt").html('The '+ present.data("color") + " " + present.data("shape") + " didn't " + exp_verbs[num] + " the "+ object.data("color") + " " + object.data("shape") + ".");
					}
				}
				else {
					if (exp_sentences[num].pol == "pos"){
						$("#questiontxt").html('The '+ subject.data("color") + " " + subject.data("shape") + " caused the " + object.data("color") + " " + object.data("shape") + " to " + exp_verbs[num] + "."); 
					}
					else {
						$("#questiontxt").html('The '+ present.data("color") + " " + present.data("shape") + " didn't cause the " + object.data("color") + " " + object.data("shape") + " to " + exp_verbs[num] + "."); 
					}
				}
			}
			
			var response;
			$(".rating").change(function() {
				response = $(this).attr("value");
				judgment = true;
        	});
        	
	    	$("#continue").click(function() {
	    		var clickTime = (new Date()).getTime();
	    		if (!judgment) { // test for answer meeting relevant parameters -- e.g., all questions answered
	    			// if no, show some text saying so and ask them to answer appropriately
	    			$("#no_answer").show()
	    		} 
	    		else if ((clickTime - startTime) < (exp_delay + anim_time)){
	    			$("#too_fast").show()
	    		}
	    		else { // advance to next question
	    			var endTime = (new Date()).getTime(); 
	    			qdata.response = response;
	    			qdata.rt = endTime - startTime;
	    			$("#continue").unbind('click'); // remove this fxn after using it once, so we can reuse the button
					$('.rating').attr('checked',false);
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