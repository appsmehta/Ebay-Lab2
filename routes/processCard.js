var winston = require('../log.js');
var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var mq_client = require('../rpc/client');
var validateM = function (req,res){
	winston.info("Clicked: Mongo PayNow");
	console.log(req.body);
	var allValid=false;
	var validations=[];
	var DateValid = false, cvvValid = false,NumberValid=false;
	var cardName = req.param("username");
	var cardNumber = req.param("number");
	var expiry_month = parseInt(req.body.expiry_month);
	var expiry_year = parseInt(req.body.expiry_year);
	var cvv = parseInt(req.body.password_cvv);
	console.log("Expires : "+expiry_month+expiry_year);
	if(cardNumber.length==16)
		{
		NumberValid=true;
		}
	else
		{
		console.log("Not valid number");
		validations.push({"field":"Invalid Card Number"});
		}
	if(expiry_year>16)
		{
		console.log("future year valid");
		DateValid=true;
		}
	else if(expiry_year==16&&expiry_month>=(new Date().getMonth()))
		{
		console.log("current year valid");
		DateValid=true;
		}
	else
		{
		
		validations.push({"field":"Invalid Expiry Date"});
		}
	if(cvv>0&&cvv<1000)
		{
		console.log("cvv valid");
		
		cvvValid=true;
		}
	else{
	
		validations.push({"field":"Invalid CVV"});
	}
	
	
	if(DateValid&&cvvValid)
		{
		console.log(req.session.cartitems);
		console.log(req.session.cartqty);
        for(item in req.session.cartitems)
        	{
        		console.log(req.session.cartitems[item]);
        		var orderedItem = req.session.cartitems[item];
				var updatedQuantity = orderedItem.item_quantity - req.session.cartqty[item];
				console.log("updated Quantity:"+updatedQuantity);
				var msg_payload = {
					"func" : "ProcessOrder",
					 "product_id": orderedItem.product_id,
					 "buyer" : req.session.username,
					 "quantity" : req.session.cartqty[item],
					 "updatedQuantity":updatedQuantity
				}
				mq_client.make_request('Order_queue',msg_payload, function(err,results){
				console.log(results);
			if(err){
				 res.status(500).json({OrderProcessed:false});
			}
			if(results!=null && !response.userCreated){
				res.status(500).json({OrderProcessed:false});
			}
			if(results.OrderProcessed){
				res.json({"statusCode": 200 });
					res.end();
			}			
		})
        	}
        }
	else
		{
		console.log("invalid");
		res.status(500).json({data:validations});
		res.end();
	    }
}
exports.validate = validateM;