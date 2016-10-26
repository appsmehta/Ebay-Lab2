var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var crypto = require('crypto');
var dateFormat = require('dateFormat');
require('ejs');
var winston = require('../log.js');

exports.authenticate= function(req,res){
	console.log("inside Mongo signin register");
	winston.info("Clicked: Log In");
	var username = req.param('username');
	var password = req.param('password');
	
	console.log(username+password);
	
	var salt = "theSECRETString";
	password = crypto.createHash('sha512').update(password + salt).digest("hex");

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.findOne({email: username, password:password}, function(err, user){
			if (user) {
				console.log(username);

				req.session.username = username;

				req.session.previous_logged_in = user.last_logged_in;
				//dateFormat(user.last_logged_in, "yyyy:mm:dd HH:MM:ss");
				// This way subsequent requests will know the user is logged in.
				req.session.firstName = user.firstName;
				req.session.lastName = user.lastName;

				var previous_logged_in=user.last_logged_in;
				console.log("Previous login:"+previous_logged_in);
				var now = new Date();
				console.log(now);
				var mydate = dateFormat(now, "yyyy:mm:dd HH:MM:ss");
				console.log(mydate);


					coll.update({'email':username},{$set:{'last_logged_in':mydate},function(err,result){

						console.log(result);
					}
				});




				
				console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200,"username":req.session.username,"previous_logged_in":req.session.previous_logged_in};
		    res.send(json_responses);

				

			} else {
				console.log("returned false");
				console.log(err);
				res.send("Na thyu !");
			}
		});
	});


	//password = crypto.createHash('sha512').update(password + salt).digest("hex");


	
	//var checkUser = "select * from users where email='"+username+"' and password ='"+password+"'";
	
	//console.log("Query is:"+checkUser);
	/*mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				req.session.username = username;
				req.session.previous_logged_in = dateFormat(results[0].last_logged_in, "yyyy:mm:dd HH:MM:ss");
				var previous_logged_in=results[0].last_logged_in;
				console.log("Previous login:"+previous_logged_in);
				var now = new Date();
				console.log(now);
				var mydate = dateFormat(now, "yyyy:mm:dd HH:MM:ss");
				console.log(mydate);
				var updateLastLoginQuery = "update users set `last_logged_in`='"+mydate+"' where `email`='"+req.session.username+"';";
				console.log("Session initialized");
			    json_responses = {"statusCode" : 200,"username":req.session.username,"previous_logged_in":"n/a"};
		    res.send(json_responses);


		}
		else {    
			
			console.log("Invalid Login");
			res.send("Na thyu !");
		}

		
	}  
},checkUser); */

}

exports.signup = function(req,res){


	winston.info("Clicked: Register");
	console.log("inside Mongo signup register");
	//console.log(req);

	var emailId = req.param('inputemail');
	reenteredemail=req.param('inputreenteredemail');
	password=req.param('inputpassword');
	firstName=req.param('inputfirstName');
	lastName=req.param('inputlastName');

	console.log(emailId+reenteredemail+password+firstName+lastName);

	var salt = "theSECRETString";
	password = crypto.createHash('sha512').update(password + salt).digest("hex");

	
	console.log(password);


	mongo.connect(mongoURL, function(){
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('users');

	coll.insert({email:emailId,password:password,firstName:firstName, lastName: lastName}, function(err,user){

			if(user)
			{
			console.log("registered: "+user.email);
			console.log(user);
			res.send("OK");
			}
			else
				console.log(err);

		})
});


}