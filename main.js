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
  console.log("ADD CLASS");
  var classNameArr = (this.className || "").split(" ");
  console.log("classNameArr", classNameArr);

  for(var i = 0; i < arguments.length; i++) {
    if( classNameArr.indexOf(arguments[i] < 0) ) {
      classNameArr.push(arguments[i]);
    }
  }

  console.log("className", this.className);
  this.className = classNameArr.join(" ");
  console.log("className", this.className);

  classNameArr = null;

  return this;
};

HTMLElement.prototype.removeClass = function() {
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
};

HTMLElement.prototype.toggleClass = function() {
  if(this.className.match(arguments[0])) {
    this.removeClass(arguments[0]);
  } else {
    this.addClass(arguments[0]);
  }
  return this;
};