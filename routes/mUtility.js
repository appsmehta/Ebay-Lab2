var mongo = require("./mongo");
 var mongoURL = "mongodb://localhost:27017/login";
    exports.getNextSequence = function(name) {
    mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);
    var coll = mongo.collection('counters');
    coll.findAndModify(
            {
            query: { _id: name },
            $set: { $inc: { seq: 1 } },
            new: true,
            upsert: true
        	}, function(err,counter){
            	if(counter)
            		console.log("counter is "+counter);
            	else
            		console.log("err"+err);
            	var ret = counter;
            	return ret.seq;
            }
   );
});
}

exports.getNewNextSequence = function(name,callback){
    var MongoClient = require("mongodb").MongoClient;
    var autoIncrement = require("mongodb-autoincrement");
    var collectionName = name;
MongoClient.connect(mongoURL, function (err, db) {
    autoIncrement.getNextSequence(db, collectionName, function (err, autoIndex) {
        var collection = db.collection(collectionName);
        collection.insert({
            _id: autoIndex
        }, function(error,nextValue){
            console.log(nextValue.insertedIds[0]);
            callback(nextValue.insertedIds[0]);
        });
    });
});
}