var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var ejs = require('ejs');
var mysql = require('./mysql');
require("client-sessions");
var dateFormat = require('dateformat');
var now = "2016-10-13T10:48:31.000Z";
var winston = require('../log.js');
var mUtility = require('./mUtility');
var mq_client = require('../rpc/client');

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

exports.addtoCart = function(req,res){
	winston.info("Clicked: Add to Cart on:"+req.body.product.item_name);
	console.log(req.body.product);
	req.session.cartitems.push(req.body.product);
	req.session.cartqty.push(req.body.quantity);
	req.session.checkoutAmount = req.session.checkoutAmount + (req.body.product.item_price*req.body.quantity)
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
				highestBids.push(response[0]);
			}
			console.log("auctionitem " + i);
			i++;	
			if(i == auctions.length){
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



var postAdMP = function (req,res) {


	//if(req.session.username!=undefined)
	{
		console.log(req.body.item_quantity);

		winston.info("Clicked: Mongo Post Ad");

		var posted_at = new Date();
		var expires_at = new Date();
		expires_at=expires_at.setTime(posted_at.getTime() + (4*86400000));
		posted_at = dateFormat(posted_at, "yyyy:mm:dd HH:MM:ss");	
		expires_at = dateFormat(expires_at, "yyyy:mm:dd HH:MM:ss");
		counterName="counters";
		mUtility.getNewNextSequence(counterName,function(value){
	console.log("found next id for: "+counterName);
	console.log(value);
		var product = 
		{
			'product_id': value,
			'item_name':req.body.item_name,
			'item_description':req.body.item_description,
			'seller_name':req.session.username,
			'item_price':req.body.item_price,
			'item_quantity':req.body.item_quantity,
			'sale_type':"sale",
			'posted_at': posted_at,
			'expires_at':expires_at,
			bids : [],
			orders: []							
		}
		var msg_payload = {
			"func" : "PostAd",
			 "product" : product
		}
		mq_client.make_request('Ad_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				 res.status(500).json({AdPosted:false});
			}
			if(response!=null && !response.userCreated){
				res.status(500).json({AdPosted:false});
			}
			if(results.AdPosted){
				res.json({ statusCode: 200 });
			}			
		})
	});
	}
}
	var postAuctionMP = function(req,res) {
		console.log(req.body.item_quantity);
		winston.info("Clicked: Mongo Post Auction");
		var posted_at = new Date();
		var expires_at = new Date();
		expires_at=expires_at.setTime(posted_at.getTime() + (4*86400000));
		posted_at = dateFormat(posted_at, "yyyy:mm:dd HH:MM:ss");	
		expires_at = dateFormat(expires_at, "yyyy:mm:dd HH:MM:ss");
		counterName="counters";
		mUtility.getNewNextSequence(counterName,function(value){
		var product = 
		{
			'product_id': value,
			'item_name':req.body.item_name,
			'item_description':req.body.item_description,
			'seller_name':req.session.username,
			'item_price':req.body.item_price,
			'item_quantity':req.body.item_quantity,
			'sale_type':"Auction",
			'posted_at': posted_at,
			'expires_at':expires_at,
			bids : [],
			orders: []							
		}
		var msg_payload = {
			"func": "PostAuction",
			"product": product
		}
		mq_client.make_request('Ad_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				 res.status(500).json({AuctionPosted:false});
			}
			if(response!=null && !response.userCreated){
				res.status(500).json({AuctionPosted:false});
			}
			if(results.AdPosted){
				res.json({ statusCode: 200 });
					res.end();
			}			
		})

	});
	}
var getAdsM = function(req,res) {
	if(req.session.username!=undefined)
	{
		winston.info("Requested Mongo all ads");
		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');
		coll.find({sale_type:'sale'}).toArray(function(err,sales){
			console.log(sales);
			res.json({'ads':sales,"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty});
			});
		});
	}
	else {
		res.json({"logged-in":"false"})
	}
}
var getAuctionsM = function(req,res) {
	if(req.session.username!=undefined)
	{
		winston.info("Requested Mongo all auctions");
		var now = new Date();
		now = dateFormat(now, "yyyy:mm:dd HH:MM:ss");	
		mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('products');
		coll.find({sale_type:'Auction',expires_at:{$gt:now}}).toArray(function(err,auctions){
			var highestbids = [];
			console.log(auctions);
			for(item in auctions){
				if(auctions[item].bids[0])
					{
						highestbids[item]=auctions[item].bids[0]
						console.log("found bid");
						console.log(auctions[item].bids[0]);
					}
			}
			res.json({'auctions':auctions});
			});
		});
	}
	else {
		res.json({"logged-in":"false"})
	}
}
var registerBidMP = function(req,res){

	logger.info("User:"+req.session.username+" bid for "+req.body.Auctionitem.item_name+ "item id:"+req.body.Auctionitem.auction_id+" Amount:"+req.body.bidAmount);	
	console.log("Bid to server for:"+req.body.Auctionitem.item_name+" worth $: "+req.body.bidAmount);
	console.log(req.body.Auctionitem.auction_id + " "+ req.session.username + " "+ req.body.bidAmount + " "+ "active");
	counterName="bidcounters";
		mUtility.getNewNextSequence(counterName,function(value){
			var now = new Date();
				console.log(now);
				var mydate = dateFormat(now, "yyyy:mm:dd HH:MM:ss");

				var msg_payload = {

					"func":"RegisterBid",
					 "product_id": req.body.Auctionitem.product_id,
					 'value':value,
					  "bidder":req.session.username,
					  "bid_amount":req.body.bidAmount,
					  "bid_time":mydate
				}


		mq_client.make_request('Ad_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				 res.status(500).json({BidPosted:false});
			}
			if(results!=null && !response.userCreated){
				res.status(500).json({BidPosted:false});
			}
			if(results.BidPosted){
				res.json({ statusCode: 200 });
					res.end();
			}			

		})
     });
}

exports.getAds = getAdsM;
exports.getAuctions= getAuctionsM;
exports.postAd = postAdMP;
exports.postAuction = postAuctionMP;
exports.registerBid = registerBidMP;