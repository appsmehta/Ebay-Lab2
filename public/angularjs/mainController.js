var mainApp = angular.module("mainApp");


mainApp.controller('mainController', [ '$scope', '$http','sessionservice', function($scope, $http,sessionservice) {

$scope.sessionusername = sessionservice.getuserdetails();
 
 console.log("main controller called");
	/*.then(function(data) {
    	 $scope.sessionusername=data;
    	console("got service data:"+$scope.sessionusername);
});*/

	console.log("Getting session details: username is ")
	console.log(sessionservice.getuserdetails());
	if($scope.sessionusername==undefined)
	{
		console.log("Not logged in");
	}

	$scope.clickedSignin = function()
	{
		//alert("clicked");
				$http({
						method: 'GET',
						url: '/signIn'
				}).success(function(data){
					alert(data);
				}).error(function(){
					alert("error");			
				});
	}




}]);
