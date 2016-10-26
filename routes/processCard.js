var winston = require('../log.js');
var ejs = require("ejs");
var mysql = require('./mysql');

exports.validate = function (req,res){

	winston.info("Clicked:PayNow");
	
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
	//data [0] = DateValid;
	
	
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

				var checkoutQuery = "insert into orders (`ad_id`,`item_name`,`seller_name`, `buyer`,`cost`, `qty`) values ('"+orderedItem.adv_id+"','"+orderedItem.item_name+"','"+orderedItem.seller_name+"','"+req.session.username+"','"+(orderedItem.item_price*req.session.cartqty[item])+"','"+req.session.cartqty[item]+"');";
				console.log("Query is:"+checkoutQuery);

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

				},checkoutQuery);

				var updatedQuantity = orderedItem.item_quantity - req.session.cartqty[item]; 
				console.log(updatedQuantity);

				var updateAdQuery = "update advertisements set item_quantity='"+updatedQuantity+"' where `adv_id`='"+orderedItem.adv_id+"';";

				console.log("Query is:"+updateAdQuery);

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

				},updateAdQuery);




        	}


		res.json({"StatusCode":200});
		res.end();
	}
	
	else
		{
		console.log("invalid");
		res.status(500).json({data:validations});
		res.end();
	    }
		
	
}