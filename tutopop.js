tutoPop = function(tutArr, color, index, nextCB, closeCB) {
	// This variable is the structure for our tutorial dialog box
	var tutBox = function(text, x, y, side) {
	  x = x + "px" || "50%";
	  y = y + "px" || "50%";
	  side = side || "top";

	  return $("<div>").addClass("tut-box").css({
	  	"position": "fixed",
	    "top": y,
	    "left": x,
	  	"transform": "translate(-50%, -50%) scale(0.9)",
	  	"min-width": 15 * 16 + "px",
	  	"max-width": 15 + 16 + "px",
	  	"padding": "16px",
	  	"border-radius": "16px",
	  	"background-color": bgColor,
	  	"color": textColor,
	  	"box-shadow": "0 0 " + .4 * 16 + "px 0 black",
	  	"opacity": "0"
	  }).html(
	    $("<div>").append(
	      $("<div>").addClass("arrow " + side).css({
	      	"overflow": "hidden",
	      	"position": "absolute",
	      	"width": 3.5 * 16 + "px",
	      	"height": 1.75 * 16 + "px",
	      	"top": (side === "top") ? -1.75 * 16 + "px" : (side === "right") ? "50%" : (side === "bottom") ? "100%" : "50%",
	      	"left": (side === "top") ? "50%" : (side === "right") ? "100%" : (side === "bottom") ? "50%" : "0%",
	      	"transform": (side === "top") ? "translate(-50%, 0) rotateZ(0deg)" : (side === "right") ? "translate(-25%, -50%) rotateZ(90deg)" : (side === "bottom") ? "translate(-50%, 1%) rotateZ(180deg)" : "translate(-75%, -50%) rotateZ(-90deg)"
	      }).html( $("<div>").css({
	      	"transform": "rotateZ(45deg)",
	      	"display": "block",
	      	"margin": .75 * 16 + "px auto 0",
	      	"background-color": bgColor,
	      	"width": "32px",
	      	"height": "32px",
	      	"box-shadow": "0 0 " + .4 * 16 + "px 0 black"
	      }) ),
	      $("<p>").html(text),
	      $("<div>").css({
	      	"background-color": "#004B6E",
	      	"height": "1px",
	      	"margin": .5 * 16 + "px 0",
	      	"opacity": "0.5"
	      }),
	      $("<div>").css({
	      	"width": "50%",
	      	"display": "inline-block",
	      	"text-align": "left"
	      }).html(
	        $("<span>").addClass("quit").css({
	        	"cursor": "pointer"
	        }).html("X")
	      ),
	      $("<div>").css({
	      	"width": "50%",
	      	"display": "inline-block",
	      	"text-align": "right"
	      }).html(
	        $("<span>").addClass("next").css({
	        	"cursor": "pointer"
	        }).html("Next")
	      )
	    )
	  );
	};

	return {
		timeline: function(options) {
			options = options || {};
			bgColor = "#9be0ff",
			textColor = "#017ab1";
			
			if(color && typeof color === "object") {
				bgColor = (color[0]) ? color[0] : bgColor,
				textColor = (color[1]) ? color[1] : textColor;
			}
			
			tutArr = tutArr || [],
			index = index || 0,
			nextCB = nextCB || null,
			closeCB = closeCB || null;

			// box for highlighting
			var tutHighlight = function(x, y, width, height, radius) {
			  x = x + "px" || "50%";
			  y = y + "px" || "50%";
			  width = ((width + 32) || "100") + "px";
			  height = ((height + 32) || "100") + "px";
			  radius = (radius || "16") + "px";

			  opacity = options.opacity || ".5";
			  color = options.color || "black";

			  return $("<div>").addClass("tuto-highlight").css({
			    "position": "fixed",
			    "top": y,
			    "left": x,
			    "width": width,
			    "height": height,
			  	"transform": "translate(-50%, -50%)",
			  	"box-shadow": "0 0 0 1920px " + color + ", inset 0 0 16px 10px " + color,
          "border-radius": radius,
          "opacity": opacity
			  });
			};

			// This is the function that brings together all of the components created above
			// It initiates the tutorial dialog box.
			// Here we pass in the array, index (optional), callback for next (optional), and callback for close (optional)
			var tutRun = function(arr, ind, nextFunc, closeFunc) {
			  ind = ind || 0;
			  var thisHLBox = (options.highlight) ? new tutHighlight(arr[ind].highlightX + 16, arr[ind].highlightY + 16, arr[ind].highlightWidth, arr[ind].highlightHeight, arr[ind].highlightRadius) : "";
			  var thisTutBox = new tutBox(arr[ind].msg, arr[ind].dialogX + 16, arr[ind].dialogY + 16, arr[ind].side);

			  $("body").append($(thisHLBox), $(thisTutBox));
			  setTimeout(function() {
			    $(thisTutBox).css({
			    	"transition": ".5s all",
			    	"opacity": "1",
			    	"transform": "translate(-50%, -50%) scale(1)"
			    });
			  }, 100);

			  if( Math.ceil($(thisTutBox).offset().left + $(thisTutBox).width() + 16) >= $(document).width() ) {
			    $(thisTutBox).css("left", ($(document).width() - ($(thisTutBox).width() / 2)) - 16);
			  }

			  if( Math.floor($(thisTutBox).offset().left) <= 0 ) {
			    $(thisTutBox).css("left", (0 + $(thisTutBox).width() / 2) + 16);
			  }
			  
			  if( Math.ceil($(thisTutBox).offset().top + $(thisTutBox).height() + 16) >= $(document).height() ) {
			    $(thisTutBox).offset().css("top", $(document).height() - $(thisTutBox).height());
			  }
			  
			  if( Math.floor($(thisTutBox).offset().top) <= 0 ) {
			    $(thisTutBox).offset().css("top", 0 + 16);
			  }
			  
			  $(thisTutBox).find(".next").on("click", function() {
			  	$(thisHLBox).remove();
			  	thisHLBox = null;
			    $(thisTutBox).remove();
			    thisTutBox = null;
			    if(nextFunc && typeof nextFunc === "function") { nextFunc(arr, ind, nextFunc, closeFunc); };
			    if(ind < arr.length-1) { tutRun(arr, ind+1, nextFunc, closeFunc); nextFunc = null; };
			  });
			  $(thisTutBox).find(".quit").on("click", function() {
			    if(closeFunc && typeof closeFunc === "function") { closeFunc(arr, ind, nextFunc, closeFunc); nextFunc = null; };
			    $(thisHLBox).remove();
			    thisHLBox = null;
			    $(thisTutBox).remove();
			    thisTutBox = null;
			  });
			}
			tutRun(tutArr, index, nextCB, closeCB);
		},
		oneTime: function() {
			bgColor = "#9be0ff",
			textColor = "#017ab1";
			
			if(color && typeof color === "object") {
				bgColor = (color[0]) ? color[0] : bgColor,
				textColor = (color[1]) ? color[1] : textColor;
			}
			
			tutArr = tutArr || [],
			index = index || 0,
			nextCB = nextCB || null,
			closeCB = closeCB || null;

			// This is the function that brings together all of the components created above
			// It initiates the tutorial dialog box.
			// Here we pass in the array, index (optional), callback for next (optional), and callback for close (optional)
			var tutRun = function(tut, ind, nextFunc, closeFunc) {
			  ind = ind || 0;
			  var thisTutBox = new tutBox(tut.msg, tut.dialogX + 16, tut.dialogY + 16, tut.side);

			  $("body").append($(thisTutBox));
			  setTimeout(function() {
			    $(thisTutBox).css({
			    	"transition": ".5s all",
			    	"opacity": "1",
			    	"transform": "translate(-50%, -50%) scale(1)"
			    });
			  }, 100);

			  if( Math.ceil($(thisTutBox).offset().left + $(thisTutBox).width() + 16) >= $(document).width() ) {
			    $(thisTutBox).css("left", ($(document).width() - ($(thisTutBox).width() / 2)) - 16);
			  }

			  if( Math.floor($(thisTutBox).offset().left) <= 0 ) {
			    $(thisTutBox).css("left", (0 + $(thisTutBox).width() / 2) + 16);
			  }
			  
			  if( Math.ceil($(thisTutBox).offset().top + $(thisTutBox).height() + 16) >= $(document).height() ) {
			    $(thisTutBox).offset().css("top", $(document).height() - $(thisTutBox).height());
			  }
			  
			  if( Math.floor($(thisTutBox).offset().top) <= 0 ) {
			    $(thisTutBox).offset().css("top", 0 + 16);
			  }
			  
			  $(thisTutBox).find(".next").on("click", function() {
			    $(thisTutBox).remove();
			    if(nextFunc && typeof nextFunc === "function") { nextFunc(tut, ind, nextFunc, closeFunc); };
			  });
			  $(thisTutBox).find(".quit").on("click", function() {
			    if(closeFunc && typeof closeFunc === "function") { closeFunc(tut, ind, nextFunc, closeFunc); nextFunc = null; };
			    $(thisTutBox).remove();
			  });
			}
			for(var tut in tutArr) {
				tutRun(tutArr[tut], index, nextCB, closeCB);
			}
		}
	}
};