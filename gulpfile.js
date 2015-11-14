var gulp = require("gulp");
var sass = require('node-sass');
var fs = require("fs");

function renderSass() {
	sass.render({
	  file: "./main.scss",
	  outputStyle: "nested",
	  outFile: "./main.css"
	}, function(err, result) {
		if(err) throw err;

		//console.log(result.css.toString());
		fs.writeFile('./main.css', result.css.toString(), function (err) {
		  if (err) throw err;

		  console.log('CSS rendered and saved');
		});
	});
}

gulp.task("serve", function() {
	gulp.watch(["*.scss"]).on("change", renderSass);
	//gulp.watch(["*.html", "*.css"]).on("change", reload);
});

gulp.task("default", ["serve"]);