//super simple rpc server example
var amqp = require('amqp')
, util = require('util');
var user = require('./services/user');

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
});