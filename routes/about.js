var ejs = require('ejs');
var mysql = require('./mysql');
var auctions = require('./adM');
require("client-sessions");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var winston = require('../log.js');
var mq_client = require('../rpc/client');

var about = function (req,res){
	if(req.session.username!=undefined){

		winston.info("Clicked About profile");
	
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('about',{"username":req.session.username});
}

else {
	res.redirect('/')
	}
}



var getProfileM = function (req,res){


	if(req.session.username!=undefined)
	{
		console.log("inside Mongo profile fetch");
		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		
		coll.findOne({email: req.session.username}, function(err, user){
			if (user) 
			{
				console.log(user);
				res.send({"email":user.email,"firstName":user.firstName,"lastName":user.lastName,"birthday":user.birthday,"handle":user.handle,"contactinfo":user.contactinfo,"location":user.location})
			} 
			else {
				throw err;
				}
		});		
	
		});
	}
}

var updateProfileM = function (req,res){
	winston.info("Clicked :Update Profile Mongo");
	console.log('printing date');
	console.log(req.body.birthday.slice(0,10));

	var updatedUser = 
	{
		'firstName': req.body.firstName,
		'lastName': req.body.lastName,
		'handle' : req.body.handle,
		'birthday':req.body.birthday.slice(0,10),
		'contactinfo':req.body.contactinfo,
		'location':req.body.location,
		'email':req.body.email

	}

	var msg_payload = {
		'func': "UpdateProfile",
		 "UserObject" : updatedUser,
		 'username':req.session.username
	}

	mq_client.make_request('User_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				 res.status(500).json({UserUpdated:false});
			}
			if(results!=null && !response.userCreated){
				res.status(500).json({UserUpdated:false});
			}
			if(results.UserUpdated){
				console.log(results);
				res.send("Ok");
					res.end();
			}			

		});

}
var getBidResults = function(req,res){
	winston.info("Clicked :My Bids");
	console.log("Get bids for:"+req.session.username);
	var MyBidsQuery = "select auctions.auction_id,auctions.item_name, bids.* from auctions auctions INNER JOIN ebay_schema.bids bids ON bids.auction_id = auctions.auction_id where bidder='"+req.session.username+"';";
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

var getBoughtItemsM = function (req,res){

	winston.info("Clicked :Mongo My Orders");
	
		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');

	
		coll.aggregate([
							    
							    {$match: {'orders.buyer': req.session.username}},
							    {$project: {
							        item_name:1,
							        seller_name:1,
							        item_price:1,
							        orders: {$filter: {
							            input: '$orders',
							            as: 'order',
							            cond: {$eq: ['$$order.buyer', req.session.username]}
							        }},
							        _id: 0
							    }}
]).toArray(function(err,sales){

			var myshopping = []

			for(boughtProduct in sales){
				console.log(sales[boughtProduct].item_name);
				console.log(sales[boughtProduct].orders.length);

				for(var j=0;j<sales[boughtProduct].orders.length;j++){

					item = {
							'item_name' : sales[boughtProduct].item_name,
							'item_price': sales[boughtProduct].item_price,
							'seller_name':sales[boughtProduct].seller_name,
							'Qty':sales[boughtProduct].orders[j].quantity
							
						}

					myshopping.push(item);
				}

			}

			console.log(myshopping);
			res.send({"data":myshopping});
			
			});
		});

}
var getSoldItemsM = function (req,res){

	winston.info("Clicked : Mongo My Sold Items");

		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');

		coll.find( { $where: "this.orders.length > 1" , 'seller_name': req.session.username} ).toArray(function(err,sales){
			var myshopping = []

			console.log("Items Sold by:"+req.session.username);

			for(sale in sales)
			{
				for (order in sales[sale].orders)
				{
					console.log("Order for :"+sales[sale].item_name);
					console.log(sales[sale].orders[order].buyer + "bought :"+sales[sale].orders[order].quantity +" Sale Amount:"+(sales[sale].orders[order].quantity*sales[sale].item_price));
					
					item = {
							'item_name' :sales[sale].item_name,
							'buyer': sales[sale].orders[order].buyer,
							'cost':(sales[sale].orders[order].quantity*sales[sale].item_price),
							'qty':sales[sale].orders[order].quantity
							
						}

						myshopping.push(item);

				}

			}

			res.send({"data":myshopping});


		});
	});
	}
exports.about = about;
exports.getProfile = getProfileM;
exports.updateProfile = updateProfileM;
exports.getBoughtItems = getBoughtItemsM;
exports.getSoldItems = getSoldItemsM;
exports.getBidResults = getBidResults;


