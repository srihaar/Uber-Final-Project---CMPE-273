var bcrypt   = require('bcryptjs');
var dbUtil = require('./dbUtil');
var async = require('async');
var response = {};



function getdate()
{
var t = new Date();
var YYYY = t.getFullYear();
var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
var dateformat = YYYY+'-'+MM+'-'+DD;	
return dateformat;
}

function datenow(date)
{
var t = date;
var YYYY = t.getFullYear();
var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
var HH = ((t.getHours() < 10) ? '0' : '') + t.getHours();
var mm = ((t.getMinutes() < 10) ? '0' : '') + t.getMinutes();
var ss = ((t.getSeconds() < 10) ? '0' : '') + t.getSeconds();


var time_of_call = YYYY+'-'+MM+'-'+DD+' '+HH+':'+mm+':'+ss;	
    return time_of_call;
}

exports.riderLogin = function(msg, callback){
  var query="select CustomerID,FirstName,LastName,Address,City,State,ZipCode,PhoneNumber,Email,password,CreditCard,isActive,latitude,longitude from customer where email ='"+ msg.username+"'";
  console.log("Query is:"+query);
  var dbConn = dbUtil.getSqlConn();
  dbConn.query(query, function(err, rows) {
  if (err) {
       console.log(err);
       response.code = "401";
       response.value = "Failed Login";
       response.result = null
       callback(null, response);
   }
   else if (rows.length) {
       console.log('ROWS:'+rows);
       bcrypt.compare(msg.password, rows[0].password, function(err, matches) {
   	   if(matches) {
         console.log("pwd macthes");
   	     response.code = "200";
         response.value = "Succes Login";
         response.result = rows;
         callback(null, response);
       }
       else {
        console.log("pwd does not macth", err);
        response.code = "401";
        response.value = "Failed Login";
        response.result = null;
        callback(null, response);
       }
   });
 }
  else {
       console.log('No document(s) found with defined "find" criteria!');
       response.code = "401";
       response.value = "Failed Login";
       response.result = null;
	   callback(null, response);
  }
  });
}


exports.driverLogin = function(msg, callback){    
	var query="select * from driver where email ='" + msg.username+"'";
	console.log("Query is:"+query);
	var dbConn = dbUtil.getSqlConn();
	dbConn.query(query, function(err, rows) {
	if (err) {
	       console.log(err);
	       response.code = "401";
	       response.value = "Failed Login";
	       response.result = null
	       callback(null, response);
	}
	else if (rows.length) {
	       console.log('ROWS:'+rows);
	       bcrypt.compare(msg.password, rows[0].Password, function(err, matches) {
	       if(matches) {
	          console.log("pwd macthes");
	          response.code = "200";
	          response.value = "Succes Login";
	          response.result = rows;
	          callback(null, response);
	       }
	       else {
	          console.log("pwd does not macth", err);
	          response.code = "401";
	          response.value = "Failed Login";
	          response.result = null;
	          callback(null, response);
	          }
	      });
	}
	else {
	    console.log('No document(s) found with defined "find" criteria!');
	    response.code = "401";
	    response.value = "Failed Login";
	    response.result = null;
	    callback(null, response);
	}
	});
}

exports.adminLogin = function(msg, callback){    
	var query="select * from admin where email ='"+ msg.username+"'";
	console.log("Query is:"+query);
	var dbConn = dbUtil.getSqlConn();
	dbConn.query(query, function(err, rows) {
	if (err) {
	       console.log(err);
	       response.code = "401";
	       response.value = "Failed Login";
	       response.result = null
	       callback(null, response);
	}
	else if (rows.length) {
	       console.log('ROWS:'+rows);
	       bcrypt.compare(msg.password, rows[0].Password, function(err, matches) {
	       if(matches) {
	          console.log("pwd macthes");
	          response.code = "200";
	          response.value = "Succes Login";
	          response.result = rows;
	          callback(null, response);
	       }
	       else {
	          console.log("pwd does not macth", err);
	          response.code = "401";
	          response.value = "Failed Login";
	          response.result = null;
	          callback(null, response);
	          }
	      });
	}
	else {
	    console.log('No document(s) found with defined "find" criteria!');
	    response.code = "401";
	    response.value = "Failed Login";
	    response.result = null;
	    callback(null, response);
	}
	});
}

