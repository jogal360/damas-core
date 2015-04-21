var mongo  = require('mongodb'),
    conf   = require('./conf'),
    Server = mongo.Server,
    Db     = mongo.Db;
var dataMongo  = conf.mongoDB;	


var connectToServer = function(callback){ 
	    // Params of connection are in the file conf.json
    var dataMongo  = conf.mongoDB,
        server     = new Server(dataMongo.host, dataMongo.port, dataMongo.options),
        db         = new Db(dataMongo.collection, server);

        db.open(function(err, obj){
        	if(err)
        		callback(err);
        	else
        		callback(null, db);     		
        });
  }

module.exports = connectToServer;

