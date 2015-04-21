
var http     = require('http'),
	https    = require('https'),
	express  = require('express'),
	app      = express(),
<<<<<<< HEAD
	db 		 = require('./db'),
=======
>>>>>>> mathieu/master
	fs		 = require('fs'),
	conf 	 = require('./conf.json'),

	routes = require('./routes')(app);


var confConn = conf.connection;

//Options for https connection

var options = {
	key  : fs.readFileSync(confConn.pathKey + confConn.keyFile),
	cert : fs.readFileSync(confConn.pathKey + confConn.cerFile)
};

<<<<<<< HEAD

		if(!module.parent){
		//Creation server http & https
			var serverhttp  = http.createServer(app).listen(confConn.portHttp);
			    serverhttps = https.createServer(options, app).listen(confConn.portHttps);
		}
		else {
			module.exports = app;
		}
	
=======
//Creation server http & https
var serverhttp  = http.createServer(app).listen(confConn.portHttp);

    serverhttps = https.createServer(options, app).listen(confConn.portHttps);
>>>>>>> mathieu/master
