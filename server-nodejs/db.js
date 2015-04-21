var mongo  = require('mongodb'),
    conf   = require('./conf'),
    Server = mongo.Server,
    Db     = mongo.Db;
var dataMongo  = conf.mongoDB;	


var connectToServer = function(callback){ 
	    // Data about connection is in the file conf.json
    var dataMongo  = conf.mongoDB,
        server     = new Server(dataMongo.host, dataMongo.port, dataMongo.options),
        db         = new Db(dataMongo.collection, server);
        //var _db = db;
        db.open(function(err, obj){
        	//console.log(db);
        	if(err){
        		console.log('errrrrrr');
        		callback(err);
        		}
        	else{
        		console.log('noooo   errrrrrr');
        		callback(null, db);
        		}
        });
  }

module.exports = connectToServer;

