var request = require('supertest');
var api = require('../index.js');
var host = process.env.API_TEST_HOST || api;
host.use(function(err, req, res, next){
		if(err)
			console.log("An error has occurred: "+err);
		next();
	});
request = request(host);
 

describe('Damas-core - Server NodeJs [API]', function() {
	
	describe(' CRUD - Create', function() {
		var dataOk = {
			"node" : {
				"type" : "node Test", 
				"link" : {
					"type_link" :"normal", 
					"src_id": 1031241,
					"tgt_id": 546992 
				}
			}
		};
		var jsonEmpty  = {};
		var stringTest = 'Foo';
		var jsonNull   = null;
	
		it('should to throw an error (JSON Empty)', function(done) {
			request
				.post('/')
				.set('Accept', 'application/json')
				.send(jsonEmpty)
				.expect(400)
				.end(done)
		});
		it('should to throw an error (JSON expected, string found )', function(done) {
			request
				.post('/')
				.set('Accept', 'application/json')
				.send(stringTest)
				.expect(409)
				.end(done)
		});
		it('should to throw an error (JSON expected, null found )', function(done) {
			request
				.post('/')
				.set('Accept', 'application/json')
				.send(jsonNull)
				.expect(400)
				.end(done)
		});
		it('should create an object in the database', function(done) {
			request
				.post('/')
				.set('Accept', 'application/json')
				.send(dataOk)
				.expect('Content-Type', /application\/json/)
				.expect(201)
				.end(done);
		});
	});
	// //Tests for READ
	describe(' CRUD - Read', function() {
		var notExistId = '552fdc00d0bc266248e1eb08';
		var validId    = '5535b33d6b4e27a35fc7a54c';
		var badId      = '5535b3';

		it('should throw an error 404 (id not found in db)', function(done) {
			request
				.get('/' + notExistId)
				.set('Accept', 'application/json')
				.expect(404)
				.end(done)
		});
		it('should get a document from db (id exists)', function(done) {
			request
				.get('/' + validId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(200)
				.end(done)
				// .end( function(err, res){
				// 	var body = res.body;
				// 	console.log(body);
				// 	done(err);
				// })
		});
		it('should throw an error 404 (id not valid)', function(done) {
			request
				.get('/' + badId)
				.set('Accept', 'application/json')
				.expect(404)
				.end(done)
		});
		it('should throw an error 400 (id empty - without params) - Bad request', function(done) {
			request
				.get('/')
				.set('Accept', 'application/json')
				.expect(400)
				.end(done)
		});
	});
});