exports.riderSignup = function(msg, callback) {
	var dbConn = dbUtil.getSqlConn();
	bcrypt.genSalt(1, function(err, salt) {	
	bcrypt.hash(msg.password, salt, function(err, hash) {
	   	console.log("inside hash, encrypting pwd", msg.password);
	   	var query = "insert into customer (firstname , lastname, address, city, state, zipcode, phonenumber, email, password,creditcard) values " +"('"+ 
	   	msg.firstname +"','"+ msg.lastname + "','"+msg.address + "','"+ msg.city +"','"+ msg.state +
	   	"','"+ msg.zipCode +"','"+ msg.mobileNumber +"','"+ msg.email  +"','"+ hash+"','"+ msg.creditcardNumber+"');";
	   	console.log("Query is:" + query);
	dbConn.query(query, function(err, rows) {
	if(err){
	response.code = "401";
	response.value = "Failed Signup";
	}else{
	response.code = "200";
	response.value = "Succes Signup";
	response.CustomerID = rows.insertId;
	}
	callback(null, response);
	});
	   });
	});
	}


exports.driverSignup = function(msg, callback){
	var dbConn = dbUtil.getSqlConn();
	bcrypt.genSalt(1, function(err, salt) {
	   bcrypt.hash(msg.password, salt, function(err, hash) {
	    console.log("inside hash, encrypting pwd", msg.password);
	    var query = "insert into driver (firstname , lastname, address, city, state, zipcode, phonenumber, email, password,cartype) values  " +"('"+
	    msg.firstname +"','"+ msg.lastname + "','"+msg.address + "','"+ msg.city +"','"
	    + msg.state +"','"+ msg.zipCode +"','"+ msg.mobileNumber +"','"+ msg.email +"','"+ hash +"','"+ msg.carType+"');";
	    console.log("Query is:" + query);
	dbConn.query(query, function(err, rows) {
	if(err){
	response.code = "401";
	response.value = "Failed Signup";
	}else{
	response.code = "200";
	response.value = "Succes Signup";
	response.DriverID = rows.insertId;
	}
	callback(null, response);
	});
	   });
	});

}



exports.adminSignup = function(msg, callback){
	var dbConn = dbUtil.getSqlConn();
	bcrypt.genSalt(2, function(err, salt) {	
	   bcrypt.hash(msg.password, salt, function(err, hash) {
	   	console.log("inside hash, encrypting pwd", msg.password);
	   	var query = "insert into admin (firstname , lastname, address, city, state, zipcode, phonenumber, email, password) values  " +"('"+
		  msg.firstname +"','"+ msg.lastname + "','"+msg.address + "','"+ msg.city +"','"
		+ msg.state +"','"+ msg.zipCode +"','"+ msg.mobileNumber +"','"+ msg.email +"','"+ hash +"');";
	   	console.log("Query is:" + query);
	dbConn.query(query, function(err, rows) {
	if(err){
	response.code = "401";
	response.value = "Failed Signup";
	}else{
	response.code = "200";
	response.value = "Succes Signup";
	response.AdminID = rows.insertId;
	}
	console.log("calling back");
	callback(null, response);
	});
	   });
	});
};



exports.getRides = function(msg, callback){
    var query="select rideid,pickuplocation,dropofflocation,DATE(ridedate) as ridedate,drivername from rides where customerid ='"+ msg.CustomerID+"' and isrideractive = 1 and Status=2 order by ridedate desc";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
    response.code = "200";
    response.value = "Succes Login";
    response.rideDetails = rows;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
callback(null, response);
});
};


exports.getDriverRides = function(msg, callback){
    var query="select rideid,pickuplocation,dropofflocation,DATE(ridedate) as ridedate,ridername from rides where driverid ='"+ msg.DriverID+"' and isdriveractive = 1 and Status=2 order by ridedate desc";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
    response.code = "200";
    response.value = "Succes Login";
    response.rideDetails = rows;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
callback(null, response);
});
};


