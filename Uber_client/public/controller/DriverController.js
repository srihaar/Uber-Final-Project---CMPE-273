var driverModule = angular.module("uberModule", ['ui.router']);
var userProfile;

driverModule.controller("DriverController", function($http, $scope, $rootScope, $state){
	var $rootScope = [];
	$state.go('Requests');
	var refresh = function () {
		$http.get('/getUserDetails').success (function(response) {
		$scope.user = response;
		userProfile = response;
		console.log("onLoad, getUserDetails", response);
		$scope.picUrl = '/images/profile.jpeg';
		if ( $scope.user.picFiletype != undefined &&  !($scope.user.picFiletype.length == 0))
		$scope.picUrl = '/images/' + $scope.user.DriverID + 'Pic.' + $scope.user.picFiletype;
		}).error(function (err) {
		alert(err);
		});
		}
		refresh();
		});

driverModule.config(function($stateProvider, $urlRouterProvider) {


	  $stateProvider
	  .state("Requests", {
	    	views: {
	    		"rideRequests" : {
	    			  url         : "/riderequests",
	    			  templateUrl : "/viewRidesRequests",
	    			  controller  : function($scope , $http){
	    				  $http.get("/getRidesRequests").
	    				  then(function(response) {
	    					 if(response.data.success)
	    						 {
	    						  $scope.requests = response.data.rideDetails;
	    						  console.log($scope.requests);
	    						  $scope.isrequest =true;
	    						 }
	    					 else
	    						 {
	    						 $scope.requests={};
	    						 $scope.isrequest = false;
	    						 }
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
  					    $scope.isStart = true;
	    					$scope.startride = function(rideid){	    							
	    						$http({
	    							method : 'post',
	    							url    : '/startRide',
	    							data   : { rideid   : rideid }
	    						}).then(function(response) {
	    							
	    							  $scope.isStart = false;
		    						  console.log($scope.response);
		    					  }, function(response) {
		    						  console.log(response);
		    					  });
	    					};
	    				
	    					$scope.stopride = function(rideid){
	    						$http({
	    							method : 'post',
	    							url    : '/stopRide',
	    							data   : { rideid   : rideid }
	    						}).then(function(response) {
		    						  console.log($scope.response);
		    						  alert("Your Ride has ended");
		    						  
		    					  }, function(response) {
		    						  console.log(response);
		    					  });
	    					};
	    		}
	    	}}
	      
	    }).state("Rides", {
	    	views: {
	    		"viewRides" : {
	    			  url         : "/rides",
	    			  templateUrl : "/viewDriverRides",
	    			  controller  : function($scope , $http){
	    				  $scope.isdriverride = false;
	    				  $http.get("/getDriverRides").
	    				  then(function(response) {
	    						  
	    						  
	    						  if(response.data.success)
		    						 {
		    						  $scope.driverrides = response.data.rideDetails;
		    						  $scope.isdriverride = true;
		    						 }
		    					 else
		    						 {
		    						 $scope.driverrides={};
		    						 $scope.isdriverride = false;
		    						 }
	    						  
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    			}
	    	}}
	 
	      
	    }).state("Payment", {
	    	views: {
	    		"viewPayment" : {
	    			  url         : "/payment",
	    			  templateUrl : "/viewPayment",
	    			  controller  : function($scope , $http){
	    				 $scope.test = "welcome";
	    				  
	    				
	    		}
	    	}}
	      
	    }).state("Profile", {
	    	views: {
	    		"viewProfile" : {
	    		 url         : "/driverProfile",
	    		 templateUrl : "/viewDriverProfile",
	    		 controller  : function($scope , $http){
	    		console.log("driver profile");
	    		$scope.user = userProfile;
	    		var refresh = function () {	
	    		if ($scope.user.videoFiletype != undefined && !($scope.user.videoFiletype.length == 0)) {
	    		var video = document.getElementById('driverVideo');
	    		var v = document.getElementById('videoSrc');
	    		v.src = '/images/' + $scope.user.DriverID + 'Video.' + $scope.user.videoFiletype;
	    		video.load();
//	    			video.play();
	    		}	
	    		}
	    		refresh();
	    		 	}
	    		}
	    		}
	    		 
	    		});

});

