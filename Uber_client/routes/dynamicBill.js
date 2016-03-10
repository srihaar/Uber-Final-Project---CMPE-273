var mysql = require('mysql');
var async = require('async');

var dbConn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database: 'uber',
	port	 : 3306
});	
dbConn.connect();

exports.generateBill = function ( distance , carType, userLat , userLng){


	
	//Converting the date from 06:50:21 GMT-0800 (PST) to  0650:21 GMT-0800 (PST)
	var date = new Date().toTimeString().replace(':','');
	
	//Fetching the first 4 values to fetch the current time.
	var time = date.substring(0,4);
	
	var userLat ;
	var userLng ;
	
	this.userLat = userLat;
	this.userLng = userLng;
	
	console.log(this.userLat + " this is the user latitude - "+ this.userLng + " this is the user longitude")
/*	var userLat = 37.336272; 
	var userLng = -121.888553;*/
	
	//variables required to determine the final price.
	var carPrice  ;
	var timeFactor = 1 ;
	var surgeFactor = 1 ;
	var holidayFactor = 1;
	var totalPrice;
	
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
	


	//Setting a pricing factor on account of holidays
	

	
	
	
	
	//there will be two queries to identify the number of customers and drivers based on the customers current location
	// we just need to use the listbynear by drivers sql query to come up with the number of drivers who are available
	// number of customers can be calculated by storing his current location as soon as he opens the book a ride api -
	// for suppose if there are multiple customers who are trying to book for the ride at the same time , all their locations will
	// stored in the database which can then be used over here to get the number of customers within a 10 mile radius
	var noOfCars = 1 ;
	var noOfCustomers = 1 ;
	
	if( userLat != 0 && userLat != null && userLng != 0 && userLng != null ){
		console.log("inside dynamic pricing customer/car ratio part");	
		var radius = 16093.4; // 10 miles in meters
			
			var lat1 = (userLat + 0.1 + ((radius * Math.sin(2.35619))/ 110540)).toFixed(2);
			var lng1 = (userLng - 0.1 + ((radius * Math.cos(2.35619))/111320 * Math.cos(userLat))).toFixed(2);
			
			var lat2 =  (userLat - 0.1 + ((radius * Math.sin(5.49779))/ 110540)).toFixed(2);
			var lng2 = (userLng + 0.1 + ((radius * Math.cos(5.49779))/111320 * Math.cos(userLat))).toFixed(2);
			
			var queryCountCustomers = "select " +	
					"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
		            "* cos( radians( customer.latitude ) ) " + 
		            "* cos( radians( customer.longitude ) - radians(" + userLng + ") ) " + 
		            "+ sin( radians(" + userLat + ") ) * sin( radians( customer.latitude ) ) ) ) AS distance " +  
		            " from customer where isActive = 1 and customer.latitude between " + lat2 + " and " + lat1 + 
		            " and customer.longitude between " + lng1 + " and " + lng2 +
		            " having distance < 10 ORDER BY distance; " ;
			
			var queryCountDrivers = "select  " +	
			"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
		    "* cos( radians( driver.latitude ) ) " + 
		    "* cos( radians( driver.longitude ) - radians(" + userLng + ") ) " + 
		    "+ sin( radians(" + userLat + ") ) * sin( radians( driver.latitude ) ) ) ) AS distance " +  
		    " from driver where isActive = 1 and driver.latitude between " + lat2 + " and " + lat1 + 
		    " and driver.longitude between " + lng1 + " and " + lng2 +
		    " having distance < 10 ORDER BY distance;";
			
			   dbConn.query(queryCountDrivers, function(err, rows){
      				if(err){
      					console.log(err);
      				}else if(rows){
      					
      						if(rows.length > 0){
      							console.log(" number of cars =" + rows.length);
      							noOfCars = rows.length;
      						    dbConn.query(queryCountCustomers , function(err,rows){
		               				if(err){
		               					console.log(err);
		               				}else if(rows){
		               					if(rows.length > 0){
		               						console.log(" number of customers = " + rows.length);
		               						noOfCustomers = rows.length;
		               					 var getHolidayDates = " SELECT COUNT(*) AS count FROM Holidays where year = '" + year + "' and dates = '"+ date +"' and  days_number = '" + day + "' and month = '" + month + "'";
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
		               			       		} );
		               					}
		               				}	
		               			});
      						}
      					
      				}
      			});
			
			  
//       		var getHolidayDates = "SELECT COUNT(*) AS count FROM Holidays where year = '2015' and dates = '1' and  days_number = '4' and month = 'January'";
       	//console.log(getHolidayDates);
       		
	}
		
	
		// Setting the car price based on km's traveled
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
		
		//Checking whether the time is between 12:00 am and 6:00 am
		if(time > 0 && time < 600  ){
			timeFactor = 2;
		}
		

		//checking the surge factor by means of number of cars and number of customers available at a particular screen
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
		//checking the values in the console.
		console.log("carPrice is " + carPrice + " - Distance is "+ distance +
				" - timeFactor is" + timeFactor + " - surgeFactor is "+ surgeFactor + " -holidayFactor is "+ holidayFactor);
		totalPrice = carPrice * distance * timeFactor * surgeFactor * holidayFactor ;
		console.log(totalPrice + " this is the total price");
		//rounding up the decimal places to two digits
		//console.log(Math.round(totalPrice * 100) / 100);
		
		totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);
		
		return totalPrice;
		
	
		
}