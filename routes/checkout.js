var winston = require('../log.js');
exports.home = function (req,res)
{
		console.log("checkout page details:");
		console.log(req.session.cartqty);
		console.log(req.session.checkoutAmount);
		winston.info("Clicked:checkout");

		if(req.session.username!=undefined){

		{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('checkout',{data:null,"username":req.session.username,"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty,"cost":req.session.checkoutAmount});}
	}	

	  	else

	{
		res.redirect('/')
	}


};

exports.getCart = function (req,res)
{



		res.json({"itemsincart":req.session.cartitems,"orderedquantities":req.session.cartqty,"cost":req.session.checkoutAmount});

}