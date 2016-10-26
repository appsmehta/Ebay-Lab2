var winston = require('../log.js');
exports.signIn = function(req, res){

	winston.info("Clicked:Signin");
	console.log("Called login ");
	//res.send("SignIN API success");
  //	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  	//res.render('login', { title : 'About'});

  	res.render("login",{selectedSignIn : "false",selectedRegister : "true"});
  	res.end();
};