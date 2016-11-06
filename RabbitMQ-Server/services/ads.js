var mongo = require('../../routes/mongo');
var crypto = require('crypto');
var loginDatabase = "mongodb://localhost:27017/login";
var mongoURL = "mongodb://localhost:27017/login";
function PostAd(msg,callback) {
		var ProductObject  = msg.product;
		console.log("inside Ads consumer", ProductObject);
		var collectionName = "products";
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection(collectionName);
			coll.insert(ProductObject, function(err,Ad){
				console.log(Ad);
				if(Ad)
				{
					console.log(Ad);
					callback(null,{AdPosted:true});
				}
				else{
					console.log(err);
					callback(err,{AdPosted:false});
				}
			});	
		});
}
function PostAuction(msg,callback) {
		var ProductObject  = msg.product;
		console.log("inside Auction consumer", ProductObject);
		var collectionName = "products";
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection(collectionName);
			coll.insert(ProductObject, function(err,Auction){
				console.log(Auction);
				if(Auction)
				{
					console.log(Auction);
					callback(null,{AuctionPosted:true});
				}
				else{
					console.log(err);
					callback(err,{AuctionPosted:false});
				}

			});	
		});
}

function RegisterBid(msg,callback){

	var product_id = msg.product_id,
	value = msg.value,
	bidder = msg.bidder,
	bid_amount = msg.bid_amount,
	bid_time = msg.bid_time
	console.log("Inside RabbitMQ bid register");
	mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('products');
				coll.update({'product_id':product_id},{
					$push: {
						'bids': {
								'bid_id':value,
								'bidder': bidder,
								'bid_amount': bid_amount,
								'bid_time': bid_time,
								'bid_status': "active"

					        }
					      }
				},function(err,result){
					console.log("After update");
					if(err)
						console.log(err);
					else {
						console.log(result);

					callback(null,{BidPosted:true});
					}
				});
			});
}
exports.PostAuction = PostAuction;
exports.PostAd = PostAd;
exports.RegisterBid = RegisterBid;