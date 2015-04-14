module.exports = function(app){
var mongoMod = require('./model.js'),

	bodyParser = require('body-parser'),
	mod      = new mongoMod();
	app.use(bodyParser.urlencoded({extended : true}));
	app.use(bodyParser.json());

read = function(req,res) {
	var id= req.params.id;
	mod.read(id, function(error, doc){
		if(error){
			res.status(500).send(error);
		}
		else if (!error && doc){
			res.json(doc);
		}
		else
			res.send('Aucun document ne possede cet id.');
	});
};

create = function(req,res) {
	var keys=req.body;
	var result= mod.create(keys);
	res.send(keys._id);
};

update= function(req, res){
  var id = req.params.id;
  var keys=req.body;
  var result= mod.update(id,keys, function(error, doc){
		if(error){
			res.status(500).send(error);
		}
		else if (!error && doc){
			res.json(doc);
		}
		else
			res.send('Aucun document ne possede cet id.');
	});
};

deleteNode= function(req, res){
  var id = req.params.id;
  var result= mod.deleteNode(id, function(error, doc){
		if(error){
			res.status(500).send(error);
		}
		else if (!error && doc){
			res.json(doc);
		}
		else
			res.send('Aucun document ne possede cet id.');
	});
};

app.get('/:id', read);
app.post('/', create);
app.put('/:id', update);
app.delete('/:id', deleteNode);
}
