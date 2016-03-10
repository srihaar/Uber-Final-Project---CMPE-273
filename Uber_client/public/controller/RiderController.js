var riderModule = angular.module("uberModule", ['ui.router','ngMap']);

riderModule.controller("RiderController", function($http, $scope, $rootScope, $state){
	var $rootScope = [];
	$state.go('Book');
});

riderModule.config(function($stateProvider, $urlRouterProvider) {


	  $stateProvider
	    .state("Profile", {
	    	views: {
	    		"viewProfile" : {
	    			  templateUrl : "/viewProfile",
	    			  controller  : function($scope , $http){
	    				  $http.get('/getUserDetails').success(function (response) {
  					        $scope.user = response;
  					        console.log("getuserdetails res", response);
  					        }).error(function(err) {
  					        alert(err);
  					        }); 
	    			}
	    	}}
	      
	    }).state("Book", {
	    	views: {
	    		"bookRide" : {
	    			  templateUrl : "/bookRide",
	    			  controller  : function($scope, $compile, $rootScope, $http, NgMap, $interval, $state) {
	    				  
	    				    var srcLat, srcLng, destLat, destLng;
	    					$scope.geocoder = new google.maps.Geocoder();
	    					$scope.source = "";
	    					$scope.destination = "";
	    					$rootScope.directions = [];
	    					$rootScope.currentPos = "current";
	    					$rootScope.curr = {};
	    					$scope.rideEstimate = "";
	    					$rootScope.address = "currentposition";
	    					$scope.showEstimate = false;
	    					var geocoder = new google.maps.Geocoder();
	    					 NgMap.getMap({id:'test'}).then(function(map) {
	    					      $rootScope.map = map;
	    					   
	    					    });
	    						
	    					    var userLat, userLng;	  
	    					    var getUserDetails = function() {
	    					        $http.get('/getUserDetails').success(function (response) {
	    					      }).error(function(err) {
	    					        alert(err);
	    					        });
	    					       } 
	    					    
	    					    $scope.getPrice = function()
	    					    {
	    					      
	    					    $http({
	    					    	method : 'post',
	    					    	url    : '/rideEstimate',
	    					    	data   : { driver : $rootScope.driverName ,
	    					    		       distance : $rootScope.distance ,
	    					    		       carType : $rootScope.carType ,
	    					    		       source_lat : $scope.source_lat, 
	    					    			   source_lng :$scope.source_lng}
	    					    }).success(function(data){
	    					    	console.log( data.rideEstimate + " this is the total price");
	    					    	$rootScope.totalPrice = data.rideEstimate;
	    					    	//$state.go('viewBill');
	    					    	
	    					    });
	    					    };
	    					   
	    						var refresh = function () {
	    							
	    							if (navigator.geolocation)
	    						        navigator.geolocation.getCurrentPosition(showPosition);			
	    							
	    						    else { 
	    						        alert("Geolocation is not supported by this browser.");
	    						    }		    
	    						}        
	    						refresh();
	    						getUserDetails();
	    						
	    						
	    						var testRefresh = function(userLat, userLng) {
	    						
	    						 	
	    				        $http({			    	
	    						 		    method: 'post',
	    						 		    url: '/listNearByDrivers',
	    						 		    data: {
	    						 		    	userLat: userLat,
	    						 		    	userLng: userLng,
	    						 		    	
	    						 		    }
	    						 	}).success(function(response) {
	    						 		console.log("resonse.data is : ",response.driverList);
	    						 		if(response.status == "success" ){
	    						 			var nearByDrivers = response.driverList;
	    						 			if(response.driverList.length > 0){
	    						 			var i;
	    						 			for(i=0 ; i < nearByDrivers.length; i++){
	    						 				nearByDrivers[i].rideBooked = "";
	    						 			 }
	    						 		  }
	    						 			$scope.nearByDrivers = nearByDrivers;
	    						 			
	    						 		}
	    						 	}).error(function (err) {
	    						 		    alert(err);
	    						 	});
        
	    						 }



	    						function showPosition(position) {
	    						    userLat = position.coords.latitude;
	    						    userLng = position.coords.longitude;
	    						    $rootScope.curr.lat = userLat;
	    						   	   $rootScope.curr.lng = userLng;
	    						
	    						    testRefresh(userLat, userLng);
	    						}
	    						$scope.positions = [ ];
	    						$scope.addMarker = function(event) {
	    							var ll = event.latLng;
	    							$scope.positions.push({
	    								lat : ll.lat(),
	    								lng : ll.lng()
	    							});
	    						}
	    						
	    					$scope.populateInfoWindow = function(event,test){
									$scope.driver2 = test;
									console.log($scope.driver2.driverId	);
									$http({
	    					    		method : 'get',
	    					    		url    : '/getDriverRating/'+$scope.driver2.driverId,
	    					    	}).success(function(data){
			    						 $scope.avgRating = data[0].rating;
			    					});
									$rootScope.map.showInfoWindow('bar');
								}
	    					
	    					var bookRidePostCall = function (driver) {
	    						$scope.getPrice();
	    						$scope.srcLat = srcLat;
	    						$scope.srcLng = srcLng;
	    						$rootScope.driverId = driver.driverId;
	    					    console.log("inside bookride post call,", driver);
	    					    var data = {}; 
	    					   setTimeout(function(){
	    						    data = {
	    		    					    driverId: driver.driverId,
	    		    				//	    customerId: 100000000,
	    		    				//	    riderName: 'userName',
	    		    					    driverName: driver.firstName,
	    		    				//	    riderPhone: '6692478815',
	    		    					    dropOffLocation: $scope.destination,
	    		    					    pickUpLocation: $scope.source,
	    		    					    srcLat: srcLat,
	    		    					    srcLng: srcLng,
	    		    					    destLat: destLat,
	    		    					    destLng: destLng,
	    		    					    totalPrice: $rootScope.totalPrice,
	    		    					    totalDistance: $rootScope.distance,
	    		    					    carType : $rootScope.carType
	    		    					}
	    						   console.log(" data sent to the db from bookridepostcall "+ JSON.stringify(data));
	    						    $http({
	    		    					method: 'post',
	    		    					url: '/bookARide',
	    		    					data: data
	    		    					}).success(function(response) {
	    		    					if(response.status == "success"){
	    		    					driver.rideBooked = "Your Ride is booked!";
	    		    					console.log("book ride success"+driver.rideBooked);
	    		    					console.log("book ride success", response);
	    		    					}
	    		    					}).error(function(err) {
	    		    					alert(err);
	    		    					})
	    					   },1000);
	    					console.log("data", data);
	    					
	    				}
	    					$scope.setPickup = function() {
	    					   	if(!$scope.source.length <= 0)
	    					   	geocoder.geocode({'address': $scope.source}, function(results, status) {
	    					   	$rootScope.address = $scope.source;
	    					   	  if (status === google.maps.GeocoderStatus.OK) {
	    					   	    userLat = results[0].geometry.location.lat();      
	    					   	    userLng = results[0].geometry.location.lng();
	    					   	    $rootScope.curr.lat = userLat;
	    					   	    $rootScope.curr.lng = userLng;
	    					   	    testRefresh(userLat, userLng);
	    					   	  }
	    					   	});	   	
	    					   	}
	    					   
	    					$scope.bookRide = function(driver){    
		    					$rootScope.driverName = driver.FirstName + " " + driver.LastName;
		    					$rootScope.carType = driver.carType;
		    					
		    					var statusCount = 0;
		    					
		    					geocoder.geocode({'address': $scope.source}, function(results, status) {
		    					   if (status === google.maps.GeocoderStatus.OK) {
		    					     
		    						   srcLat = results[0].geometry.location.lat();      
		    					       srcLng = results[0].geometry.location.lng();
		    					      
		    					   } else {
		    						   
		    						  
		    						   statusCount = statusCount + 1;
		    						
		    					   }
		    					});
		    				     geocoder.geocode({'address': $scope.destination}, function(results, status) {
		  	    					   if (status === google.maps.GeocoderStatus.OK) {
			  	    					   
		  	    						   destLat = results[0].geometry.location.lat();      
			  	    					   destLng = results[0].geometry.location.lng();
			  	    					  
		  	    					   
		  	    					   } else {
		  	    						 statusCount = statusCount + 1;
		  	    					   }
		  	    					 if(statusCount == 1 || statusCount == 2){
			    				    	 alert("Please enter both source and location");
			    				     }else{
			    				    	 bookRidePostCall(driver);
			    				     }
		    					});
	    					}
	    					
	    					 $scope.placeChanged = function() {
	    				     $scope.place = this.getPlace();
	    				     console.log(
	    				       $scope.place.geometry.location.lat(),
	    				       $scope.place.geometry.location.lng()
	    				     );
	    						}; 
	    						
	    								$scope.getLocation = function (source , destination ){
	    								$rootScope.currentPos = " ";
	    								$scope.source_lat ;
	    								$scope.source_lng;
	    								var dest_lat;
	    								var dest_lng;
	    								$rootScope.source_display = source ;
	    					    	    $rootScope.destination_display = destination;
	    								 
	    								$scope.mygc = new google.maps.Geocoder();
	    								$scope.mygc.geocode({'address' : source }, 
	    									function(results, status){
	    					
	    									 $scope.source_lat = results[0].geometry.location.lat();
	    									 $scope.source_lng = results[0].geometry.location.lng();
	    					    			}
	    								);
	    								$scope.mygc.geocode({'address' : destination }, 
	    									function(results, status){
	    									dest_lat = results[0].geometry.location.lat();
	    									dest_lng = results[0].geometry.location.lng();
	    									}
	    								);
	    					               
	    								setTimeout(function(){
	    									
	    									var origin = new google.maps.LatLng($scope.source_lat, $scope.source_lng);
	    									var dest   = new google.maps.LatLng(dest_lat, dest_lng);
	    					    		
	    									console.log("origin :" + source + " ,dest : " + destination);
	    									var directionsService = new google.maps.DirectionsService();
	    									var request = {
	    									    origin: origin, // LatLng|string
	    									    destination: dest, // LatLng|string
	    									    travelMode: google.maps.DirectionsTravelMode.DRIVING
	    									};

	    									directionsService.route( request, function( response, status ) {

	    				    			if ( status === 'OK' ) {
	    				        		var point = response.routes[ 0 ].legs[ 0 ];
	    				        		 console.log( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
	    				        		 $rootScope.duration = point.duration.text;
	    				        		 $rootScope.distance = point.distance.text;
	    				        		
	    				        		
	    				        	
	    				        		 if( $rootScope.distance != null && $scope.Car != null 
	    				        				 && $scope.source_lat !=null && $scope.source_lng !=null)
		    				        		 console.log("inside rideEstimate");
	    				        			 $http({
		    				        			 method : 'post',
		    				        			 url : '/rideEstimate',
		    				        			data : { distance : $rootScope.distance, 
		    				        				    carType : $scope.Car , 
		    				        				    source_lat : $scope.source_lat, 
		    				        				    source_lng :$scope.source_lng } 
		    				        		 }).success(function(data){
		    				        			 if(data.status == 200){
		    				        				 $scope.rideEstimate = data.rideEstimate;
		    				        				 $scope.showEstimate = true;
		    				        			 }
		    				        		 });
	    				    			}
	    								} );	
	    									
	    				               }, 1000);
	    								
	    								
	    							
	    							
	    						}

	    					}
	    					

	    	}}
	      
	    }).state("viewBill", {
	    	views: {
	    		"viewBill" : {
	    			  templateUrl : "/viewBill",
	    			  controller  : function($scope , $http, $rootScope){
	    			      $scope.review = ""; 
	    			    	  
	    			    	  
	    				  $scope.rateDriver = function(rating){
	    					  
	    					  $scope.driverRating = rating;
	    				  
	    				  }
	    				  $scope.date = new Date();
	    				  $scope.submitReview = function (){
	    			    	  console.log("printing driver id from submitReview function " + $rootScope.driverId);
	    					  $http({
	    						  method : 'post',
	    						  url    : '/submitCustomerReview',
	    						  data   : { rating : $scope.driverRating, review : $scope.review, driverId : $rootScope.driverId }
	    					  }).success(function(data){
	    						  if(data.status == 200){
	    							  console.log("review has been submitted successfully");
	    						  }
	    					  });
	    			    	  
	    			      }
	    			      
	    			}
	    	}}
	      
	    }).state("ViewRides", {
	    	views: {
	    		"viewRides" : {
	    			  templateUrl : "/listAllBills",
	    			  controller  : function($scope , $http, $rootScope, $state){
	    				  $http({
	    			        	url : '/listBills',
	    			        	method : 'get',
	    			        	cache  : true
	    			        }).success(function(results){
	    			        	
	    			        	    //console.log(JSON.stringify(results));
	    			        		$scope.tripDetails = results;
	    			        		
	    			        
	    			        });
	    				  
	    				  $scope.viewBill = function(trip){
	    					  	$rootScope.tripIndividual={};
	    					  	$rootScope.tripIndividual.Date = trip.Date;
	    					  	$rootScope.tripIndividual.pickupTime = trip.pickupTime;
	    					  	$rootScope.tripIndividual.dropoffTime = trip.dropoffTime;
	    					  	$rootScope.tripIndividual.carType = trip.carType;
	    					  	$rootScope.tripIndividual.totalDistance = trip.Distance;
	    					  	$rootScope.tripIndividual.amount = trip.amount;
	    					  	$rootScope.tripIndividual.pickupLocation = trip.SrcLocation;
	    					  	$rootScope.tripIndividual.dropoffLocation = trip.DestLocation;
	    					  	$rootScope.tripIndividual.driverName = trip.driverName;
	    					  	$rootScope.tripIndividual.isRated = trip.isRated;
	    					  	$rootScope.tripIndividual.driverID = trip.driverID;
	    					  //	$rootScope.tripIndividual.rating = ;
	    					  	console.log(trip.driverID);
	    					  	
	    					  	$state.go('viewIndividualBill');
	    				  }
	    			}
	    	}}
	      
	    }).state("BookedRide", {
	        views: {
	            "viewBooked" : {
	              url         : "/booked",
	              templateUrl : "/viewBookedRide",
	              controller  : function($scope , $http){
	              $http.get("/getBookedRide").
	              then(function(response) {
	             
	              if(response.data.success)
	           	{
	              $scope.bookedride = response.data.rideDetails;	
	                  console.log($scope.bookedride);
	              $scope.isbooked = true;
	           	}
	           	else
	           	{
	           	$scope.bookedride={};
	           	$scope.isbooked = false;
	           	}
	              }, function(response) {
	              console.log(response);
	              });
	           	 
	              $scope.cancelRide = function(rideid){	     
	            $http({
	            method : 'post',
	            url    : '/cancelRide',
	            data   : { rideid   : rideid }
	            }).then(function(response) {    	
	            console.log($scope.response);
	              alert("Your Ride has been cancelled");
	           	 	 	   	 
	              }, function(response) {
	              console.log(response);
	              });
	            };
	            }
	            }}

	          }).state("viewIndividualBill", {
	  	    	views: {
		    		"viewIndividualBill" : {
		    			  templateUrl : "/viewIndividualbill",
		    			  controller  : function($scope, $http, $rootScope){
		    				  
		    				  if($rootScope.tripIndividual.isRated == 1){
		    					  	
		    					 $http({
	  					    		method : 'get',
						    		url    : '/getIndividualDriverRating/'+$rootScope.tripIndividual.driverID,
						    		
						    	}).success(function(data){
		    						
		    							console.log(data[0].rating);
						    		 $rootScope.tripIndividual.rating = data[0].rating;
		    						 $scope.review  = data[0].review; 
		    						
		    					});
		    					  
		    					  
		    				  }
		    				  
		    				  $scope.initialReview = true;
		    				  $scope.review = ""; 
	    			    	  $scope.driverRating = 0 ;
	    			    	  $scope.rating = 2;
		    				  $scope.rateDriver = function(rating){
		    					  console.log("inside rateDriver" + rating);
		    					  $scope.driverRating = rating;

		    				  
		    				  }
		    				  
		    				  $scope.submitReview = function (){
		    					  
		    			    	  console.log("printing driver id from submitReview function " + $rootScope.tripIndividual.driverID);
		    					  $http({
		    						  method : 'post',
		    						  url    : '/submitCustomerReview',
		    						  data   : { rating : $scope.driverRating, review : $scope.review, driverId : $rootScope.tripIndividual.driverID }
		    					  }).success(function(data){
		    						  	  console.log(data);
		    						  if(data.status == 200 ){
		    							  alert('Review Submitted Successfully');
		    							 // $rootScope.tripIndividual.isRated = 1;
		    							  $scope.initialReview = false;
		    						  }else if(data.status == 401 ){
		    							  alert('Review couldnt be updated');
		    						  }
		    					  });
		    			    	  
		    			      }
		    			  }
		    	}}
		      
		    })


});

