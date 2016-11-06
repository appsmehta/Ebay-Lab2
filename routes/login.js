var winston = require('../log.js');
exports.signIn = function(req, res){
	winston.info("Clicked:Signin");
	console.log("Called login ");
  	res.render("login",{selectedSignIn : "false",selectedRegister : "true"});
  	res.end();
};