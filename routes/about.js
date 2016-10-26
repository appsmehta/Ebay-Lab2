/**
 * New node file
 */
var ejs = require('ejs');
var mysql = require('./mysql');
var auctions = require('./adM');
require("client-sessions");
var winston = require('../log.js');
exports.about = function (req,res){
	if(req.session.username!=undefined){

		winston.info("Clicked About profile");
	
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('about',{"username":req.session.username});
}

else {
	res.redirect('/')
	
	/*res.end;*/
}
}

exports.getProfile = function (req,res){


	if(req.session.username!=undefined)
	{


		var getUserQuery = "select * from users where email='"+req.session.username+"'";
		console.log("Query is:"+getUserQuery);
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
			}
		else 
		{
			if(results.length > 0){

			console.log(results[0].birthday);

			res.send({"email":results[0].email,"firstName":results[0].firstName,"lastName":results[0].lastName,"birthday":results[0].birthday,"handle":results[0].handle,"contactinfo":results[0].contactinfo,"location":results[0].location})
				}
	 		else {
	 			 }

		}

		},getUserQuery);			
	
	}
}

exports.updateProfile = function (req,res){


		winston.info("Clicked :Update Profile");
	console.log('printing date');
	console.log(req.body.birthday.slice(0,10));

		var updateUserQuery = "update users set firstName='"+req.body.firstName+"', lastName = '"+req.body.lastName+"', handle = '"+req.body.handle+"', birthday = '"+req.body.birthday.slice(0,10)+"',contactinfo='"+req.body.contactinfo+"',location = '"+req.body.location+"' where email='"+req.body.email+"'";

	mysql.updateData(function(err,results){
		if(err){
			throw err;
			}
		else 
		{
			if(results.length > 0){

			console.log(results[0]);

			res.send({"email":results[0].email,"firstName":results[0].firstName,"lastName":results[0].lastName,"birthday":results[0].birthday,"handle":results[0].handle,"contactinfo":results[0].contactinfo,"location":results[0].location})
				}
	 		else {
	 			 }

		}

		},updateUserQuery);





	res.send("ok");

}


exports.getBoughtItems = function (req,res){

	winston.info("Clicked :My Orders");
	var boughtItemQuery = "select * from orders where buyer = '"+req.session.username+"';";


		mysql.fetchData(function(err,results){

			if(err){
			throw err;
			}
		else 
		{
			if(results.length > 0){

			console.log(results[0]);

			res.send({"data":results});
				}
	 		else {
	 			 }

		}

		},boughtItemQuery);


		

}


exports.getSoldItems = function (req,res){

	winston.info("Clicked :My Sold Items");
	var soldItemQuery = "select * from orders where seller_name = '"+req.session.username+"';";

	mysql.fetchData(function(err,results){

			if(err){
			throw err;
			}
		else 
		{
			if(results.length > 0){

			console.log(results[0]);

			res.send({"data":results});
				}
	 		else {
	 			 }

		}

		},soldItemQuery);



}

exports.getBidResults = function(req,res){

	//auctions.concludeAuction();
	winston.info("Clicked :My Bids");

	console.log("Get bids for:"+req.session.username);


	var MyBidsQuery = "select auctions.auction_id,auctions.item_name, bids.* from auctions auctions INNER JOIN ebay_schema.bids bids ON bids.auction_id = auctions.auction_id where bidder='"+req.session.username+"';";
	//SELECT auctions.auction_id,auctions.item_name, bids.* FROM ebay_schema.auctions auctions INNER JOIN ebay_schema.bids bids ON bids.auction_id = auctions.auction_id where bidder='apoorvmehta@sjsu.edu';

	mysql.fetchData(function(err,results){
		if(err){
				throw err;
				}
			else 
			{
				if(results.length > 0){

				console.log(results);

				res.send({"data":results});
					}
		 		else {
		 			 }

			}

			},MyBidsQuery);



}