var crypto = require('crypto');
var mysql = require('./mysql');
var dateFormat = require('dateFormat');
require('ejs');
var winston = require('../log.js');
exports.signup = function(req, res){
	winston.info("Clicked: Register");
	console.log("inside new signup register");
	var emailId = req.param('inputemail');
	reenteredemail=req.param('inputreenteredemail');
	password=req.param('inputpassword');
	firstName=req.param('inputfirstName');
	lastName=req.param('inputlastName');
	console.log(emailId+reenteredemail+password+firstName+lastName);
	var salt = "theSECRETString";
	password = crypto.createHash('sha512').update(password + salt).digest("hex");
	console.log(password);
	var getUser="Insert INTO users (`password`, `email`, `firstName`, `lastName`) VALUES ('"+password+"','"+emailId+"','"+firstName+"','"+lastName+"');";
	console.log("Query is:"+getUser);
	mysql.storeData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			console.log("entered data");
			console.log(results);

			res.send("OK");
		}
	},getUser);
}
exports.authenticate= function(req,res){
	console.log("inside signin register");
	winston.info("Clicked: Log In");
	var username = req.param('username');
	var password = req.param('password');
	
	console.log(username+password);
	
	var salt = "theSECRETString";
	password = crypto.createHash('sha512').update(password + salt).digest("hex");
	
	var checkUser = "select * from users where email='"+username+"' and password ='"+password+"'";
	
	console.log("Query is:"+checkUser);
	mysql.fetchData(function(err,results){
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
},checkUser);
}
exports.logout = function(req,res)
{
	winston.info("Clicked: Logout");
	req.session.destroy();
	res.redirect('/');
}
