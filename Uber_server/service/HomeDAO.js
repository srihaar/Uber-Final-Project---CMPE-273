var mysqlconn = require('../config/mysqlconn');



function loginAdmin(msg, callback){
	var username=msg.username;
	var password=msg.password;
	var res = {};
	console.log("in login admin");
	console.log(username);
	console.log(password);
	if(username==="admin@gmail.com" && password==="test"){
		res.code="200";
		res.value="Success Login"
		res.username="admin@gmail.com";
		
	}
	else{
		res.code="401";
		res.value="Incorrect credentials";
	}
	
	callback(null,res);
	
};

function searchAdmin(msg,callback){
	var searchTerm=msg.searchTerm;
	var search=msg.search;
	
	console.log(searchTerm);
	var array = searchTerm.split(" ");
	console.log(array);
	var type=msg.type;
	if(search==="customers"&&type==="name")
	{
	    if(array[1]==null){
		console.log(searchTerm);
	var res = {};
	var selectStatement = "select CustomerID,FirstName,LastName from Customer  where ( FirstName like ? or LastName like ? ) and isActive=?  " ;
	var param= [ "%" + searchTerm + "%", "%" + searchTerm + "%" ,1];
	console.log("Query is:"+selectStatement);
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.userProfile = rows;
		}
		
		callback(null, res);
		
	},selectStatement,param);
	
	    }
	    
	    else{
	    	
	    	
	    		
	    	var res = {};
	    	var selectStatement = "select CustomerID,FirstName,LastName from Customer  where ( FirstName like ? or LastName like ? ) and isActive=?  " ;
	    	var param= [ "%" + array[0] + "%", "%" + array[1] + "%" ,1];
	    	console.log("Query is:"+selectStatement);
	    	mysqlconn.fetchData(function(err,rows){
	    		if(err){
	    			res.code = "401";
	    			res.value = "Error in retriveing results,please try again";
	    		}else{
	    			res.code = "200";
	    			res.value = "Success";
	    			console.log(rows);
	    			res.userProfile = rows;
	    		}
	    		
	    		callback(null, res);
	    		
	    	},selectStatement,param);
	    	
	    	    }
	    	
	    	
	    
	}
	
	else if(search==="customers"&&type==="city")
	{
	console.log(searchTerm);
	var res = {};
	var selectStatement = "select CustomerID,FirstName,LastName from Customer  where City =? and isActive=?  " ;
	var param= [ searchTerm,1];
	console.log("Query is:"+selectStatement);
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.userProfile = rows;
		}
		
		callback(null, res);
		
	},selectStatement,param);
	}
	
	else if(search==="drivers"&&type==="name")
	{
	   if(array[1]==null){
		console.log(searchTerm);
	var res = {};
	var selectStatement = "select DriverID,FirstName,LastName from Driver  where ( FirstName like ? or LastName like ? ) and isActive=?  " ;
	var param= [ "%" + searchTerm + "%", "%" + searchTerm + "%" ,1];
	console.log("Query is:"+selectStatement);
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.driProfile = rows;
		}
		
		callback(null, res);
		
	},selectStatement,param);
	   }
	   
	   else{
			console.log(searchTerm);
			var res = {};
			var selectStatement = "select DriverID,FirstName,LastName from Driver  where ( FirstName like ? or LastName like ? ) and isActive=?  " ;
			var param= [ "%" + array[0] + "%", "%" + array[1] + "%" ,1];
			console.log("Query is:"+selectStatement);
			mysqlconn.fetchData(function(err,rows){
				if(err){
					res.code = "401";
					res.value = "Error in retriveing results,please try again";
				}else{
					res.code = "200";
					res.value = "Success";
					console.log(rows);
					res.driProfile = rows;
				}
				
				callback(null, res);
				
			},selectStatement,param);
		   
	   }
	   
	}
	
	else if(search==="drivers"&&type==="city")
	{
	console.log(searchTerm);
	var res = {};
	var selectStatement = "select DriverID,FirstName,LastName from Driver  where City =? and isActive=?  " ;
	var param= [ searchTerm,1];
	console.log("Query is:"+selectStatement);
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.driProfile = rows;
		}
		
		callback(null, res);
		
	},selectStatement,param);
	}

	
	
}

