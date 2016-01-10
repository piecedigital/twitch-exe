# Main

The purpose of [main.js](https://github.com/piecedigital/twitch-exe/blob/master/main.js) is to host all of the functions that I need out of the way of my React JS file.

The contents of main.js include:

* A method for communication with the electron API. This method is assigned variable is called `remote`, which shares the module of the same name. With this variable I am able to communicate with an Electron module to read and write file data.
* An XHR function under the variable name `ajax`. It has been structured to mirror that of the jQuery AJAX function (at least in the fashion that I use it).
* Various `Object` methods that emulate their `Array` method counterparts. These methods include `push`, `include`, `resortObject`, `splice`, and `map`. `resortObject` is obviously not an `Array` method. It's there to reassign the "indexes" (the properties) of the object values. These were experimental and no longer in use.
* One array method: `include`. This emulates the behavior of the ES7 method of the same name. Unlike `Array.indexOf`, `Array.include` returns a boolean value rather than `-1` or a number equal to or greater than `0`.
* Various `HTMLElement` methods. Because I'm not using jQuery for this project I've had to create all of the jQuery methods that I would normally use from jQuery. These methods include `addClass`, `removeClass` `toggleClass`, `hasClass`, `css`, `parent`, `remove`.