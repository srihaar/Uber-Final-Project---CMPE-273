var processReq = require('./processRequest');

/*Method to handle the incoming client requests*/
exports.handleRequest = function (msgPayload, callback) {	
	var reqType = msgPayload.reqType;		
	switch(reqType) {
		case "signUp":
			console.log("Server: routing to sign up");
			processReq.signUp(msgPayload, callback);
			break;
		case "login":
			processReq.login(msgPayload, callback);
			break;		
		case "logout":
			processReq.logout(msgPayload, callback);
			break;
		case "listNearByDrivers":
			processReq.listNearByDrivers(msgPayload, callback);
			break;
		case "bookARide":
			processReq.bookARide(msgPayload, callback);
			break;
		case "riderSignUp":
			processReq.riderSignup(msgPayload, callback);
			break;
		case "riderLogin":
			processReq.riderLogin(msgPayload, callback);
			break;	
		case "driverSignUp":
			processReq.driverSignup(msgPayload, callback);
			break;
		case "driverLogin":
			processReq.driverLogin(msgPayload, callback);
			break;
		case "adminSignup":
			processReq.adminSignup(msgPayload, callback);
			break;
		case "adminLogin":
			processReq.adminLogin(msgPayload, callback);
			break;
		case "getRides":
			processReq.getRides(msgPayload, callback);
			break;
		case "getDriverRides":
			processReq.getDriverRides(msgPayload, callback);
			break;
		case "getRidesRequests":
			processReq.getRidesRequests(msgPayload, callback);
			break;
		case "startRide":
			processReq.startRide(msgPayload, callback);
			break;
		case "stopRide":
			processReq.stopRide(msgPayload, callback);
			break;
		case "cancelRide":
			processReq.cancelRide(msgPayload, callback);
			break;
		case "submitCustomerReview":
			processReq.submitCustomerReview(msgPayload, callback);
			break;
		case "getRidesPerArea":	
			processReq.getRidesPerArea(msgPayload, callback);
			break;
	    case "getRevenuePerDay":
			processReq.getRevenuePerDay(msgPayload, callback);
			break;
		case "getBookedRide":
			processReq.getBookedRide(msgPayload, callback);
			break;
		case "getRideEstimate":
			processReq.getRideEstimate(msgPayload,callback);
			break;
	
		}
}