function viewCusProfile(msg,callback){
	var customerID=msg.customerID;
	console.log(customerID);
	var res = {};
	var selectStatement = "select * from Customer where CustomerID = ?" ;
	var param= [ customerID];
	
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.userProfile = rows;
		}
		console.log("hai all");
		callback(null, res);
	},selectStatement,param);
}

function viewDriProfile(msg,callback){
	var driverID=msg.driverID;
	console.log(driverID);
	var res = {};
	var selectStatement = "select d.*, avg(r.Rating) as rating from Driver d left outer join DriverReviews r on d.DriverID=r.DriverID where d.DriverID = ? group by DriverID";

	var param= [ driverID];
	
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.driProfile = rows;
		}
		console.log("hai all");
		callback(null, res);
	},selectStatement,param);
}


function deleteCustomer(msg,callback){
	var customerID=msg.customerID;
	console.log(customerID);
	var res = {};
	var deleteStatement = "update Customer set isActive=?  where CustomerID = ?  " ;
	var param= [ 0,customerID];
	
	console.log("Query is:"+deleteStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in deleting customer,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			
		}
		callback(null, res);
	},deleteStatement,param);
}


function deleteDriver(msg,callback){
	var driverID=msg.driverID;
	console.log(driverID);
	var res = {};
	var deleteStatement = "update Driver set isActive=?  where DriverID = ?  " ;
	var param= [ 0,driverID];
	
	console.log("Query is:"+deleteStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in deleting driver,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			
		}
		callback(null, res);
	},deleteStatement,param);
}

function getAllCustomers(msg,callback){
	
	var res = {};
	var selectStatement = "select CustomerID,FirstName,LastName from Customer where isActive=?  " ;
	var param= [1];
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in deleting customer,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.userProfile = rows;
			
		}
		callback(null, res);
	},selectStatement,param);
}


function getAllDrivers(msg,callback){
	
	var res = {};
	var selectStatement = "select DriverID,FirstName,LastName from Driver where isActive=?  " ;
	var param= [1];
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in retreving drivers.Please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.driverProfile = rows;
			
		}
		callback(null, res);
	},selectStatement,param);
}

function billSearch(msg,callback){
	
	
	var searchTerm=msg.searchTerm;
	console.log(searchTerm.search("-"));
	var array = searchTerm.split(" ");

     if(searchTerm.search("-")==2){
    	 console.log(searchTerm);
    	 searchTerm  = searchTerm.replace(/-/g, "/")
    	 console.log('searchTerm: '+searchTerm);
    		var res = {};
    		var selectStatement = "select c.FirstName,c.LastName,b.SrcLocation,b.DestLocation,b.BillingID from Bills b JOIN Customer c ON b.CustomerID=c.CustomerID where Date like ? and c.isActive=?  " ;
    		var param= [searchTerm+"%" ,1];
    		console.log("Query is:"+selectStatement);
    		mysqlconn.fetchData(function(err,rows){
    			if(err){
    				res.code = "401";
    				res.value = "Error in retriveing results,please try again";
    			}else{
    				res.code = "200";
    				res.value = "Success";
    				console.log(rows);
    				res.billResults = rows;
    			}
    			
    			callback(null, res);
    			
    		},selectStatement,param);
     }
     else{
    	 console.log(searchTerm);
     if(array[1]==null){
	var res = {};
	var selectStatement = "select c.FirstName,c.LastName,b.SrcLocation,b.DestLocation,b.BillingID from Bills b JOIN Customer c ON b.CustomerID=c.CustomerID where (c.FirstName like ? or c.LastName like ?) and c.isActive=?  " ;
	var param= ["%" + searchTerm + "%", "%" + searchTerm + "%" ,1];
	console.log("Query is:"+selectStatement);
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.billResults = rows;
		}
		
		callback(null, res);
		
	},selectStatement,param);
     }
     
     else{
    	 var res = {};
    		var selectStatement = "select c.FirstName,c.LastName,b.SrcLocation,b.DestLocation,b.BillingID from Bills b JOIN Customer c ON b.CustomerID=c.CustomerID where (c.FirstName like ? or c.LastName like ?) and c.isActive=?  " ;
    		var param= ["%" + array[0] + "%", "%" + array[1] + "%" ,1];
    		console.log("Query is:"+selectStatement);
    		mysqlconn.fetchData(function(err,rows){
    			if(err){
    				res.code = "401";
    				res.value = "Error in retriveing results,please try again";
    			}else{
    				res.code = "200";
    				res.value = "Success";
    				console.log(rows);
    				res.billResults = rows;
    			}
    			
    			callback(null, res);
    			
    		},selectStatement,param);
     }
     
     
   }
	}

