var mainApp = angular.module("mainApp");

mainApp.controller("checkoutController",function($scope,$http)

{
	$scope.foundErrors = false;

  $http.get('/getCart')

  		.success(function(data)
  		{

  			$scope.itemsincart = data.itemsincart;
  			$scope.orderedquantities = data.orderedquantities;
  			$scope.cost = data.cost;

  		})

  $scope.processCard = function(){

  	$http.post('/processCard',{"number":$scope.cardNumber,"username":$scope.cardName,"expiry_month":$scope.expiry_month,"expiry_year":$scope.expiry_year,"password_cvv":$scope.password_cvv})
  	.success(function(data){

  		console.log(data);

  	}

  		)
  	.error(function(data)
  	{
  		$scope.foundErrors = true;
  		console.log("printing");
  		$scope.errors= data.data;
  		console.log(data);
  	})


  }





}


	);