exports.getRidesRequests = function(msg, callback){
	
    var query="select rideid,pickuplocation,dropofflocation,DATE(ridedate) as ridedate,ridername from rides where driverid ='"+ msg.DriverID+"' and isdriveractive = 1 and isrideractive=1 and Status=0 order by ridedate desc";
    console.log("Query is:"+query);
    var dbConn = dbUtil.getSqlConn();
    dbConn.query(query, function(err, rows) {
    if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
    response.code = "200";
    response.value = "Succes Login";
    response.rideDetails = rows;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
    callback(null, response);
    });
};


exports.startRide = function(msg, callback){

var query="update rides set Status=1 where rideid='"+msg.rideId+"'";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else {
   	response.code = "200";
   	response.value = "Succes Login";
    // response.rideDetails = rows;
     
    var selectquery = "select * from rides where rideid = '"+msg.rideId+"'";
    dbConn.query(selectquery,function(err, result) {
 	if (err) {
 	console.log(err);
 	}
 	else if(result.length)
 	{
      console.log("select query"+selectquery+"result"+result[0]);
      var d = new Date();
      var ridetime = d;
      console.log("ridetime"+ridetime);
      var ridedate = result[0].RideDate;
      console.log("result value"+ result[0].RideDate+"~"+result[0].PickupLocation);
      var billsinsert = "insert into bills(Date,PickupTime,DropoffTime,Distance,Amount,SrcLocation,DestLocation,DriverID,CustomerID,isActive,DriverName,RiderName,RideId,carType) values('"+ridedate+"','"+ridetime+"',null,'"+result[0].totalDistance+"','"+result[0].totalPrice+"','"+result[0].PickupLocation+"','"+result[0].DropoffLocation+"','"+result[0].DriverID+"','"+result[0].CustomerID+"',0,'"+result[0].DriverName+"','"+result[0].RiderName+"','"+msg.rideId+"','"+result[0].carType+"')";
      dbConn.query(billsinsert);
 	}
      callback(null, response);	 
    });
 	}
 	
});
}



exports.stopRide = function(msg, callback){
var query="update rides set Status=2 where rideid='"+msg.rideId+"'";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";     
        response.value = "Failed Login";
      } else{
   	response.code = "200";
   	response.value = "Succes Login";
    // response.rideDetails = rows;
   	var d = new Date();
   	var droptime = d;
   	var updatequery = "update bills set DropoffTime='"+droptime+"',isActive=1 where rideId = '"+msg.rideId+"'";
dbConn.query(updatequery); 
      } 
callback(null, response);
});
}

exports.cancelRide = function(msg, callback){
    var query="update rides set Status=3 where rideid='"+msg.rideId+"'";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else {
   	response.code = "200";
   	response.value = "Succes Login";
    // response.rideDetails = rows;
      }
callback(null, response);
});
}



exports.getRidesPerArea = function(msg, callback){
var text = '%'+msg.area+'%';
var query = "select count(RideID) as count from rides where Status=2 and PickupLocation like '"+text+"' or DropoffLocation like '"+text+"'";
    console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
   	response.code = "200";
   	response.value = "Succes Login";
   	response.ridecount = rows[0].count;
   	console.log("count of rides"+rows[0].count);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
callback(null, response);
});
}




exports.getRevenuePerDay = function(msg, callback){
    var query="select Date,sum(Amount) as amount from bills group by Date";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
   	response.code = "200";
   	response.value = "Succes Login";
   	response.statistics = rows;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
callback(null, response);
});
}



exports.getBookedRide = function(msg, callback){
    var query="select rideid,pickuplocation,dropofflocation,DATE(ridedate) as ridedate,drivername from rides where customerid ='"+ msg.CustomerID+"' and Status=0 order by ridedate desc";
console.log("Query is:"+query);
var dbConn = dbUtil.getSqlConn();
dbConn.query(query, function(err, rows) {
if (err) {
        console.log(err);
        response.code = "401";
        response.value = "Failed Login";
      } else if (rows.length) {
   	response.code = "200";
   	response.value = "Succes Login";
   	response.rideDetails = rows;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        response.code = "401";
        response.value = "Failed Login";
      }
callback(null, response);
});
}

