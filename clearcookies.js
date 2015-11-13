exports.clearCookies = function() {
  console.log("cookies cleared\r\n\r\n");
  mainWindow.webContents.session.cookies.remove({
    url: "http://localhost:8181"
  }, function(err) {
    if(err) throw err;
  });
}