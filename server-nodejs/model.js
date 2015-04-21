var mongo  = require('mongodb'),
    conf   = require('./conf'),
    Server = mongo.Server,
    Db     = mongo.Db,
    ObjectId = mongo.ObjectID;

module.exports = function Model() {

//START: --------------MONGODB--------------
    // Data about connection is in the file conf.json
    var dataMongo  = conf.mongoDB,
        server     = new Server(dataMongo.host, dataMongo.port, dataMongo.options),
        db         = new Db(dataMongo.collection, server),
        collection = db.collection(dataMongo.collection);
 
//END: ----------------MONGODB--------------

  /**
    * Creates a node providing its internal type value. Doesn't check parent node existence.
    * @param {JSON Object} JSON Object containing the values of the fields to create for this node
    * @param {function} callback - Function callback to routes.js
  */
  this.create = function(keys, callback) {
    var self = this;

    //console.log('Add: ' + JSON.stringify(keys));
    db.open(function(err, db){
      if(err)
        callback(err);
      else {
        collection.insert( keys, {safe:true}, function(err, records) {
          if (err) 
            callback(err);
          else {
             //console.log('Success: ' + JSON.stringify(records));
            self.read(keys._id, callback);
          }
        });
      } 
    });
  };

  /**
   * Get key->values combinations for a given node
   * @param {Integer} $id of the node
   * @param {function} callback - Function callback to routes.js
   */
   this.read = function(id,callback){
     db.open(function(err, db){
      if(err)
        callback(err);
      else {
        collection.findOne( {'_id': new ObjectId(id)}, function(err, item) {
          if(err)
            callback(err);
          else {
            callback(null, item);
            }
        });
      }
    });
  };

  /**
   * Update the keys of a node. Specified keys overwrite existing keys, others are left untouched.
   * A null key value removes the key.
   * @param {Integer} $id node index
   * @param {Array} $keys keys Array of key/value pairs to update (usually comming from json_decode)
   * @param {function} callback - Function callback to routes.js
   */
   this.update = function(id, keys, callback) {
    var keyToRemove = {};
    var keyToAdd = {};
    var hasKeyToRemove=false;
    var hasKeyToAdd=false;
    for(var k in keys){
      if(keys[k]===null){
        keyToRemove[k]='';
        hasKeyToRemove= true;
      }
      else{
        keyToAdd[k]=keys[k];
        hasKeyToAdd=true;
      }
    }
    var self = this;

    db.open(function(err, db){
      if(err)
        callback(err);
      else {
       if(hasKeyToAdd && hasKeyToRemove)
          collection.updateOne({'_id':new ObjectId(id)}, {$set:keyToAdd, $unset:keyToRemove}, function(err, result) {
            if (err)
              callback(err, null);
            else
              self.read(id, callback);
          });
        else if(hasKeyToAdd)
          collection.updateOne({'_id':new ObjectId(id)}, {$set:keyToAdd}, function(err, result) {
            if (err)
              callback(err, null);
            else
              self.read(id, callback);
          });
        else if(hasKeyToRemove)
          collection.updateOne({'_id':new ObjectId(id)}, {$unset:keyToRemove}, function(err, result) {
            if (err)
              callback(err, null);
            else
              self.read(id, callback);
          });
      }
    });
  }

  /**
    * Recursively delete a node - WARNING: this function doesn't check anything before removal
    * @param {Integer} $id node index
    * @param {function} callback - Function callback to routes.js
  */
  this.deleteNode = function(id, callback) {
    db.collection('node', function(err, collection) {
      if (err)
        callback(err);
      else {
        collection.deleteMany({$or:[{'_id':new ObjectId(id)},{'tgt_id':id},{'src_id':id}]}, function(err, result) {
          if (err)
            callback(err, null);
          else{
            callback(null, result);
          }
        });
      }});
  }
};