/*Method to list nearby drivers in 10mile radius*/
exports.listNearByDrivers = function(msgPayload, callback) {
	var userLat = msgPayload.userLat;
	var userLng = msgPayload.userLng;
	var dbConn = dbUtil.getSqlConn();
	var radius = 16093.4; // 10 miles in meters
	//point1: (lat1, lng1): lat1 = radius * sin(135 deg); lng1 = radius * cos(135 deg)
	var lat1 = (userLat + 0.1 + ((radius * Math.sin(2.35619))/ 110540)).toFixed(2);
	var lng1 = (userLng - 0.1 + ((radius * Math.cos(2.35619))/111320 * Math.cos(userLat))).toFixed(2);
	//point2: (lat2, lng2): lat2 = radius * sin(315 deg); lng2 = radius * cos(315 deg)
	console.log("(lat1, lng1) = (" + lat1 + "," + lng1 + ")");
	var lat2 =  (userLat - 0.1 + ((radius * Math.sin(5.49779))/ 110540)).toFixed(2);
	var lng2 = (userLng + 0.1 + ((radius * Math.cos(5.49779))/111320 * Math.cos(userLat))).toFixed(2);
		
	console.log("(lat2, lng2) = (" + lat2 + "," + lng2 + ")");
	var query = "select driverId, firstName, lastName, phoneNumber, carType, latitude, longitude, " +	
			"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
            "* cos( radians( driver.latitude ) ) " + 
            "* cos( radians( driver.longitude ) - radians(" + userLng + ") ) " + 
            "+ sin( radians(" + userLat + ") ) * sin( radians( driver.latitude ) ) ) ) AS distance " +  
            " from driver where isActive = 1 and driver.latitude between " + lat2 + " and " + lat1 + 
            " and driver.longitude between " + lng1 + " and " + lng2 +
            " having distance < 100 ORDER BY distance;"
            
    console.log("query: " + query);
	dbConn.query(query, function(err, rows) {		
		if (err) {
			console.log(err);
			response.errorOccured = true;
			response.status = err;
			callback(null, response);				
		} 
		else {					
			console.log("Server: " + msgPayload.reqType +" successful");
			console.log(rows);
			response.errorOccured = false;
			response.driverList = rows;
			callback(null, response);
		}
	});
}

