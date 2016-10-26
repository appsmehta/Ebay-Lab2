var mainApp = angular.module("mainApp");



mainApp.service("sessionservice", function()
{

  var susername ="";
  console.log("service called")
//alert("inside username set");


this.setuserdetails = function(username)
{
	susername=username;
	//alert("username set to:"+this.susername);
}

this.getuserdetails= function()
{
	return susername;
}



});







