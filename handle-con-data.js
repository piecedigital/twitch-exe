var fs = require("fs");

exports.loadConcurrentData = function(func) {
	fs.readFile("./concurrent-data/user.json", "utf8", function(err, data) {
		if(err) {
			if(err.errno == "-4058") {
				var userData = {
					username: "",
					wentThroughTut: {
						options: false,
						viewer: false
					}
				};
				console.log(userData)
				exports.saveConcurrentData(userData, func);
			}
		} else {
			func(data);
			console.log("user data", data);
		}

	});
};

exports.saveConcurrentData = function(objData, func) {
	fs.writeFile("./concurrent-data/user.json", JSON.stringify(objData), "utf8", function(err) {
		if(err) throw err;

		console.log("user data saved");
		if(typeof func === "function") {
			func(JSON.stringify(objData))
		}
	});
};