/*Method to book a ride.Sends a notification to driver regarding the ride*/
	exports.bookARide = function(msgPayload, callback) {
	var dbConn = dbUtil.getSqlConn();
	//console.log(dbConn);
	console.log("book a ride", msgPayload);
	var date = getdate();
	console.log("date", date);
	var data = {
	driverId: msgPayload.driverId,
	customerId: msgPayload.customerId,
	riderName: msgPayload.riderName,
	driverName: msgPayload.driverName,
	status: 0,
	riderPhone: msgPayload.riderPhone,
	rideDate: date,
	dropOffLocation: msgPayload.dropOffLocation,
	pickUpLocation: msgPayload.pickUpLocation,
	srcLat: msgPayload.srcLat,
	srcLng: msgPayload.srcLng,
	destLat: msgPayload.destLat,
	destLng: msgPayload.destLng,
	totalPrice: msgPayload.totalPrice,
    totalDistance: msgPayload.totalDistance,
    carType : msgPayload.carType
	};
	console.log("before query"+data + " " + JSON.stringify(data));
	var query = "insert into rides set ? ";
	console.log(query);
	dbConn.query(query, data, function(err, rows) {
	console.log("bookride query response", rows);
	if(err) {
	console.log(err);
	response.errorOccured = true;
	response.status = err;
	callback(null, response);
	}
	else {
	console.log("Server: " + msgPayload.reqType +" successful");
	response.errorOccured = false;
	callback(null, response);
	}
	});
	}
	
	exports.submitCustomerReview = function(msgPayload , callback){
		var dbConn = dbUtil.getSqlConn();
		var query = "INSERT INTO  `driverReviews`" +
		"(`DriverID`," +
		"		`ReviewerID`," +
		"		`Rating`," +
		"		`Review`)" +
		"		VALUES" +
		"		( " + dbConn.escape(msgPayload.driverId) +"," +
		dbConn.escape(msgPayload.customerId)    +"," +
		dbConn.escape(msgPayload.rating)     +"," +
		dbConn.escape(msgPayload.review)    +")";
		var updateQuery = " UPDATE `bills` SET `isRated`='1' " +
				"WHERE `CustomerID`= "+ dbConn.escape(msgPayload.customerId) +
				" AND `DriverID` = " + dbConn.escape(msgPayload.driverId) + "";
			
			
		console.log(query);
		dbConn.query(query, function(err, rows){
			if(err){
				console.log(err + " error while submitting customer Review");
				response.status = 401 ;
				response.errorOccured = true;
				callback(null, response);
			}else if(rows){
				console.log( rows + " response while inserting the review");
				response.status = 200 ;
				response.errorOccured = false;
				console.log(updateQuery);
				dbConn.query(updateQuery, function(err, rows){
					if(err){
						console.log(err + " error while updating isRated value in bills ");
						response.status = 401 ;
						response.errorOccured = true;
					}else if(rows){
						console.log( rows + " response while updating the isRated value in bills");
						response.status = 200 ;
						response.errorOccured = false;
						
					}
					callback(null, response);
				})
				
				
				
			}
			
		});
	}
	
	exports.getRideEstimate = function(msgPayload , callback){
		var dbConn = dbUtil.getSqlConn();
		console.log("inside getRideEstimate"+ msgPayload.toString());
		var response = {};
		var timeFactor = 1 ;
    	var surgeFactor = 1 ;
    	var holidayFactor = 1;
    	var totalPrice;
    	var carPrice  ;
    	var date;
    	var time;
    	var noOfCars = 1 ;
    	var noOfCustomers = 1 ;
    	var weekendFactor = 1;
    	var carType    = msgPayload.carType;
    	var userLat = msgPayload.source_lat;
    	var userLng = msgPayload.source_lng;  
    	var distance =msgPayload.distance.replace(',','');
    	
    		if( userLat != 0 && userLat != null && userLng != 0 && userLng != null ){
    				 var radius = 16093.4; // 10 miles in meters
    						
    				var lat1 = (userLat + 0.1 + ((radius * Math.sin(2.35619))/ 110540)).toFixed(2);
    				var lng1 = (userLng - 0.1 + ((radius * Math.cos(2.35619))/111320 * Math.cos(userLat))).toFixed(2);
    				
    				var lat2 =  (userLat - 0.1 + ((radius * Math.sin(5.49779))/ 110540)).toFixed(2);
    				var lng2 = (userLng + 0.1 + ((radius * Math.cos(5.49779))/111320 * Math.cos(userLat))).toFixed(2);
    				
    		}
    		async.waterfall([
    		                 function(Callback) {
    		                	 async.series([
    		  			                     function(Callback) {
    		  			                       setTimeout(function() {
    		  			                    	   //getting the Time factor in this case
    		  			                    	   
    			  			                    	//Converting the date from 06:50:21 GMT-0800 (PST) to  0650:21 GMT-0800 (PST)
    			  			                    	 date = new Date().toTimeString().replace(':','');
    		
    			  			                    	 //Fetching the first 4 values to fetch the current time.
    			  			                    	 time = date.substring(0,4);
    		  				                		
    		  				                		//Checking whether the time is between 12:00 am and 6:00 am
    		  				                		if(time > 0 && time < 600  ){
    		  				                			timeFactor = 2;
    		  				                		}
    		  				                		
    		  				                		
    		  				                	// Setting the car price based on miles traveled
    		  				                		if(carType != null)
    			  				                		switch (carType.toUpperCase()) {
    			  				                		case "SUV":
    			  				                			carPrice = 6;
    			  				                			break;
    			  				                		case "SEDAN":
    			  				                			carPrice = 4;
    			  				                			break;
    			  				                		case "HATCHBACK":
    			  				                			carPrice = 2;
    			  				                			break;
    			  				                		default:
    			  				                			console.log(" couldn't find the selected car type");
    			  				                			break;
    			  				                		}
    		  				                		
    		  				                		
    		  				                		
    		  				                		
    		  				                		// here we calculate the holiday factor
    		  				                		var getCurrentYear = new Date().getFullYear();
    		  			                    		var year = new Date().getFullYear();
    		  			                    		var date = new Date().getDate();
    		  			                    		var day = new Date().getDay() + 1;
    		  			                    		var month ;
    		  			                    		
    		  			                    		switch (new Date().getMonth()) {
    		  			                    		case 1:
    		  			                    			month = 'February';
    		  			                    			break;
    		  			                    		case 2:
    		  			                    			month = 'March';
    		  			                    			break;
    		  			                    		case 3:
    		  			                    			month = 'April';
    		  			                    			break;
    		  			                    		case 4:
    		  			                    			month = 'May';
    		  			                    			break;
    		  			                    		case 5:
    		  			                    			month = 'June';
    		  			                    			break;
    		  			                    		case 6:
    		  			                    			month = 'July';
    		  			                    			break;
    		  			                    	    case 7:
    		  			                    	    	month = 'August';
    		  			                    			break;
    		  			                    		case 8:
    		  			                    			month = 'September';
    		  			                    			break;
    		  			                    		case 9:
    		  			                    			month = 'October';
    		  			                    			break;
    		  			                    		case 10:
    		  			                    			month = 'November';
    		  			                    			break;
    		  			                    		case 11:
    		  			                    			month = 'December';
    		  			                    			break;
    		  			                    		case 0:
    		  			                    			month = 'January';
    		  			                    			break;
    		  			                    		default:
    		  			                    			break;
    		  			                    		}
    		  			                    		
    		  			                    	switch (new Date().getDate()) {
												case 0:
													weekendFactor = 0.25;
											    case 6:
													weekendFactor = 0.25;
													break;			
										
												default:
													break;
												}

    		  			                    	   var getHolidayDates = " SELECT COUNT(*) AS count FROM Holidays where year = '" + year + "' and dates = '"+ date +"' and  days_number = '" + day + "' and month = '" + month + "'";
//    		  			                    		var getHolidayDates = "SELECT COUNT(*) AS count FROM Holidays where year = '2015' and dates = '1' and  days_number = '4' and month = 'January'";
    		  			                    		console.log(getHolidayDates);
    		  			                    		dbConn.query(getHolidayDates, function(err, rows){
    		  			                    			if(err){
    		  			                    				console.log(err);
    		  			                    				
    		  			                    			}else if(rows){
    		  			                    				for (var key in rows){
    		  			                    					if(rows.hasOwnProperty(key)){
    		  			                    						console.log(rows[key].count + " today is a holiday if this is one");
    		  			                    						if(rows[key].count == 1){
    		  			                    							holidayFactor = 1.75;
    		  			                    							
    		  			                    						}
    		  			                    					}
    		  			                    				}
    		  			                    			}
    		  			                    			Callback(null, holidayFactor);
    		  			                    		} );
    		  			                         
    		  			                       }, 100);
    		  			                     },
    		  			                     function(Callback) {
    		  			                       setTimeout(function() {
    				  			                   
    				  			           			var queryCountCustomers = "select " +	
    				  			           					"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
    				  			           		            "* cos( radians( customer.latitude ) ) " + 
    				  			           		            "* cos( radians( customer.longitude ) - radians(" + userLng + ") ) " + 
    				  			           		            "+ sin( radians(" + userLat + ") ) * sin( radians( customer.latitude ) ) ) ) AS distance " +  
    				  			           		            " from customer where isActive = 1 and customer.latitude between " + lat2 + " and " + lat1 + 
    				  			           		            " and customer.longitude between " + lng1 + " and " + lng2 +
    				  			           		            " having distance < 10 ORDER BY distance; " ;
    				  			         
    				  			           			
    		  			                    	   dbConn.query(queryCountCustomers , function(err,rows){
    		  			               				if(err){
    		  			               					console.log(err);
    		  			               				
    		  			               				}else if(rows){
    		  			               					if(rows.length > 0){
    		  			               						console.log(" number of customers = " + rows.length);
    		  			               						noOfCustomers = rows.length;
    		  			               						
    		  			               					}
    		  			               				}
    		  			               				Callback(null, noOfCustomers);
    		  			               			});
    		  			                         
    		  			                       }, 100);
    		  			                     },
    		  			                     function(Callback) {
    		  			          			
    		  			          			var queryCountDrivers = "select  " +	
    		  			          			"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
    		  			          		    "* cos( radians( driver.latitude ) ) " + 
    		  			          		    "* cos( radians( driver.longitude ) - radians(" + userLng + ") ) " + 
    		  			          		    "+ sin( radians(" + userLat + ") ) * sin( radians( driver.latitude ) ) ) ) AS distance " +  
    		  			          		    " from driver where isActive = 1 and driver.latitude between " + lat2 + " and " + lat1 + 
    		  			          		    " and driver.longitude between " + lng1 + " and " + lng2 +
    		  			          		    " having distance < 10 ORDER BY distance;";
    		  			          			
    		  			                       setTimeout(function() {
    		  			                    	   dbConn.query(queryCountDrivers, function(err, rows){
    		  			                               if(err){
    		  			                                 console.log(err);
    		  			                              
    		  			                               }else if(rows){
    		  			                                 
    		  			                                   if(rows.length > 0){
    		  			                                     console.log(" number of drivers =" + rows.length);
    		  			                                     noOfCars = rows.length;
    		  			                                   
    		  			                                   }
    		  			                               }
    		  			                               Callback(null, noOfCars);
    		  			                    	   });
    		  			               	
    		  			                         
    		  			                       }, 200);
    		  			                     }
    		  			                   ], function(error, results) {
    		  			        				
    		  			                   
    		  			                 //  	console.log(results + " printing results");
    		  			                  // 	console.log(results.length);
    		  			                     Callback(null, results[0], results[1], results[2]);
    		  			                   });
    		                              
    		                 },
    		                 function(a, b, c, Callback) {
    		                	// console.log("yo boys " + a  + " a" + b + " b" + c + " c");
    		                	 var noOfCustomers = b;
    		                	 var noOfCars = c;
    		                	 if(  noOfCustomers/noOfCars >= 2 && noOfCustomers/noOfCars <= 3 ){
    		                    	 
    		                			surgeFactor = 1.75;
    		                		}else if( noOfCustomers/noOfCars >= 3 && noOfCustomers/noOfCars <= 4){
    		                			surgeFactor = 2;
    		                		}else if( noOfCustomers/noOfCars >= 4 && noOfCustomers/noOfCars <= 6){
    		                			surgeFactor = 2.25;
    		                		}else if (noOfCustomers/noOfCars >= 6 && noOfCustomers/noOfCars <= 8){
    		                			surgeFactor = 2.5;
    		                		}else if (noOfCustomers/noOfCars >= 8 && noOfCustomers/noOfCars <= 10){
    		                			surgeFactor = 3;
    		                		}

    		                		
    		                		holidayFactor = a;

    		                		
    		                		//checking the values in the console.
    		                		
    		                		
    		                   Callback(null, surgeFactor , holidayFactor);
    		                 },
    		                 function(surgeFactor , holidayFactor,  Callback) {
    		                	 console.log("carPrice is " + carPrice + " - Distance is "+ distance +
    		                				" - timeFactor is" + timeFactor + " - surgeFactor is "+ surgeFactor + " -holidayFactor is "+ holidayFactor);
    		                		totalPrice = carPrice * distance * timeFactor * surgeFactor * holidayFactor * weekendFactor;
    		                		console.log(totalPrice + " this is the total price");
    		                		
    		                		totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);
    		                   Callback(null, totalPrice);
    		                 }
    		               ], function(error, c) {
    							response.rideEstimate = c;
    							response.status = 200;
    							//response.send({ rideEstimate : c , status : 200 });
    							callback(null, response);
    		               });
    
    	
	}
