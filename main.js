window.$ = module.exports;
window.jQuery = module.exports;
var remote = require("remote");

var ajax = function(optionsObj) {
  optionsObj = optionsObj || {};

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(data) {
  	if(httpRequest.readyState === 4) {
  		if(httpRequest.status < 400) {
        optionsObj.success(data.target.response);
  		} else {
        optionsObj.error({
          "status": data.target.status,
          "message": data.target.statusText
        });
      }
  	}
  }
  
  httpRequest.open((optionsObj.type || "GET"), optionsObj.url);
  httpRequest.send((optionsObj.data || null));
}

HTMLElement.prototype.addClass = function() {
  if(this) {
    console.log("ADD CLASS");
    var classNameArr = (this.className || "").split(" ");
    console.log("classNameArr", classNameArr);

    for(var i = 0; i < arguments.length; i++) {
      if(!this.className.match(arguments[i])) {
        classNameArr.push(arguments[i]);
      }
    }

    console.log("className", this.className);
    this.className = classNameArr.join(" ");
    console.log("className", this.className);

    classNameArr = null;

    return this;
  }
};

HTMLElement.prototype.removeClass = function() {
  if(this) {
    console.log("REMOVE CLASS");
    var classNameArr = this.className.split(" ") || [];
    console.log("classNameArr", classNameArr);

    if( classNameArr.indexOf(arguments[0]) >= 0 ) {
      classNameArr.splice( classNameArr.indexOf(arguments[0]), 1 );
    }

    console.log("className", this.className);  
    this.className = classNameArr.join(" ");
    console.log("className", this.className);

    classNameArr = null;

    return this;
  }
};

HTMLElement.prototype.toggleClass = function() {
  if(this) {
    if(this.className.match(arguments[0])) {
      this.removeClass(arguments[0]);
    } else {
      this.addClass(arguments[0]);
    }
    return this;
  }
};

HTMLElement.prototype.hasClass = function(className) {
  if(this) {
    console.log("HAS CLASS");
    if(typeof className === "object") {
      var classNameArr = className;
    } else {
      var classNameArr = [className];
    }
    var result = false;

    for(var i in classNameArr) {
      if(this.className.match(classNameArr[i])) {
        result = true;
      }
    }

    console.log("result", result);

    return result;
  }
};

HTMLElement.prototype.css = function(property, value) {
  if(this) {
    console.log("APPLY CSS");

    if(typeof property === "string") {
      this.style[property] = value;
    } else {
      for(var prop in property) {
        this.style[prop] = property[prop];
      }
    }

    console.log("style", this.style);

    return this;
  }
};

HTMLElement.prototype.parent = function(property, value) {
  if(this) {
    console.log("RETURN PARENT");

    return (this.parentNode) ? this.parentNode : this.target.parentNode;
  }
};