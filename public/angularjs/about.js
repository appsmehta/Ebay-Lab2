var mainApp = angular.module('mainApp');

mainApp.controller('aboutController',function($scope,$http,sessionservice){

	$scope.loggedinuser = sessionservice.getuserdetails();

	$scope.showAbout = true;
	$scope.showBought = false;
	$scope.showSold = false;
	$scope.showBids = false;

	$http({
		method: 'GET',
		url: '/aboutProfile'
	}).success(function(data){
					//alert("printing response");
					//alert(JSON.stringify(data));
					$scope.aEmail = data.email;
					$scope.afirstName = data.firstName;
					$scope.alastName = data.lastName;
					$scope.ahandle = data.handle;
					$scope.abday =  new Date(data.birthday);
					$scope.acontact = data.contactinfo;
					$scope.alocation = data.location;



				}).error(function(){
					alert("error");			
				});


				$scope.updateAbout = function () 
				{

					$http ({

						method : 'POST',
						url: '/updateAbout',
						data:{
							"email" : $scope.aEmail,
							"firstName" : $scope.afirstName,
							"lastName" : $scope.alastName,
							"handle" : $scope.ahandle,
							"birthday" : $scope.abday,
							"contactinfo": $scope.acontact,
							"location" : $scope.alocation,
						}
					})

					.success (function(data)
					{
						alert("profile updated");
					}


					)
					.error(function(){
						alert("error");			
					});
					
				}


				$scope.showBoughtItems = function ()
				{

					$scope.showAbout = false;
					$scope.showBought = true;
					$scope.showSold = false;
					$scope.showBids = false;

					$http({

						method : 'GET',
						url:'/getBoughtItems'
					})
					.success(function(data){


						$scope.boughtItems = data.data;
						console.log($scope.boughtItems);
					})
					.error(function(data){

						console.log(data);

					})




				}

				$scope.showSoldItems = function()
				{

					$scope.showAbout = false;
					$scope.showBought = false;
					$scope.showSold = true;
					$scope.showBids = false;


					$http({

						method : 'GET',
						url:'/getSoldItems'
					})
					.success(function(data){

						console.log(data);
						$scope.soldItems = data.data;
						console.log($scope.soldItems);
					})
					.error(function(data){

						console.log(data);

					})

				}

				$scope.showBids = function() {

					$scope.showAbout = false;
					$scope.showBought = false;
					$scope.showSold = false;
					$scope.showBids = true;


					/*$http.post('/concludeAuction')
					.success(function(response){

						console.log(response);


					})
					.error(function(error){

						console.log(error);
					})*/

					$http.get('/MyBidResults')
					.success(function(response){

						console.log(response)

						$scope.MyBids = response.data;
						
					})
					.error(function(response){

						console.log(error);
					})


				}
				

				





			});

