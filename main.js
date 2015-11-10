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

var parseHTML = function(text) {
  var el = document.createElement("p");
  el.innerHTML = text;
  console.log(el)
  console.log(el.querySelector("p"))
  return el
}