var mainApp = angular.module('mainApp');

mainApp.controller('adsController',function($scope,$http){
	console.log("ads controller called");


	$http({
			method: 'GET',
			url: '/getAds'
				}).success(function(data){
					$scope.items = data.ads;
					$scope.itemsincart = data.itemsincart;
					$scope.orderedqts = data.orderedquantities;
					console.log(data);

				}).error(function(){
					alert("error ads ");			
				});


  $http({

    method: 'GET',
    url: '/getAuctions'
      }).success(function(auctiondata){

        //alert(auctiondata);

        $scope.AuctionItems = auctiondata.auctions;
        console.log(auctiondata);

        $scope.highestbids = auctiondata.highestbids;
        
        /*console.log("date is"+auctiondata.auctions[0].posted_at );
         var numberOfDaysToAdd = 4;
         var expires = new Date(auctiondata.auctions[0].posted_at);
         expires.setDate(expires.getDate() + 4);
      console.log(expires); */
       





      }).error(function(error){

        console.log("error auctions " + error);

      })


	



	$scope.addItem = function(product,orderQuantity)
  {

  	console.log(orderQuantity);
  	 $http.post('/addItem',{"product":product,"quantity":orderQuantity})
  	 .then(function (response)

  	 {
  	 	console.log(JSON.stringify(response.data));
  	 	if(response.data.statusCode==200)
  	 	{
  	 	
  	 		$scope.itemsincart = response.data.itemsincart;
  	 		$scope.orderedqts = response.data.orderedquantities;
  	 	}
  	 }


  	 )
  }

  $scope.removeItem = function(product,qty)
  {

    console.log(product+" quantity"+qty);

    $http.post('/removeItem',{product,qty})
    .then(function(response)

    {

      console.log(JSON.stringify(response.data));
      //$scope.items = data.ads;
          $scope.itemsincart = response.data.itemsincart;
          $scope.orderedqts = response.data.orderedquantities; 

    }




      )

  }


  $scope.registerBid = function(AuctionItem,bidAmount)
  {


    console.log("Bid called for:"+AuctionItem.item_name,bidAmount);
     $http.post('/registerBid',{"Auctionitem":AuctionItem,"bidAmount":bidAmount})
     .then(function(response)
     {


      console.log(response);
     })



  }

});