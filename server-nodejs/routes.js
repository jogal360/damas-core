module.exports = function(app){

	var mongoModel 	= require('./model.js'),
		helpers		= require('./helpers'),
	    bodyParser 	= require('body-parser'),
		methodOverride = require('method-override');

		mod      	= new mongoModel();

	//Middlewares
	app.use(bodyParser.urlencoded({extended : true}));
	app.use(bodyParser.json());
	
	app.use(methodOverride(function(req, res){
	  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	    // look in urlencoded POST bodies and delete it
	    var method = req.body._method;
	    delete req.body._method;
	    return method;
	  }
	}));
	//Handle errors
	app.use(function(err, req, res, next){
		if(err)
			console.log("An error has occurred: "+err);
		else
			next();
	});

	/* CRUD operations */
	create = function(req, res) {
		var obj_keys = Object.keys(req.body);
		var keys = req.body;
		//Empty keys
		if(obj_keys === '' || !obj_keys || obj_keys.length === 0){
			res
				.status(400)
				.send('Bad command');
		}
		else{
			//Invalid JSON
			if(!helpers.isValidJson((keys))){
				res
					.status(409)
					.send('create Error, please change your values');
			}
			
			//Correct Format - keys
			else {
				mod.create(keys, function(error, doc){
					if(error){
						res
							.status(409)
							.send('create Error, please change your values');
					}
					else {
						res
							.status(201)
							.send(doc);
					}
				});	
			}
		}
	};

	read = function(req,res) {
		var id;
		if(req.params.id)
			id = req.params.id;
		else if(req.body.id)
			id = req.body.id;
		if(!id || id=="undefined")
			res
				.status(400)
				.send('Bad command');
		else {
			if(! helpers.isValidObjectId(id))
				res
						.status(404)
						.send('Id not found');

			else {
				mod.read(id, function(error, doc){
					if(error){
						res
							.status(409)
							.send('Read Error, please change your values');
					}
					else {
						if(doc === null){
							res
								.status(404)
								.send('Id not found');
						}
						else {
							res
								.status(200)
								.send(doc);
						}
					}
				});
			}
		}
	};

	update = function(req, res){
		var id;
		var keys = req.body;
		if(req.params.id)
			id   = req.params.id;
		else if(keys.id){
			id   = keys.id;
			delete keys.id;
		}
		if( Object.keys(keys).length === 0 || id === "undefined")
			res
				.status(400)
				.send('Bad command');
		else {
			if(! helpers.isValidObjectId(id))
				res
					.status(404)
					.send('Id not found');
			else {
				mod.update(id, keys, function(error, doc){
					if(error)
						res
							.status(409)
							.send('Update Error, please change your values');
					else
						res
							.json(doc);
				});
				
			}
		}
	};

	deleteNode = function(req, res){
		var id;
		if(req.params.id)
			id = req.params.id;
		else if(req.body.id)
			id = req.body.id;
		if(id)
			mod.deleteNode(id, function(error, doc){
				if(error)
					res
						.status(409)
						.send('delete Error, please change your values');
				else
					res
						.status(200)
						.send(doc.result.n + " documents deleted.");
			});
		else
			res.status(400).send("Bad command");
	};

	app.get('/:id', read);
	app.get('/', read);
	app.post('/', create);
	app.put('/:id', update);
	app.put('/', update);
	app.delete('/:id', deleteNode);
	app.delete('/', deleteNode);

}
