var mainApp = angular.module("mainApp");

mainApp.controller("headerController", function($http,$scope,sessionservice)

{

	console.log("inside headerController");


	$scope.loggedinuser = sessionservice.getuserdetails();
	console.log(sessionservice.getuserdetails());
})