var adminModule = angular.module("adminModule", ['ui.router','ngMap']);

adminModule.controller("adminController", function($http, $scope, $rootScope, $state){
	var $rootScope = [];
	
	$scope.logout=function(){
		console.log("am in logout");
		$http.get("/adminLogOut").
		  then(function(response) {
				  window.location.assign("/admin");
			  }, function(response) {
				  console.log(response);
			  });
		
		
	}
	$state.go('Search');
	
});

adminModule.config(function($stateProvider, $urlRouterProvider) {


	  $stateProvider
	    .state("Search", {
	    	views: {
	    		"adminSearch" : {
	    			  url         : "/Search",
	    			  templateUrl : "/search",
	    			  controller  : function($scope , $http, $state,$rootScope,NgMap ){
		    				  
		    				  
	    
	    $scope.search = function() {
	         
	    	var search=$("input[name=search]:checked").val();
	    	var type=$("input[name=type]:checked").val();
	    	var text = $scope.searchTerm;
	          console.log("searchTerm: " + text);
	            $http.post('/adminSearch/'+text+'/'+search+'/'+type).
	                 then(function(response){
	                       $scope.user = response.data.userProfile;
	                        $scope.driver = response.data.driverProfile;
	                        console.log($scope.user);
	             },function(error){
	                      alert(error);
	          });             
	        }
	    
	    
	    $scope.viewCusProfile = function(CustomerID) {
	          
	          console.log(CustomerID);
	            $http.post('/viewCusProfile/'+CustomerID)
	             .then(function(response){
	            	 console.log("in response");
	            	 $rootScope.userProfile = response.data.userProfile;
	            	 $state.go('cusProfileView');
	         //      window.location.assign("/profile");
	               
	             },function(error){
	                      alert(error);
	          });             
	        }
	    
	    $scope.viewDriProfile = function(DriverID) {
	           
            console.log(DriverID);
              $http.post('/viewDriProfile/'+DriverID)
                .then(function(response){
           	   console.log("in response");
           	 $rootScope.driverProfile = response.data.driProfile;
           	  $state.go('driProfileView');
        //       window.location.assign("/profile");
              
               },function(error){
                     alert(error);
           });             
        }  
	    
	    			  }
	    
	    	}}
	      
	    }).state("cusProfileView", {
	    	views: {
	    		"cusProfile" : {
	    			  url         : "/cusProfile",
	    			  templateUrl : "/cusProfile",
	    			  controller  : function($scope , $http, $state){
	    				 
	    				  
                         $scope.back=function(){
                        	 $state.go('Search');
                         }	    				  
	    				  
	    				  $scope.deleteCus=function(customerID){
	    				       console.log(customerID+"for deletion");
	    				       $http.post('/deleteCustomer/'+customerID)
	    				            .then(function(response) {
	    				               if(response.data.statusCode == 200){
	    				                  alert("Deleted customer Successfully");
	    				                  $state.go('Search');
	    				                  }
	    				               else 
	    				               alert(response.message);
	    				          
	    				               },function (error) {
	    				                    console.log(error);
	    				               });   
	    				   
	    				   }

	    				
	    		}
	    	}}
	      
	    }).state("listCus", {
	    	views: {
	    		"viewListCus" : {
	    			  url         : "/listAllCustomers",
	    			  templateUrl : "/listAllCustomers",
	    			  controller  : function($scope , $http, $state,$rootScope){
	    				 
	    				  $http.get("/getAllCustomers").
	    				  then(function(response) {
	    						  $scope.userList= response.data.userProfile;	
	    						  console.log($scope.userList);
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    				  
	    				  $scope.viewCusProfile = function(CustomerID) {
	    			          
	    			          console.log(CustomerID);
	    			            $http.post('/viewCusProfile/'+CustomerID)
	    			             .then(function(response){
	    			            	 console.log("in response");
	    			            	 $rootScope.userProfile = response.data.userProfile;
	    			            	 $state.go('cusProfileView');
	    			         //      window.location.assign("/profile");
	    			               
	    			             },function(error){
	    			                      alert(error);
	    			          });             
	    			        }
	    				  
	    				
	    		}
	    	}}

	    }).state("listDri", {
	    	views: {
	    		"viewListDri" : {
	    			  url         : "/listAllDrivers",
	    			  templateUrl : "/listAllDrivers",
	    			  controller  : function($scope , $http, $state,$rootScope){
	    				 
	    				  $http.get("/getAllDrivers").
	    				  then(function(response) {
	    						  $scope.driverList = response.data.driverProfile;	
	    						  console.log($scope.driverList);
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    				  
                       $scope.viewDriProfile = function(DriverID) {
	    			           
	    			             console.log(DriverID);
	    			               $http.post('/viewDriProfile/'+DriverID)
	    			                 .then(function(response){
	    			            	   console.log("in response");
	    			            	   $rootScope.driverProfile = response.data.driProfile;
	    			            	  $state.go('driProfileView');
	    			         //       window.location.assign("/profile");
	    			               
	    			                },function(error){
	    			                      alert(error);
	    			            });             
	    			         }  
	    				  
	    				  
	    				
	    		}
	    	}}

	    }).state("driProfileView", {
	    	views: {
	    		"driProfile" : {
	    			  url         : "/driProfile",
	    			  templateUrl : "/driProfile",
	    			  controller  : function($scope , $http, $state){
	    				  
	    				  console.log("hai darlings");
	    				  $scope.back=function(){
	                        	 $state.go('Search');
	                         }	    
	    				 
	    				  $scope.deleteDri=function(driverID){
	    				       console.log(driverID+"for deletion");
	    				       $http.post('/deleteDriver/'+driverID)
	    				            .then(function(response) {
	    				               if(response.data.statusCode == 200){
	    				                  alert("Deleted driver Successfully");
	    				                  $state.go('Search');
	    				                  }
	    				               else 
	    				               alert(response.message);
	    				          
	    				               },function (error) {
	    				                    console.log(error);
	    				               });   
	    				   
	    				   }

	    				
	    		}
	    	}}
	    }).state("bills", {
	    	views: {
	    		"billSearch" : {
	    			  url         : "/billSearch",
	    			  templateUrl : "/billSearch",
	    			  controller  : function($scope , $http, $state,$rootScope ){
	    				  
		    				 
		    			$scope.nameSearch=true;
		    			
		    			$scope.date = function(){
		    				$scope.nameSearch=false;
		    				$scope.dateSearch=true;
		    				
		    			}
		    			$scope.name = function(){
		    				$scope.nameSearch=true;
		    				$scope.dateSearch=false;
		    				
		    			}
		    			
		    			
		    				  
	    
	    $scope.search = function() {
	         
	    	
	    	var text = $scope.searchTerm;
	    	
	            $http.post('/billSearchResults/'+text).
	                 then(function(response){
	                      
	                        $scope.bills = response.data.billResults;
	                        console.log($scope.user);
	             },function(error){
	                      alert(error);
	          });             
	        }
	    
 $scope.search1 = function() {
	         
	    	
	    	var text = $scope.searchTerm1;
	    	
	            $http.post('/billSearchResults/'+text).
	                 then(function(response){
	                      
	                        $scope.bills = response.data.billResults;
	                        console.log($scope.user);
	             },function(error){
	                      alert(error);
	          });             
	        }
	    
	    
	    $scope.viewBill = function(BillingID) {
	          
	          console.log(BillingID);
	            $http.post('/viewBill/'+BillingID)
	             .then(function(response){
	            	 console.log("in response");
	            	 $rootScope.bill=response.data.bill ;
	            	 $state.go('billView',{ contactId: "test" });
	         //      window.location.assign("/profile");
	               
	             },function(error){
	                      alert(error);
	          });             
	        }
	    
	   
	    
	    			  }
	    
	    	}}
	      
	    }).state("billView", {
	    	views: {
	    		"billProfile" : {
	    			  url         : "/billDetail",
	    			  templateUrl : "/billDetail",
	    			  controller  : function($scope , $http, $state, $stateParams){
	    				  
	    				  
	    				  
	    				 
	    				  $scope.deleteBill=function(BillingID){
	    				       console.log(BillingID+"for deletion");
	    				       $http.post('/deleteBill/'+BillingID)
	    				            .then(function(response) {
	    				               if(response.data.statusCode == 200){
	    				                  alert("Deleted Bill Successfully");
	    				                  $state.go('bills');
	    				                  }
	    				               else 
	    				               alert(response.message);
	    				          
	    				               },function (error) {
	    				                    console.log(error);
	    				               });   
	    				   
	    				   }

	    				
	    		}
	    	}}
	    }).state("pendingRequests", {
	    	views: {
	    		"requests" : {
	    			  url         : "/pendingRequests",
	    			  templateUrl : "/pendingRequests",
	    			  controller  : function($scope , $http, $state,$rootScope){
	    				 
	    				 $scope.bTxt="Approve";
	    				  $http.get("/getRequests").
	    				  then(function(response) {
	    						  $scope.requestList = response.data.requestList;	
	    		
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    				  
                       $scope.approveRequest = function(DriverID,index) {
	    			           
	    			             console.log(DriverID);
	    			               $http.post('/approveRequest/'+DriverID)
	    			                 .then(function(response){
	    			            	   console.log("in response");
	    			            	  $scope.requestList[index].approve=true;
	    			            	  $scope.requestList[index].hideReject=true;
	    			            	  
	    			            	 
	    			         //       window.location.assign("/profile");
	    			               
	    			                },function(error){
	    			                      alert(error);
	    			            });             
	    			         }  
                       $scope.rejectRequest = function(DriverID,index) {
    			           
  			             console.log(DriverID);
  			               $http.post('/rejectRequest/'+DriverID)
  			                 .then(function(response){
  			            	   console.log("in response");
  			            	  $scope.requestList[index].reject=true;
  			            	$scope.requestList[index].hideApprove=true;
  			            	 
  			         //       window.location.assign("/profile");
  			               
  			                },function(error){
  			                      alert(error);
  			            });             
  			         }  
                       
                       
                       $scope.viewPendingProfile = function(DriverID) {
    			           
    			             console.log(DriverID);
    			               $http.post('/viewPendingProfile/'+DriverID)
    			                 .then(function(response){
    			            	   console.log("in response");
    			            	  $rootScope.pendingProfile=response.data.pendingProfile;
    			            	  $state.go("pendingProfile");
    			            	 
    			         //       window.location.assign("/profile");
    			               
    			                },function(error){
    			                      alert(error);
    			            });             
    			         }  
	    				  
	    				
	    		}
	    	}}

	    }).state("pendingProfile", {
	    	views: {
	    		"viewPendingProfile" : {
	    			  url         : "/pendingProfile",
	    			  templateUrl : "/pendingProfile",
	    			  controller  : function($scope , $http, $state,$rootScope){
	    				 
	    				 
	    				  $http.get("/pendingProfile").
	    				  then(function(response) {
	    						  	
	    		
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    				  
                       $scope.approveRequest = function(DriverID) {
	    			           
	    			             console.log(DriverID);
	    			               $http.post('/approveRequest/'+DriverID)
	    			                 .then(function(response){
	    			            	   console.log("in response");
	    			            	  alert("Driver is Approved");
	    			            	  $state.go("pendingRequests");
	    			            	  
	    			            	 
	    			         //       window.location.assign("/profile");
	    			               
	    			                },function(error){
	    			                      alert(error);
	    			            });             
	    			         }  
                       $scope.rejectRequest = function(DriverID) {
    			           
  			             console.log(DriverID);
  			               $http.post('/rejectRequest/'+DriverID)
  			                 .then(function(response){
  			            	   console.log("in response");
  			            	  alert("Driver is Rejected");
  			            	  $state.go("pendingRequests");
  			            	 
  			         //       window.location.assign("/profile");
  			               
  			                },function(error){
  			                      alert(error);
  			            });             
  			         }  
                       
                       
                       $scope.viewPendingProfile = function(DriverID) {
    			           
    			             console.log(DriverID);
    			               $http.post('/viewPendingProfile/'+DriverID)
    			                 .then(function(response){
    			            	   console.log("in response");
    			            	  $rootScope.pendingProfile=response.data.pendingProfile;
    			            	 
    			         //       window.location.assign("/profile");
    			               
    			                },function(error){
    			                      alert(error);
    			            });             
    			         }
                       
                       $scope.back = function(){
                    	   $state.go("pendingRequests");
                       }
	    				  
	    				
	    		}
	    	}}

	    }).state("Graph", {
	        views: {
	            "showGraph" : {
	             templateUrl : "/getGraph",
	             controller  : function($scope , $http, $state,$rootScope, NgMap ){
	            	 
	            	    var search=$("input[name=graphSearch]:checked").val();
		                var text = $scope.graphSearchText;
		                console.log("graphSearchText: " + text);
		                console.log("graphSearch: " + search);
		                $http.post('/showgraph/'+text+'/'+search).
		                       then(function(response) {
		             $scope.graphDetails = response.data;
		             console.log("printing grf.grf"+JSON.stringify($scope.graphDetails));
		             console.log("response.data: " , response);
		             console.log($scope.graphDetails);
		             $scope.paths=[];
		             var flightPlanCoordinates;
		             for (var i = 0; i < $scope.graphDetails.length; i++) {
		             var row = $scope.graphDetails[i];
		             flightPlanCoordinates = [{lat: row.srcLat, lng: row.srcLng} , {lat: row.destLat, lng: row.destLng}];
		             $scope.paths.push(flightPlanCoordinates);
		             }
		             }, function(response) {
		             console.log("printing response :"+response);});
	            	 
	            	 
	             
	             $scope.graphSearch = function() {            
	                var search=$("input[name=graphSearch]:checked").val();
	                var text = $scope.graphSearchText;
	                     console.log("graphSearchText: " + text);
	                       $http.post('/showgraph/'+text+'/'+search).
	                       then(function(response) {
	             $scope.graphDetails = response.data;
	             console.log("printing grf.grf"+JSON.stringify($scope.graphDetails));
	             console.log("response.data: " , response);
	             console.log($scope.graphDetails);
	             $scope.paths=[];
	             var flightPlanCoordinates;
	             for (var i = 0; i < $scope.graphDetails.length; i++) {
	             var row = $scope.graphDetails[i];
	             flightPlanCoordinates = [{lat: row.srcLat, lng: row.srcLng} , {lat: row.destLat, lng: row.destLng}];
	             $scope.paths.push(flightPlanCoordinates);
	             }
	             }, function(response) {
	             console.log("printing response :"+response);
	            });
	              }
	              
	              
	             }
	            }
	        }
	    }).state("Statistics", {
	        views: {
	            "viewStats" : {
	              url         : "/stats",
	              templateUrl : "/viewStatistics",
	              controller  : function($scope , $http){
	              $http.get("/getRevenuePerDay").
	              then(function(response) {
	              $scope.stats = response.data.stats;	
	              console.log($scope.stats);
	              }, function(response) {
	              console.log(response);
	              });
	              $scope.rideCount= 0;
	              $scope.statsshow = false;
	              $scope.getRidesPerArea = function(){	     
	            $http({
	            method : 'post',
	            url    : '/getRidesPerArea',
	            data   : { area   : $scope.txtsearch }
	            }).then(function(response) {    	
	              $scope.rideCount = response.data.count;
	              $scope.statsshow = true;
	              console.log($scope.response);   	 	   	 
	              }, function(response) {
	              console.log(response);
	              });
	            };
	            }
	            }}
	         });
	    
});




//Code goes here

var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination']);

function MyController($scope) {

  $scope.currentPage = 1;
  $scope.pageSize = 15;
 
 
  
  
}



myApp.controller('MyController', MyController);

var combineModule = angular.module('combineModule',["adminModule","myApp"]);