function viewBill(msg,callback){
	var BillingID=msg.BillingID;
	console.log(BillingID);
	var res = {};
	var selectStatement = "SELECT Date, PickupTime," +
			"DropoffTime,b.Distance,b.Amount,b.SrcLocation,b.DestLocation,c.FirstName,c.LastName,c.PhoneNumber,c.Email,d.FirstName as dFirstName,d.LastName as dLastName,d.PhoneNumber as dPhoneNumber,d.Email as dEmail" +
			"               FROM  Bills b JOIN Customer c " +
			"              ON b.CustomerID=c.CustomerID JOIN Driver d ON b.DriverID=d.DriverID where b.BillingID=?;" ;
	var param= [ BillingID];
	
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			res.code = "401";
			res.value = "Error in retriveing results,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.billDetail = rows;
		}
		console.log("hai all");
		callback(null, res);
	},selectStatement,param);
}


function deleteBill(msg,callback){
	var billID=msg.billID;
	console.log(billID);
	var res = {};
	var deleteStatement = "update Bills set isActive=?  where BillingID = ?  " ;
	var param= [ 0,billID];
	
	console.log("Query is:"+deleteStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in deleting driver,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			
		}
		callback(null, res);
	},deleteStatement,param);
}

function getRequests(msg,callback){
	
	var res = {};
	var selectStatement = "select DriverID,FirstName,LastName from Driver where isActive=?  " ;
	var param= [2];
	
	console.log("Query is:"+selectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in deleting customer,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			res.requestList = rows;
			
		}
		callback(null, res);
	},selectStatement,param);
}


function approveRequest(msg,callback){
	var driverID=msg.driverID;
	console.log(driverID);
	var res = {};
	var approveStatement = "update Driver set isActive=?  where DriverID = ?  " ;
	var param= [ 1,driverID];
	
	console.log("Query is:"+approveStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in approving driver,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			
		}
		callback(null, res);
	},approveStatement,param);
}


function rejectRequest(msg,callback){
	var driverID=msg.driverID;
	console.log(driverID);
	var res = {};
	var rejectStatement = "update Driver set isActive=?  where DriverID = ?  " ;
	var param= [ 0,driverID];
	console.log("am in reject");
	console.log("Query is:"+rejectStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in rejecting driver,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			console.log(rows);
			
		}
		callback(null, res);
	},rejectStatement,param);
}



function viewPendingProfile(msg,callback){
	var driverID=msg.driverID;
	console.log(driverID);
	var res = {};
	var profileStatement = "select * from Driver where DriverID = ?  " ;
	var param= [driverID];
	console.log("am in pending");
	console.log("Query is:"+profileStatement);
	
	mysqlconn.fetchData(function(err,rows){
		if(err){
			console.log("error in db connection");
			res.code = "401";
			res.value = "Error in retreiving driver,please try again";
		}else{
			res.code = "200";
			res.value = "Success";
			res.pendingProfile = rows;
			console.log(rows);
			
		}
		callback(null, res);
	},profileStatement,param);
}



