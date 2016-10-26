
/*
 * GET home page.
 */
var winston = require('../log.js');
exports.index = function(req, res){

if(req.session){
		if(req.session.cartitems==undefined)
  	{	
      req.session.cartitems = [];
  		req.session.cartqty =[];
  		req.session.checkoutAmount = 0;
    }
	}


console.log("Username is "+req.session.username);
if(req.session.username!=undefined){


console.log("inside if "+req.session.username+" last:"+req.session.previous_logged_in);
  res.render('index', { title: 'Ebay MarketPlace',"username":req.session.username,"previous_logged_in":req.session.previous_logged_in});
  

  }

  else
  {
  	console.log("inside else"+req.session.username);
  	res.render('index', { title: 'Ebay MarketPlace',"username":req.session.username,"previous_logged_in":req.session.previous_logged_in});
  
  }
};