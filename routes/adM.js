var ejs = require('ejs');
var mysql = require('./mysql');
require("client-sessions");
var dateFormat = require('dateformat');
var now = "2016-10-13T10:48:31.000Z";
var winston = require('../log.js');


const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
   
    new (winston.transports.File)({
      filename: `${logDir}/bids.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});



exports.ad = function(req,res) {

	winston.info("Clicked: Daily Deals");
	if(req.session.username!=undefined)
	{	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("ads",{"username":req.session.username});
	}

	else

	{
		res.redirect('/')
	}



}

exports.getAds = function(req,res) {



	if(req.session.username!=undefined)
	{
		winston.info("Requested all ads");

		var getAdquery = "select * from advertisements";
		console.log("Query is:"+getAdquery);

		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){

					console.log(results[0]);

					res.json({'ads':results,"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty});
				}
				else {
				}

			}

		},getAdquery);


	}

	else {

		res.json({"logged-in":"false"})
	}

}

exports.getAuctions = function(req,res){

	winston.info("Requested all auctions");
	console.log("Trying dateformat");

	console.log(dateFormat(now, "fullDate"));



		/*if(req.session.username!=undefined)
		{*/

			var getAuctionquery = "select * from auctions where status='in-progress' AND expires >= NOW()";
			console.log("Query is:"+getAuctionquery);
				//var highestbids = [];

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						if(results.length > 0){

							console.log("first callback result " + results[0]);

							console.log("calling the bids function");
							getHighestBids(results, function(highestbids){
								for (var result in results)
								{
									console.log("result is " + result);
									console.log("GOt the highest bid for :"+results[result].item_name+" as $:"+highestbids[result]);

								}
								console.log("sent json");
								res.json({'auctions':results,'highestbids':highestbids});	

							});


						/*for (var result in results)

						{	
							console.log("Before querying highest bid for:"+results[result].item_name);

							console.log("for "+results[result].item_name+" auction id is :"+results[result].auction_id);
							var getHighestBidQuery = "select * from bids where bid_amount = (select max(bid_amount) from bids where auction_id = '"+results[result].auction_id+"');";


									mysql.fetchData(function(error,bidresults){
										if(err){
											throw err;
											}
										else 
										{
											if(bidresults.length > 0){

										        	console.log(JSON.stringify(results[result]));
										        	highestbids[result] = bidresults[0]; 
										       
										        	//console.log("For Item:"+results[result].item_name +" highest bid is :"+highestbids[result].bid_amount);
											
												}
									 		else {

									 				console.log("Bidding else of "+results[result].item_name);
									 			 }

										}

										},getHighestBidQuery);



						}

						for (result in results)
						{
							
							//console.log("For Item:"+results[result].item_name +" highest bid is :"+highestbids[result].bid_amount);
							console.log(JSON.stringify(highestbids[result]));
						}*/





					}
					else {
					}

				}

			},getAuctionquery);


		/*}

		else {

			res.json({"logged-in":"false"})
		}*/




	}


	exports.postAd = function (req,res) {


	//if(req.session.username!=undefined)
	{
		console.log(req.body.item_quantity);

		winston.info("Clicked:Post Ad");

		var postAdquery = "insert into advertisements (`item_name`, `item_description`, `seller_name`, `item_price`, `item_quantity`) values ('"+req.body.item_name+"','"+req.body.item_description+"','"+req.session.username+"','"+req.body.item_price+"','"+req.body.item_quantity+"');";
		console.log("Query is:"+postAdquery);

		mysql.storeData(function(err,results){
			if(err){
				res.json({"statusCode":500})
				throw err;
			}
			else 
			{
				if(results.length > 0){

					console.log(results[0]);

					res.json({ user: 'tobi' })
					res.end();
				}
				else {
				}

			}

		},postAdquery);
	}
}


exports.postAuction = function(req,res) {

	winston.info("Clicked:Post Auction");
	var expirydate = new Date();
	expirydate.setDate(expirydate.getDate() + 4);
	console.log(expirydate);
	expirydate=dateFormat(expirydate,"yyyy-mm-dd HH:MM:ss");
	console.log("expires:"+expirydate);

	var postAuctionQuery = "insert into auctions(`item_name`, `item_description`, `seller_name`, `item_price`,`status`,`expires`) values ('"+req.body.item_name+"','"+req.body.item_description+"','"+req.session.username+"','"+req.body.item_price+"','in-progress','"+expirydate+"');";
	console.log("Query is:"+postAuctionQuery);

	//INSERT INTO `ebay_schema`.`auctions` (`item_name`, `item_description`, `seller_name`, `item_price`, `status`) VALUES ('Auction1', 'Item2', 'apoorvmehta@sjsu.edu', '200', 'in-progress');

	mysql.storeData(function(err,results){
		if(err){
			res.json({"statusCode":500})
			throw err;
		}
		else 
		{
			if(results.length > 0){

				console.log(results[0]);

				res.json({ user: 'tobi' })
				res.end();
			}
			else {
			}

		}

	},postAuctionQuery);



}





exports.addtoCart = function(req,res){
	winston.info("Clicked: Add to Cart on:"+req.body.product.item_name);
	req.session.cartitems.push(req.body.product);
	req.session.cartqty.push(req.body.quantity);
//console.log("cost for :"+req.body.product.item_name+" is:"+(req.body.product.item_price*req.body.quantity));
req.session.checkoutAmount = req.session.checkoutAmount + (req.body.product.item_price*req.body.quantity)
//console.log(req.body.product+"ordered quantity"+req.body.quantity);
	//console.log(req.session.cartitems);
	res.json({statusCode:200,"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty});


}

exports.removeFromCart = function(req,res){
winston.info("Clicked: Remove from Cart on:"+req.body.product.item_name);
	console.log("remove cart called");
	console.log(req.body.product+" and quantity"+req.body.qty);
	console.log(req.session.cartitems[req.body.product]);

	console.log("removing");

	req.session.cartitems.splice(req.body.product,1);
	req.session.cartqty.splice(req.body.product,1);
	req.session.checkoutAmount = req.session.checkoutAmount - (req.body.product.item_price*req.body.qty)
	console.log("new items in cart:");
	console.log(req.session.cartitems);
	;res.json({statusCode:200,"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty})

	//console.log(req.session.cartitems);

	/*function checkProduct(element){

		console.log(element);

		return true;*/
		//return element==req.body.product;
		

//	var position = req.session.cartitems.findIndex(checkProduct);

	//req.session.cartitems.findIndex(checkProduct);

	//console.log(position);



}



exports.sellHome = function(req,res){

	if(req.session.username!=undefined)
	{
		res.render("sell",{"username":req.session.username});
	}

	else

	{
		res.redirect('/')
	}

}

exports.registerBid = function(req,res){

	logger.info("User:"+req.session.username+" bid for "+req.body.Auctionitem.item_name+ "item id:"+req.body.Auctionitem.auction_id+" Amount:"+req.body.bidAmount);	

	console.log("Bid to server for:"+req.body.Auctionitem.item_name+" worth $: "+req.body.bidAmount);

	console.log(req.body.Auctionitem.auction_id + " "+ req.session.username + " "+ req.body.bidAmount + " "+ "active");

	var insertBidQuery = "Insert into bids (`auction_id`,`bidder`,`bid_amount`,`bid_status`) values ('"+req.body.Auctionitem.auction_id+"','"+ req.session.username +"','"+ req.body.bidAmount+"','active');";

	mysql.storeData(function(err,results){
		if(err){
			res.json({"statusCode":500})
			throw err;
		}
		else 
		{
			if(results.length > 0){

				console.log(results[0]);

				res.json({ user: 'tobi' })
				res.end();
			}
			else {
			}

		}

	},insertBidQuery);




}



var getHighestBids = function (auctions, callback) {


	var highestBids = []; 
	var rows = [];
	var i = 0;

	for (var auctionitem in auctions)
	{

		console.log("Before querying highest bid for:"+auctionitem);

		console.log("for "+auctions[auctionitem].item_name+" auction id is :"+auctionitem);
		var getHighestBidQuery = "select * from bids where bid_amount = (select max(bid_amount) from bids where auction_id = '"+auctions[auctionitem].auction_id+"') AND auction_id ='"+auctions[auctionitem].auction_id+"' ;";


		mysql.fetchBlockingData(getHighestBidQuery, function(response){

			if(response[0]!=null){
				console.log("Now setting highest bid for......... "+ response[0].auction_id);

				highestBids.push(response[0]);
			}

			console.log("auctionitem " + i);

			i++;	


			if(i == auctions.length){
				console.log("final callback called");
				callback(highestBids);
			}

		});					

		





	}

}




exports.concludeAuction = function (req,res){

	console.log("inside Auction processor function");


	var expiredItems = "select * from auctions where expires <= NOW()";
	var highestBidforresult = [];

	mysql.fetchData(function(err,results){

		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0)
			{
				console.log("expired Auction items:");
				console.log(results);


				getHighestBids(results, function(highestbids){
					for (var result in results)
					{
						console.log("result is " + result);
						if(highestbids[result]!=undefined)
						{
							console.log("GOt the highest bid for :"+results[result].item_name+" as $:"+highestbids[result].bid_id);
							var updateLostBidQuery = "update bids set bid_status = 'lost' where auction_id='"+results[result].auction_id+"' AND bid_id !='"+highestbids[result].bid_id+"'";
							mysql.storeData(function(error,updatedResults){

								console.log("updated lost bids for :"+results[result].auction_id);
							},updateLostBidQuery);


							var updateWonBidQuery = "update bids set bid_status = 'won' where auction_id='"+results[result].auction_id+"' AND bid_id ='"+highestbids[result].bid_id+"'";

							mysql.storeData(function(error,updatedResults){

								console.log("updated won bids for :"+results[result].auction_id);

							},updateWonBidQuery);

						}

					}

				})




			}
		}
	},expiredItems);




}


