//super simple rpc server example
var amqp = require('amqp')
, util = require('util');
var user = require('./services/user');
var ads = require('./services/ads');
var cart = require('./services/cart');

var cnn = amqp.createConnection({host:'127.0.0.1'});
var mongoSessionConnectURL = "mongodb://localhost:27017/login";

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.loginConsumer(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	console.log("listening on signup_queue");

	cnn.queue('signup_queue',function(q) {
		q.subscribe(function(message,headers,deliveryInfo,m) {
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.signUpConsumer(message,function(err,res) {
				
				cnn.publish(m.replyTo,res,{
					contentType:"application/json",
					contentEncoding:"utf-8",
					correlationId:m.correlationId
				});
			})
		})
	})

	console.log("listening on Ad_queue");
	cnn.queue('Ad_queue',function(q) {
		q.subscribe(function(message,headers,deliveryInfo,m) {
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));



			switch(message.func){

				case "PostAd" :
						ads.PostAd(message,function(err,res) {
				
							cnn.publish(m.replyTo,res,{
								contentType:"application/json",
								contentEncoding:"utf-8",
								correlationId:m.correlationId
							});
						});
						break;
				case "PostAuction" :
						ads.PostAuction(message,function(err,res){

							cnn.publish(m.replyTo,res,{
								contentType:"application/json",
								contentEncoding:"utf-8",
								correlationId:m.correlationId
							});
						});
						break;
				case "RegisterBid" :
						ads.RegisterBid(message,function(err,res){

							cnn.publish(m.replyTo,res,{
								contentType:"application/json",
								contentEncoding:"utf-8",
								correlationId:m.correlationId
							});

						});
						break;
				

						
			}
			
		})
	})

	console.log("listening on order_queue");
	cnn.queue('Order_queue',function(q) {
		q.subscribe(function(message,headers,deliveryInfo,m) {
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.func)
			{
				case "ProcessOrder":
				cart.ProcessOrder(message,function(err,res) {
				cnn.publish(m.replyTo,res,{
					contentType:"application/json",
					contentEncoding:"utf-8",
					correlationId:m.correlationId
				});
			})
				break;
			}
			
		})
	});

console.log("listening on User queue");
	cnn.queue('User_queue',function(q) {
		q.subscribe(function(message,headers,deliveryInfo,m) {
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.func)
			{
				case "UpdateProfile":
				user.UpdateProfile(message,function(err,res) {
				cnn.publish(m.replyTo,res,{
					contentType:"application/json",
					contentEncoding:"utf-8",
					correlationId:m.correlationId
				});
				});
				break;


			}
			
		})
	});


});


