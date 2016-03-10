//loading the 'login' angularJS module
var login = angular.module('login', []);
//defining the login controller
login.controller('login', function($http,$scope) {


	$scope.submit = function() {
		console.log($scope.username);
		var username = $scope.username;
		var password = $scope.password;
         
		 
        $http.post('/loginAdmin/'+username+'/'+password).
        then(function(response) {
        	      
        	    	  window.location.assign('/home');
               
            }, function(response) {
               alert("am here");
            });
		
		
	};
})
