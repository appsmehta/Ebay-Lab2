var mongo = require('../../routes/mongo');
var crypto = require('crypto');
var loginDatabase = "mongodb://localhost:27017/login";
var mongoURL = "mongodb://localhost:27017/login";

var ProcessOrder = function (msg,callback){

	console.log("Inside RabbitMQ Order processing");

	var product_id = msg.product_id,
		buyer = msg.buyer,
		quantity = msg.quantity,
		updatedQuantity = msg.updatedQuantity ;
		mongo.connect(mongoURL, function(){
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = mongo.collection('products');

		coll.update({"product_id":product_id},{
					$push: {
						'orders': {
								'buyer': buyer,
								'quantity': quantity
						        }
					      }
				}, function (err,result){

					console.log("After processing order");
					if(err)
						console.log(err);
					else {
						//console.log(result);

					callback(null,{OrderProcessed:true});

					}



				});

		coll.update({"product_id":product_id},{

					$set: {

						"item_quantity":updatedQuantity 
					}

				});
	});



}

exports.ProcessOrder = ProcessOrder;