exports.showgraph = function(msg,callback){
	var graphSearchText=msg.graphSearchText;
	var graphSearch=msg.graphSearch;
	
	if(graphSearch==="allrides")
	{
		//console.log(graphSearchText);
		var res = {};
		var selectStatement = "select  srcLat, srcLng, destLat, destLng from rides  where status=? " ;
		var param= [2];
		console.log("Query is:"+selectStatement);
		mysqlconn.fetchData(function(err,rows){
			if(err){
				res.code = "401";
				res.value = "Error in retriveing results,please try again";
			}else{
				res.code = "200";
				res.value = "Success";
		//		console.log(rows);
				res.graphDetails = rows;
			}
			
			callback(null, res);
		
		},selectStatement,param);
	}
	
	else if(graphSearch==="customers")
	{
		console.log(graphSearchText);
		var res = {};
		var selectStatement = "select  srcLat, srcLng, destLat, destLng from rides  where ( RiderName like ? and status=? ) " ;
		var param= [ "%" + graphSearchText + "%", 2];
		console.log("Query is:"+selectStatement);
		mysqlconn.fetchData(function(err,rows){
			if(err){
				res.code = "401";
				res.value = "Error in retriveing results,please try again";
			}else{
				res.code = "200";
				res.value = "Success";
			//	console.log(rows);
				res.graphDetails = rows;
			}
			
			callback(null, res);
		
		},selectStatement,param);
	}
	
	else if(graphSearch==="drivers")
	{
		console.log(graphSearchText);
		var res = {};
		var selectStatement = "select  srcLat, srcLng, destLat, destLng from rides  where ( DriverName like ? and status=? ) " ;
		var param= [ "%" + graphSearchText + "%", 2];
		console.log("Query is:"+selectStatement);
		mysqlconn.fetchData(function(err,rows){
			if(err){
				res.code = "401";
				res.value = "Error in retriveing results,please try again";
			}else{
				res.code = "200";
				res.value = "Success";
			//	console.log(rows);
				res.graphDetails = rows;
			}
			
			callback(null, res);
		
		},selectStatement,param);
	}
	
	else if(graphSearch==="location")
	{
		console.log(graphSearchText);
		var res = {};
		var selectStatement = "select  srcLat, srcLng, destLat, destLng from rides  where ( PickupLocation like ? or DropoffLocation like ? ) and status=? " ;
		var param= [ "%" + graphSearchText + "%","%" + graphSearchText + "%", 2];
		console.log("Query is:"+selectStatement);
		mysqlconn.fetchData(function(err,rows){
			if(err){
				res.code = "401";
				res.value = "Error in retriveing results,please try again";
			}else{
				res.code = "200";
				res.value = "Success";
		//		console.log(rows);
				res.graphDetails = rows;
			}
			
			callback(null, res);
		
		},selectStatement,param);
	}
	
	else if(graphSearch==="cancelled")
	{
		console.log(graphSearchText);
		var res = {};
		var selectStatement = "select  srcLat, srcLng, destLat, destLng from rides  where status=? " ;
		var param= [3];
		console.log("Query is:"+selectStatement);
		mysqlconn.fetchData(function(err,rows){
			if(err){
				res.code = "401";
				res.value = "Error in retriveing results,please try again";
			}else{
				res.code = "200";
				res.value = "Success";
		//		console.log(rows);
				res.graphDetails = rows;
			}
			
			callback(null, res);
		
		},selectStatement,param);
	}
}
	








exports.getRequests=getRequests;
exports.getAllDrivers = getAllDrivers;
exports.getAllCustomers = getAllCustomers;
exports.deleteCustomer=deleteCustomer;
exports.deleteDriver=deleteDriver;
exports.searchAdmin=searchAdmin;
exports.loginAdmin = loginAdmin;
exports.viewCusProfile = viewCusProfile;
exports.viewDriProfile = viewDriProfile;
exports.billSearch=billSearch;
exports.viewBill=viewBill;
exports.deleteBill=deleteBill;
exports.approveRequest=approveRequest;
exports.rejectRequest=rejectRequest;
exports.viewPendingProfile = viewPendingProfile;


