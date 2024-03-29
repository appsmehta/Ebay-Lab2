
var mongo = require('../../routes/mongo');

var crypto = require('crypto');
var loginDatabase = "mongodb://localhost:27017/login";
var mongoURL = "mongodb://localhost:27017/login";

function loginConsumer(msg, callback){
	console.log("Before Mongo Connection");

        mongo.connect(loginDatabase, function(connection) {
        	var response = {};
        	var username = msg.email;
        	var password = msg.password; 
            var salt = "theSECRETString";
            password = crypto.createHash('sha512').update(password + salt).digest("hex");
            console.log("before mongo call,the password is :"+password);
            var loginCollection = mongo.collection('users', connection);
            var whereParams = {
                email:username,
                password:password
            }

            
                console.log("From passport got:"+username);
                loginCollection.findOne(whereParams, function(error, user) {

                    if(error) {
                        callback(err);
                    }

                    if(!user) {
                        response.invalidUser = true;
            			callback(null,response);
                    }

                    if(user.password != password) {
                        response.invalidPassword = true;
            			callback(null,response);
                    }

                    response.user = user;
         			callback(null, response);

                    connection.close();
                    console.log(user.email);
                    callback(null, response);
                });
            
        });

	};

function signUpConsumer(msg,callback) {
		var userObject  = msg;
		console.log("inside signup consumer",userObject);
		var collectionName = "users";
		var dataToStore = {email:userObject.email,password:userObject.password,firstName:userObject.firstName,lastName:userObject.lastName};
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection(collectionName);

			coll.insert(dataToStore, function(err,user){

				if(user)
				{
					
					console.log(user);
					callback(null,{userCreated:true});
				}
				else{
					console.log(err);
					callback(err,{userCreated:false});
					}

			});	
		});
}

var UpdateProfile = function (msg,callback) {

console.log("Inside Profile Update Rabbit MQ")

console.log(msg.UserObject);

mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');

        coll.update({'email':msg.username},{$set:msg.UserObject},function(err,result){

                        
                       
                        console.log(result);
                        callback(null,{UserUpdated:true});

                        
                });
        
    });
    res.send("ok");

}


exports.loginConsumer = loginConsumer;
exports.signUpConsumer = signUpConsumer;
exports.UpdateProfile = UpdateProfile;