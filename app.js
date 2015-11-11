var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var shell = require("shell");
var debug = require("debug")

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// pepper flash
// Specify flash path.
// On Windows, it might be /path/to/pepflashplayer.dll
// On OS X, /path/to/PepperFlashPlayer.plugin
// On Linux, /path/to/libpepflashplayer.so
app.commandLine.appendSwitch('ppapi-flash-path', __dirname + '/flash/pepflashplayer.dll');

// Specify flash version
app.commandLine.appendSwitch('ppapi-flash-version', '19.0.0.226');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    "width" : 700,
    "height" : 700,
    "node-integration" : "iframe",
    "web-preferences" : {
      "plugins" : true,
      "web-security" : false
    },
    "frame" : true,
    "icon" : __dirname + "/icon.png",
    "toolbar" : false,
    "auto-hide-menu-bar" : false,
    "title" :"Guide Cyberclub Chat"
  });

  // and load the index.html of the app.
  mainWindow.loadUrl(/*'file://' + */__dirname + '/index.html');

  mainWindow.on("close", function(e) {
    console.log('I do not want to be closed');

    // Unlike usual browsers, in which a string should be returned and the user is
    // prompted to confirm the page unload, Electron gives developers more options.
    // Returning empty string or false would prevent the unloading now.
    // You can also use the dialog API to let the user confirm closing the application.
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});