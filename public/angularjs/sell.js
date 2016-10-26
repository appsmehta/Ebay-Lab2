var mainApp = angular.module('mainApp');

mainApp.controller('SellController',function($scope,$http){
	console.log("Sell controller called");

	$scope.showNewAd=true;


	$scope.showform = function()
	{

		$scope.showNewAd=false;
	}


	$scope.PostAd= function(){

		console.log("printing"+$scope.item_quantity);
		if($scope.adType=='sale')
		{

			

			$http.post('/postAd',{"item_name":$scope.item_name,"item_description":$scope.item_description,"item_price":$scope.item_price,"item_quantity":$scope.item_quantity})
			.then(function(response){

				console.log(response);
			})

		}

		if($scope.adType=='Auction')

		{

			$http.post('/postAuction',{"item_name":$scope.item_name,"item_description":$scope.item_description,"item_price":$scope.item_price})
			.then(function(response){



				console.log(response);


			})


		}



	}

	});