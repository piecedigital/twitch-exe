var ajax = function(optionsObj) {
  optionsObj = optionsObj || {};

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(data) {
  	if(httpRequest.readyState === 4) {
  		if(httpRequest.status < 400) {
        optionsObj.success(data);
  		} else {
        optionsObj.error(data);
      }
  	}
  }
  
  httpRequest.open((optionsObj.type || "GET"), optionsObj.url);
  httpRequest.send((optionsObj.data || null));
}

HTMLElement.prototype.addClass = function() {
  var arr = [];

  for(var i in arguments) {
    if(!this.className.match(arguments[i])) {
      arr[i] = arguments[i];
    }
  }

  if(arr.length > 0) {
    this.className += ( ((this.className) ? " " : "") + arr.join(" ") );
  }
  arr = null;
};

HTMLElement.prototype.removeClass = function() {
  if(this.className.match(arguments[0])) {
    var match = new RegExp("(\s)?" + arguments[0] + "", g);

    this.className = this.className.replace(match, "");

    match = null;
  }
};