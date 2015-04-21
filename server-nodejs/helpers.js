var mongo 		= require('mongodb'),
	ObjectId    = mongo.ObjectID;

module.exports = {
	/**
    * Check if an object is a valid json
    * @param {JSON Object} JSON Object containing the keys - values
    * @return {boolean} true if is valid, false otherwise
  	*/
	isValidJson : function(keys){
		for(var val in keys){
			var y;
			if(Object.prototype.hasOwnProperty.call(keys,  val)){
				y = keys[val];
				if(y = '' || y=== null || y===''){
					return false;
				}
			}
		}
		return true;
	},
	/**
    * Check if an object is a valid ObjectId
    * @param {Object} Object containing an id
    * @return {boolean} true if is valid, false otherwise
  	*/
	isValidObjectId : function(id){
		if(ObjectId.isValid(id)) 
      		return true;
    	else
      		return false;

	}
}