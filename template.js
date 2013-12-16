var numberOfQuestions = 10; // or if you have a fixed stim set, it may make sense to eliminate this variable and use its length as the counter

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
			$("#error").hide();
			var judgment = false;
			var paper = Raphael("canvas", 300, 300);
			var coordinates = shuffle([[60,60],[240,60],[150,240]])
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
			var causation_types = [intrans, trans, simultaneous];
			var causation_type = causation_types[Math.floor(Math.random() * causation_types.length)];
			var elements = get_elements();
			if (causation_type == intrans){
				causation_type(fill, elements[0]);
			}
			else {
				causation_type(fill, elements);
			}
			var response;
			$(".rating").change(function() {
				response = $(this).attr("value");
				judgment = true;
        	});
			$("#questiontxt").html('This is another test.'); 
	    	$("#continue").click(function() {
	    		if (!judgment) { // test for answer meeting relevant parameters -- e.g., all questions answered
	    			// if no, show some text saying so and ask them to answer appropriately
	    			$("#error").show()
	    		} else { // advance to next question
	    			$("#continue").unbind('click'); // remove this fxn after using it once, so we can reuse the button
					$('.rating').attr('checked',false);
	    			qdata.response = response;
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