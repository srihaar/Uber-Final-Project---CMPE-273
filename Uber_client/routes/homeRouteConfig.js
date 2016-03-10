var mqClient = require('../rpc/client');
var fs = require('fs');
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var dbConn2 = new mongo.Db('uber', new mongo.Server("127.0.0.1", 27017));
var picFiletype = "";
var videoFiletype = "";
var mysql = require('mysql');
var getBill = require('./dynamicBill');
var localRows;
var dbConn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database: 'uber2',
	port	 : 3306
});	
dbConn.connect();
function homeRouteConfig(app,passport,client){
	
	this.app=app;
	this.passport=passport;
	this.client=client;
	this.routeTable= [];
	this.init();
}

homeRouteConfig.prototype.init = function(){
	
	var self = this;
	this.addRoutes();
	this.processRoutes();
}


homeRouteConfig.prototype.processRoutes = function(){
	
	var self = this;
	self.routeTable.forEach(function(route){
		
		if(route.requestType == 'get'){
			self.app.get(route.requestUrl,route.callbackFunction);
		}
		else if(route.requestType == 'post'){
			self.app.post(route.requestUrl,route.callbackFunction);
		}
		
	});
}

homeRouteConfig.prototype.addRoutes = function(){
	
	var self =  this;
	var passport = self.passport;
	var client = self.client;
	
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/',
	    callbackFunction : function (request,response){
	    	response.render('index');
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/admin',
	    callbackFunction : function (request,response){
	    	response.render('admin_login',{errormessage:''});
	    }
	});
    
   self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/adminSignupPage',
	    callbackFunction : function (request,response){
	    	response.render('admin_signup',{errormessage:''});
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/loginPage',
	    callbackFunction : function (request,response){
	    	response.render('login_page');
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderloginPage',
	    callbackFunction : function (request,response){
	    	response.render('rider_login',{errormessage : ''});
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverloginPage',
	    callbackFunction : function (request,response){
	    	response.render('driver_login',{errormessage : ''});
	    }
	});
    
    
  self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderLogin',
	    callbackFunction : function (request,response){

	    	if(request.session.userid != undefined){
	    		response.render("rider_home",{firstname:request.session.firstname, user: request.session.user});
	    	}else{
	    		response.render("rider_login",{errormessage : ''});
	    	}
	    }
	});
  
  self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderSignup',
	    callbackFunction : function (request,response){

	    	if(request.session.userid != undefined){
	    		response.render("rider_home",{firstname:request.session.firstname, user: request.session.user});
	    	}else{
	    		response.render("rider_login",{errormessage : ''});
	    	}
	    }
	});
  
  self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverSignup',
	    callbackFunction : function (request,response){

	    	if(request.session.userid != undefined){
	    		response.render("driver_home",{firstname:request.session.firstname, user: request.session.user});
	    	}else{
	    		response.render("driver_login",{errormessage : ''});
	    	}
	    }
	});
  
  self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/adminSignup',
	    callbackFunction : function (request,response){

	    	if(request.session.userid != undefined){
	    		response.render("adminHome",{firstname:request.session.firstname, user: request.session.user});
	    	}else{
	    		response.render("admin_login",{errormessage : ''});
	    	}
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverLogin',
	    callbackFunction : function (request,response){
	    	if(request.session.userid != undefined){
	    		response.render("driver_home",{firstname:request.session.firstname});
	    	}else{
	    		response.render("driver_login",{errormessage : ''});
	    	}
	    }
	});
    
   self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/adminLogin',
	    callbackFunction : function (request,response){
	    	if(request.session.userid != undefined){
	    		response.render("adminHome",{firstname:request.session.firstname});
	    	}else{
	    		response.render("admin_login",{errormessage : ''});
	    	}
	    }
	});
    
   self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderSignupPage',
	    callbackFunction : function (request,response){
	    	response.render('rider_signup',{errormessage:''});
	    }
	});
   
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverSignupPage',
	    callbackFunction : function (request,response){
	    	response.render('driver_signup',{errormessage:''});
	    }
	});
    
 self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/bookRide',
	    callbackFunction : function (request,response){
	    	response.render('map',{errormessage:''});
	    }
	});
    
self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/riderLogin',
	    callbackFunction : function (req, res, next){
	      passport.authenticate('local-rider-login', function(err, user, info) {
	      	    if (err) {
	      	       return res.render('error',{errormessage:"An error has occured."});
	      	     }
	      	    if(user)
	      	    {
	      	    	return res.render("rider_home",{firstname:req.session.firstname});
	      	    }else{
	      	    	return res.render("rider_login",{errormessage : 'Sorry, the email or password does not match our records !!'});
	      	    }
	      	  })(req, res, next);
	    }
	});
    
    self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/riderSignup',
	    callbackFunction : function (req, res, next){
	      passport.authenticate('local-rider-signup', function(err, user, info) {
	  	    if (err) {
	  	       return res.render('error', {message:'',errormessage:"An error has occured."});
	  	     }
	  	    if(user)
	  	    {
	  	    	return res.render('rider_home',{firstname:req.session.firstname,errormessage:''});
	  	    }else{
	  	    	return res.render('rider_signup',{errormessage:"Email id already exists!!"});
	  	    }
	  	  })(req, res, next);
	    }
	  });
    
   self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/driverLogin',
	    callbackFunction : function (req, res, next){
	      passport.authenticate('local-driver-login', function(err, user, info) {
	      	    if (err) {
	      	       return res.render('error',{errormessage:"An error has occured."});
	      	     }
	      	    if(user)
	      	    {
	      	    	return res.render("driver_home",{firstname:req.session.firstname});
	      	    }else{
	      	    	return res.render("driver_login",{errormessage : 'Sorry, the email or password does not match our records !!'});
	      	    }
	      	  })(req, res, next);
	      }
     });
    
    self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/driverSignup',
	    callbackFunction : function (req, res, next){
	      passport.authenticate('local-driver-signup', function(err, user, info) {
	  	    if (err) {
	  	       return res.render('error', {errormessage:"An error has occured."});
	  	     }
	  	    if(user)
	  	    {
	  	    	return res.render('driver_home',{firstname:req.session.firstname,errormessage:''});
	  	    }else{
	  	    	return res.render('driver_signup',{errormessage:"Email id already exists!!"});
            }
	  	  })(req, res, next);
	     }
	  });
    
   self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/adminLogin',
	    callbackFunction : function (req, res, next){
	      passport.authenticate('local-admin-login', function(err, user, info) {
	      	    if (err) {
	      	       return res.render('error',{errormessage:"An error has occured."});
	      	     }
	      	    if(user)
	      	    {
	      	    	return res.render("adminHome",{firstname:req.session.firstname});
	      	    }else{
	      	    	return res.render("admin_login",{errormessage : 'Sorry, the email or password does not match our records !!'});
	      	    }
	      	  })(req, res, next);
	       }
	});
    
    self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/adminSignup',
	    callbackFunction : function (req, res, next){
	     passport.authenticate('local-admin-signup', function(err, user, info) {
	  	    if (err) {
	  	       return res.render('error', {message:'',errormessage:"An error has occured."});
	  	     }
	  	    if(user)
	  	    {
	  	    	return res.render('adminHome',{errormessage:'',firstname:req.session.firstname});
	  	    }else{
	  	    	return res.render('admin_signup',{errormessage:"Email id already exists!!"});
            }
	  	  })(req, res, next);
	     }
	  });
    
    self.routeTable.push({

    	    requestType : 'get',
    	    requestUrl  : '/getRides',
    	    callbackFunction : function (request,response){
    	    	var reqType = "getRides";
    	    	var msg_payload = { "userid": request.session.userid, "reqType": reqType };
    	    	mqClient.makeRequest('rider',msg_payload, function(err,results){
    	    		console.log(results.rideDetails);
    	    		response.json({ rideDetails : results.rideDetails});
    	    	});
    	    }
    	});
    
    self.routeTable.push({

 	   requestType : 'get',
 	   requestUrl  : '/getDriverRides',
 	   callbackFunction : function (request,response){
 	   	var reqType = "getDriverRides";
 	   	var msg_payload = { "DriverID": request.session.userid, "reqType": reqType };
 	   	mqClient.makeRequest('driver',msg_payload, function(err,results){ 	   		
 	   	if(err)
	   		 {
	   			console.log(err);
	   		 }
	   		else if(results.code == 401)
	   		 {
	   			response.json({success:false});
	   		 }
	   		else
	   		 {
	   			console.log('session'+ request.session.userid);
	   		response.json({ success:true,rideDetails : results.rideDetails});
	   		 }
 	   		
 	   	});
 	   }
 	});
     
     self.routeTable.push({

     	requestType : 'get',
     	   requestUrl  : '/viewRides',
     	   callbackFunction : function (request,response){
     	   response.render('rides');
     	   }
     	});
     	 
     
     
     self.routeTable.push({

     	requestType : 'get',
     	   requestUrl  : '/viewDriverRides',
     	   callbackFunction : function (request,response){
     	   response.render('driver_rides');
     	   }
     	});
     
     
     self.routeTable.push({

     	requestType : 'get',
     	   requestUrl  : '/viewRidesRequests',
     	   callbackFunction : function (request,response){
     	   response.render('rides_requests');
     	   }
     	});
     
     self.routeTable.push({
     	requestType : 'get',
  	   requestUrl  : '/getRidesRequests',
  	   callbackFunction : function (request,response){
  	   	var reqType = "getRidesRequests";
  	   	var msg_payload = { "DriverID": request.session.userid, "reqType": reqType };
  	   	mqClient.makeRequest('driver',msg_payload, function(err,results){
  	   		console.log('session'+ request.session.userid);
  	   		if(err)
  	   		 {
  	   			console.log(err);
  	   		 }
  	   		else if(results.code == 401)
  	   		 {
  	   			response.json({success:false});
  	   		 }
  	   		else
  	   		 {
  	   		response.json({ success:true,rideDetails : results.rideDetails});
  	   		 }
  	   	});
  	   }
     	});
     
     self.routeTable.push({
    	requestType : 'post',
 	   requestUrl  : '/startRide',
 	   callbackFunction : function (request,response){
 	   	var reqType = "startRide";
 	   	var msg_payload = { "rideId": request.body.rideid, "reqType": reqType };
 	   	mqClient.makeRequest('driver',msg_payload, function(err,results){	   		
 	   		//console.log(results.rideDetails);
 	   		response.json({ success : true});
 	   	});
 	   }
    	});
     
     self.routeTable.push({
    	requestType : 'post',
 	   requestUrl  : '/stopRide',
 	   callbackFunction : function (request,response){
 	   	var reqType = "stopRide";
 	   	var msg_payload = { "rideId": request.body.rideid, "reqType": reqType };
 	   	mqClient.makeRequest('driver',msg_payload, function(err,results){	   		
 	   		//console.log(results.rideDetails);
 	   		response.json({ success : true});
 	   	});
 	   }
    	});
     

     self.routeTable.push({
       	requestType : 'post',
    	   requestUrl  : '/cancelRide',
    	   callbackFunction : function (request,response){
    	   	var reqType = "cancelRide";
    	   	var msg_payload = { "rideId": request.body.rideid, "reqType": reqType };
    	   	mqClient.makeRequest('queue4',msg_payload, function(err,results){

    	   		//console.log(results.rideDetails);
    	   		response.json({ success : true});
    	   	});
    	   }
       	});
     
     self.routeTable.push({
    	    requestType : 'get',
    	        requestUrl  : '/viewStatistics',
    	        callbackFunction : function (request,response){
    	        response.render('statistics');
    	        }
    	    });
    	    
   self.routeTable.push({
    	   	requestType : 'get',
    	    requestUrl  : '/getRevenuePerDay',
    	    callbackFunction : function (request,response){
    	    var reqType = "getRevenuePerDay";
    	    var msg_payload = {"reqType": reqType };
    	    mqClient.makeRequest('admin',msg_payload, function(err,results){
    	    //console.log('session'+ request.session.userid);
    	    if(err)
    	      {
    	    	console.log(err);
    	      }
    	    else if(results.code == 401)
    	      {
    	         response.json({success:false});
    	      }
    	    else
    	      {
    	         response.json({ success:true, stats : results.statistics});
    	      }
    	    });
    	    }
    	   });
    	    
    	    
    self.routeTable.push({
    	      	requestType : 'post',
    	       requestUrl  : '/getRidesPerArea',
    	       callbackFunction : function (request,response){
    	       var reqType = "getRidesPerArea";
    	       var msg_payload = { "area": request.body.area, "reqType": reqType };
    	       mqClient.makeRequest('admin',msg_payload, function(err,results){	   	
    	       //console.log(results.rideDetails);
    	       if(err)
    	      {
    	        console.log(err);
    	      }
    	    else if(results.code == 401)
    	      {
    	        response.json({success:false});
    	      }
    	    else
    	      {
    	        response.json({ success : true, count : results.ridecount});
    	      }
    	   	   	
    	       });
    	       }
    	      });
    	    
    	    
    	    
      self.routeTable.push({
    	    requestType : 'get',
    	        requestUrl  : '/viewBookedRide',
    	        callbackFunction : function (request,response){
    	        response.render('bookedrides');
    	        }
    	    });
    	    
    	    
      self.routeTable.push({
    	   	requestType : 'get',
    	    requestUrl  : '/getBookedRide',
    	    callbackFunction : function (request,response){
    	    var reqType = "getBookedRide";
    	    var msg_payload = { "CustomerID": request.session.userid, "reqType": reqType };
    	    mqClient.makeRequest('rider',msg_payload, function(err,results){
    	    //console.log('session'+ request.session.userid);
    	    if(err)
    	      {
    	    	console.log(err);
    	      }
    	    else if(results.code == 401)
    	      {
    	    	response.json({success:false});
    	      }
    	    else
    	      {
    	    	response.json({ success:true, rideDetails : results.rideDetails});
    	      }
    	    });
    	    }
     });
    
    self.routeTable.push({

    	requestType : 'get',
    	    requestUrl  : '/viewRides',
    	    callbackFunction : function (request,response){
    	    response.render('rides');
    	    }
    	});
    	    
    self.routeTable.push({
    	requestType : 'get',
    	    requestUrl  : '/viewPayment',
    	    callbackFunction : function (request,response){
    	    response.render('payment');
    	    }
    	});
    
 /*  self.routeTable.push({
		
		requestType : 'post',
	    requestUrl  : '/listNearByDrivers',
	    callbackFunction : function (request,response){
	    	console.log('inside route config');
	    	console.log(request.body);
	    }
	});*/
    
    self.routeTable.push({
    	requestType : 'post',
    	   requestUrl  : '/listNearByDrivers',
    	   callbackFunction : function (req, res){
//    	     if(req.session.userId == undefined || req.session.userId == null) {
//    	     res.json({status: "pls login first"});
//    	     }
    	   
    	var reqType = "listNearByDrivers";
    	var msgPayload = {
    	reqType: reqType,
    	userLat: req.body.userLat,//37.3380000
    	userLng: req.body.userLng  //-121.8840000
    	};
    	console.log("listNearByDrivers");
    	console.log(req.body);
    	mqClient.makeRequest('queue1', msgPayload, function(err, rows){
    		if(err) {
    		console.log("error occured" + err);
    		rows.status = err;
    		res.json(rows);
    		}
    		else {
    		if(!rows.errorOccured) {
    		rows.status = "success";
    		console.log("Client:" + msgPayload.reqType + " success; server response below");
//    		console.log(rows);
    		console.log("list nearby success, sending json resp to browser");
//    		res.json({drivers: rows.driverList});
    		res.json(rows);
//    		callback(null,res);
    		}
    		else{
    		console.log("Client:" + msgPayload.reqType + " failed. some error occured at server, err msg below:");
    		console.log(response.status);
    		res.json(response);
    		}
    		}
    		});
    	//placeRequest('queue1', msgPayload);
    	
    	   }
    	});
	
	
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/logout',
	    callbackFunction : function (request,response){
	    	request.session.destroy();
	    	request.logout();
	    	response.redirect('/');
	    }
	});
    
    self.routeTable.push({

    	requestType : 'get',
    	   requestUrl  : '/getUserDetails',
    	   callbackFunction : function (request,response){
    	    if(request.session.userid != undefined){
    	    console.log("sending user details");
    	    response.json(request.session.user);
    	    }else{
    	    response.render("rider_login",{errormessage : ''});
    	    }
    	   }
    	});
    
    self.routeTable.push({
    	requestType : 'post',
    	   requestUrl  : '/bookARide',
    	   callbackFunction : function (req, res){
    	      if(req.session.userid == undefined || req.session.userid == null) {
    	      res.json({status: "pls login first"});
    	      }      
    	      var reqType = "bookARide";
    	    var user = req.session.user;
    	    var msgPayload = {
    	    driverId: req.body.driverId,
    	    customerId : req.session.userid,
    	    riderName  : req.session.firstname,
    	 //   customerId: req.body.customerId,
    	 //   riderName: req.body.riderName,
    	    driverName: req.body.driverName,
    	  //  riderPhone: req.body.riderPhone,
    	    riderPhone: user.phoneNumber,
    	    dropOffLocation: req.body.dropOffLocation,
    	    pickUpLocation: req.body.pickUpLocation,
    	    srcLat: req.body.srcLat,
    	    srcLng: req.body.srcLng,
    	    destLat: req.body.destLat,
    	    destLng: req.body.destLng,
    	    totalPrice: req.body.totalPrice,
		    totalDistance: req.body.totalDistance,
		    carType : req.body.carType,
    	    reqType: reqType
    	    };
    	    console.log(reqType);
    	    console.log('book a ride req body'+req.body.totalPrice);
    	    mqClient.makeRequest('queue1', msgPayload, function(err, rows){
    	    if(err) {
    	    console.log("error occured" + err);
    	    rows.status = err;
    	    res.json(rows);
    	    }
    	    else {
    	    if(!rows.errorOccured) {
    	    rows.status = "success";
    	    console.log("Client:" + msgPayload.reqType + " success; server response below");
    	    res.json(rows);
    	    }
    	    else{
    	    console.log("Client:" + msgPayload.reqType + " failed. some error occured at server, err msg below:");
    	    console.log(response.status);
    	    res.json(response);
    	    }
    	    }
    	    });    
    	   }
    	  });
    
    
    self.routeTable.push({	
    	requestType : 'post',
    	   requestUrl  : '/uploadPic',
    	   callbackFunction : function (req, res){
//    		   	console.log("inside upload pic");
    	   	var file = req.files.file;
    	 	   	picFiletype = ((file.name).split('.'))[1];
    	 	    req.session.user.picFiletype = picFiletype;
    	 	   	console.log("picFiletype: ", picFiletype);
    	   	if (!(picFiletype == 'png' || picFiletype == 'jpg' || picFiletype == 'jpeg' || picFiletype == 'PNG' || picFiletype == 'JPG' || picFiletype == 'JPEG')) 
    	   	res.send(500, {error: 'invalid file format, pls use png, jpg or jpeg'});	   	
    	   	
    	   	dbConn2.open(function (err) {
    	   	if (err) 
    	   	console.log(err);
    	   	var gfs = Grid(dbConn2, mongo);	 	   	
    	 	   	readfs = fs.createReadStream(file.path);
    	 	   	var filename = req.session.user.DriverID + "Pic." + picFiletype;
    	 	   	var writefs = fs.createWriteStream('../Uber_client/public/images/' + filename);
//    		 	   	var writefs = fs.createWriteStream('C:\\Users\\Priyanka\\Documents\\Fall 2015\\images\\' + filename);
    	 	   	readfs.pipe(writefs);
    	 	   	 	   	
    	           var writeStream = gfs.createWriteStream({
    	           	filename: filename,
    	 	mode: 'w',
    	               content_type:file.type,
    	               metadata: {
    	               	driver: {
    	               	driverId: req.session.user.driverId,	               	
    	               	firstName: req.session.user.firstName,
    	               	lastName: req.session.user.lastName,
    	               	}
    	               }
    	           });
    	           writeStream.on('close', function() {
    	           	console.log("upload pic success");
    	           });	             
    	           //writeStream.write(file.path);
    	           writeStream.end();
//    		           res.json({message: 'upload success'});
    	           //res.status(500).send("upload success");
    	           res.render('driver_home',{firstname:req.session.firstname});
    	   	})
    	   }
    	});
    
    
    self.routeTable.push({	
    	requestType : 'post',
    	   requestUrl  : '/uploadVideo',
    	   callbackFunction : function (req, res){
//    		   	console.log("inside upload pic");
    	   	var file = req.files.file;
    	 	   	videoFiletype = ((file.name).split('.'))[1];
    	 	    req.session.user.videoFiletype = videoFiletype;
    	 	   	console.log("videoFiletype: ", videoFiletype);
    	   	if (!(videoFiletype == 'mp4' || videoFiletype == 'MP4')) 
    	   	res.send(500, {error: 'invalid file format, pls use mp4'});	   	
    	   	
    	   	dbConn2.open(function (err) {
    	   	if (err) 
    	   	console.log(err);
    	   	var gfs = Grid(dbConn2, mongo);	 	   	
    	 	   	readfs = fs.createReadStream(file.path);
    	 	   	var filename = req.session.user.DriverID + "Video." + videoFiletype;
    	 	   	var writefs = fs.createWriteStream('../Uber_client/public/images/' + filename);
//    		 	   	var writefs = fs.createWriteStream('C:\\Users\\Priyanka\\Documents\\Fall 2015\\images\\' + filename);
    	 	   	readfs.pipe(writefs);
    	 	   	 	   	
    	           var writeStream = gfs.createWriteStream({
    	           	filename: filename,
    	 	mode: 'w',
    	               content_type:file.type,
    	               metadata: {
    	               	driver: {
    	               	driverId: req.session.user.driverId,	               	
    	               	firstName: req.session.user.firstName,
    	               	lastName: req.session.user.lastName,
    	               	}
    	               }
    	           });
    	           writeStream.on('close', function() {
    	           	console.log("upload pic success");
    	           });	             
    	           //writeStream.write(file.path);
    	           writeStream.end();
//    		           res.json({message: 'upload success'});
    	           //res.status(500).send("upload success");
    	           res.render('driver_home',{firstname:req.session.firstname});
    	   	})
    	   }
    	});
    
    
    //admin modules
    
        
    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/home',
        callbackFunction : function (req,res){
        	console.log("fofr home render"+req.session.username);
        	if(req.session.username){
        	res.render('adminHome');
        	}
        	else{
        		res.render('adminLogin');
        	}
        	}
        
    }); 

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/cusProfile',
        callbackFunction : function (req,res){
        	
        	res.render('cusProfile');
        	}
        
    }); 

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/driProfile',
        callbackFunction : function (req,res){
        	 
        	res.render('driver_profile');
        	}
        
    }); 



    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/billDetail',
        callbackFunction : function (req,res){
        	 
        	res.render('billView');
        	}
        
    }); 




    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/search',
        callbackFunction : function (req,res){
        	
        	res.render('adminSearch');
        	}
        
    }); 

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/billSearch',
        callbackFunction : function (req,res){
        	
        	res.render('billSearch');
        	}
        
    });
    

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/listAllCustomers',
        callbackFunction : function (req,res){
        	
        	res.render('listAllCustomers');
        	}
        
    });
    
   self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/viewProfile',
        callbackFunction : function (req,res){
        	res.render('user_profile');
        }
        
    });

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/getAllCustomers',
        callbackFunction : function (req,res){
        	var msg_payload = { "reqType":"getAllCustomers" };
        	console.log(msg_payload);
        	mqClient.makeRequest('admin_queue',msg_payload, function(err,results){
        	var json_responses={"statusCode" : results.code, "message" : results.value,"userProfile":results.userProfile};
        		res.send(json_responses);
        	});
        	
        	}
        
    }); 


    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/listAllDrivers',
        callbackFunction : function (req,res){
        	
        	res.render('listAllDrivers');
        	}
        
    }); 

    self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/getAllDrivers',
        callbackFunction : function (req,res){
        	var msg_payload = { "reqType":"getAllDrivers" };
        	console.log(msg_payload);
        	mqClient.makeRequest('admin_queue',msg_payload, function(err,results){
        	var json_responses={"statusCode" : results.code, "message" : results.value,"driverProfile":results.driverProfile};
        		res.send(json_responses);
        	});
        	
        	}
        
    }); 

    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/loginAdmin/:username/:password',
        callbackFunction : function (req,res){
        	
        	var msg_payload = { "username": req.params.username, "password": req.params.password,"reqType":"loginAdmin" };
        	console.log(msg_payload);
        	console.log("in routes");
        	mqClient.makeRequest('admin_queue',msg_payload, function(err,results){
        		req.session.username=results.username;
        		console.log("session set"+req.session.username);
        		json_responses={"statusCode" : results.code, "message" : results.value}
        		res.send(json_responses);
        	});
        }
    });

    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/adminSearch/:searchTerm/:search/:type',
        callbackFunction : function (req,res){
        	
        	var searchTerm=req.params.searchTerm;
        	var search=req.params.search;
        	var type = req.params.type;
        	console.log(searchTerm);
        	var msg_payload = {"searchTerm":searchTerm,"search":search,"type":type,"reqType":"adminSearch"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        	json_responses = {"statusCode":results.code,"message":results.value,"userProfile":results.userProfile,"driverProfile":results.driProfile};
        	res.send(json_responses);
        	});
        }
    });

    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/billSearchResults/:searchTerm',
        callbackFunction : function (req,res){
        	
        	var searchTerm=req.params.searchTerm;
        	console.log(searchTerm);
        	var msg_payload = {"searchTerm":searchTerm,"reqType":"billSearch"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        	json_responses = {"statusCode":results.code,"message":results.value,"billResults":results.billResults};
        	res.send(json_responses);
        	});
        }
    });


    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/viewCusProfile/:CustomerID',
        callbackFunction : function (req,res){
        	var customerID=req.param("CustomerID");
        	console.log(customerID);
        	var msg_payload = {"customerID":customerID,"reqType":"viewCusProfile"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        	   
        		json_responses = {"statusCode":results.code,"message":results.value,"userProfile":results.userProfile};
        	    res.send(json_responses);
        	});
        	
        }
    });

    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/viewDriProfile/:DriverID',
        callbackFunction : function (req,res){
        	var 	driverID=req.param("DriverID");
        	console.log(driverID);
        	var msg_payload = {"driverID":driverID,"reqType":"viewDriProfile"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        	   
        	  
        	  
        		json_responses = {"statusCode":results.code,"message":results.value,"driProfile":results.driProfile};
        	    res.send(json_responses);
        	});
        	
        }
    });


    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/viewBill/:BillingID',
        callbackFunction : function (req,res){
        	var BillingID=req.param("BillingID");
        	console.log(BillingID);
        	var msg_payload = {"BillingID":BillingID,"reqType":"viewBill"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        	   
        	  
        	  
        		json_responses = {"statusCode":results.code,"message":results.value,"bill":results.billDetail};
        	    res.send(json_responses);
        	});
        	
        }
    });


    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/deleteCustomer/:customerID',
        callbackFunction : function (req,res){
        	var customerID=req.param("customerID");
        	console.log(customerID);
        	var msg_payload = {"customerID":customerID,"reqType":"deleteCustomer"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        		json_responses = {"statusCode":results.code,"statusCode1":results.code1,"message":results.value};
        	res.send(json_responses);
        	});
        	
        	
        }
    });

    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/deleteDriver/:driverID',
        callbackFunction : function (req,res){
        	var driverID=req.param("driverID");
        	console.log(driverID);
        	var msg_payload = {"driverID":driverID,"reqType":"deleteDriver"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        		json_responses = {"statusCode":results.code,"statusCode1":results.code1,"message":results.value};
        	res.send(json_responses);
        	});
        	
        	
        }
    });


    self.routeTable.push({
    	
    	requestType : 'post',
        requestUrl  : '/deleteBill/:billID',
        callbackFunction : function (req,res){
        	var billID=req.param("billID");
        	console.log(billID);
        	var msg_payload = {"billID":billID,"reqType":"deleteBill"};
        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
        		json_responses = {"statusCode":results.code,"statusCode1":results.code1,"message":results.value};
        	res.send(json_responses);
        	});
        	
        	
        }
    });

   self.routeTable.push({
    	
    	requestType : 'get',
        requestUrl  : '/adminLogOut',
        callbackFunction : function (req,res){
        	console.log("logout is here");
        	req.session.destroy();
        	res.send({title:""});
        	}
        
    }); 
   
   self.routeTable.push({
	   	
	   	requestType : 'get',
	       requestUrl  : '/pendingRequests',
	       callbackFunction : function (req,res){
	       	res.render('pendingRequests');
	       	}
	       
	   }); 
	   self.routeTable.push({
		   	
		   	requestType : 'get',
		       requestUrl  : '/getRequests',
		       callbackFunction : function (req,res){
		    	   var msg_payload = {"reqType":"getRequests"};
		        	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
		        		json_responses = {"statusCode":results.code,"message":results.value,"requestList":results.requestList};
		        	res.send(json_responses);  	
		       	})
		       }
		       
		   }); 
	   
	   
	   self.routeTable.push({
	   	
	   	requestType : 'post',
	       requestUrl  : '/approveRequest/:driverID',
	       callbackFunction : function (req,res){
	       	var driverID=req.param("driverID");
	       	console.log(driverID);
	       	var msg_payload = {"driverID":driverID,"reqType":"approveRequest"};
	       	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
	       		json_responses = {"statusCode":results.code,"message":results.value};
	       	res.send(json_responses);
	       	});
	       	
	       	
	       }
	   });
	   
	   self.routeTable.push({
		   	
		   	requestType : 'post',
		       requestUrl  : '/rejectRequest/:driverID',
		       callbackFunction : function (req,res){
		       	var driverID=req.param("driverID");
		       	console.log(driverID);
		       	var msg_payload = {"driverID":driverID,"reqType":"rejectRequest"};
		       	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
		       		json_responses = {"statusCode":results.code,"message":results.value};
		       	res.send(json_responses);
		       	});
		       	
		       	
		       }
		   });
	   
	   
	   self.routeTable.push({
		   	
		   	requestType : 'post',
		       requestUrl  : '/viewPendingProfile/:driverID',
		       callbackFunction : function (req,res){
		       	var driverID=req.param("driverID");
		       	console.log(driverID);
		       	var msg_payload = {"driverID":driverID,"reqType":"viewPendingProfile"};
		       	mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
		       		json_responses = {"statusCode":results.code,"message":results.value,"pendingProfile":results.pendingProfile};
		       	res.send(json_responses);
		       	});
		       	
		       	
		       }
		   });
	   
	   self.routeTable.push({
		   	
		   	requestType : 'get',
		       requestUrl  : '/pendingProfile',
		       callbackFunction : function (req,res){
		       	res.render('pendingProfile');
		       	
		       	
		       	
		       }
		   });
   
	   self.routeTable.push({
			
			requestType : 'get',
		    requestUrl  : '/listBills',
		    callbackFunction : function (request,response){	
		    		
		    		var localRows;
		    		//this must be taken from the database as well
		        	var customerID = request.session.userid; 	
		    	
		        	var query= "SELECT" + 
		            "`bills`.`Date`," +
		            "`bills`.`pickupTime`," +
		            "`bills`.`dropoffTime`," +
		            "`bills`.`carType`," +
		            "`bills`.`Distance`," +
		            "`bills`.`amount`," +
		            "`bills`.`SrcLocation`," +
		            "`bills`.`DestLocation`," +
		        	"`bills`.`driverName`," +
		        	"`bills`.`isRated`," +
		        	"`bills`.`driverID`"+
		        "FROM `bills` JOIN `driver` on  `bills`.`driverID` = `driver`.`driverID`"+ 
		        "where `bills`.`customerID` =" + customerID + "  Order by `bills`.`Date` Desc" ;
		        	console.log(query + "query to list all bills of the current customer");
		        	dbConn.query(query, function(err, rows) {
		        		//console.log(rows);
		        		if (err) {
		        		        console.log(err);
		        		        response.code = "401";
		        		        response.value = "Failed Login";
		        		      } else if (rows.length) {
		        		    	 // console.log(rows + " inside rows.length");
		        		    	 response.code = "200";
		        		    	 response.value = "Succes Login";
		        		    	 localRows = rows;
		        		      } else {
		        		        console.log('No document(s) found with defined "find" criteria!');
		        		        response.code = "401";
		        		        response.value = "Failed Login";
		        		      }
		        	});
		        	setTimeout(function(){
		    			if(response.code == "200"){
		    			//console.log(localRows);	
		    			response.json({results : localRows});
		    			}
		    		},100);
		        	
		     
		    }
		});
	   
	self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/listAllBills',
	    callbackFunction : function (request,response){
	    	
	    		response.render("list_bills");
	    	
	    }
	});
	
	self.routeTable.push({

		   requestType : 'get',
		   requestUrl  : '/getGraph',
		   callbackFunction : function (request,response){
		   	console.log('coming here');
		    response.render('showgraph');
		   }
		});
	
	
		 self.routeTable.push({

		    requestType : 'post',
		    requestUrl  : '/showgraph/:graphSearchText/:graphSearch',
		    
		    callbackFunction : function (req,res){
		    
		    var graphSearchText=req.params.graphSearchText;
		    var graphSearch=req.params.graphSearch;
		    console.log('graphSearchText: '+graphSearchText);
		    var msg_payload = {"graphSearchText":graphSearchText,"graphSearch":graphSearch,"reqType":"showgraph"};
		    mqClient.makeRequest('admin_queue',msg_payload,function(err,results){
		//    	console.log('results'+results);	
		    	
	//	    console.log(results.graphDetails);
		    res.json(results.graphDetails);
		    });
		    }
		});
		 
		 self.routeTable.push({
				
				requestType : 'post',
			    requestUrl  : '/getBill',
			    callbackFunction : function (request,response){
			    	
			    	var driverName = request.param("driver");
			    	var distance   = request.param("distance");
			    	var carType    = request.param("carType");
			    	var getDistance = distance.split(" ");
			    	var source_lat  = request.param("srcLat");
			    	var source_lng = request.param("srcLng");
			    	console.log(" in getBill api with values as "+ getDistance[0] + " ," + carType);
			    	var totalPrice = getBill.generateBill(getDistance[0],carType, source_lat, source_lng);
			    	response.send({ totalPrice : totalPrice });
			    }
			});
		    
		 self.routeTable.push({
				
				requestType : 'post',
			    requestUrl  : '/rideEstimate',
			    callbackFunction : function (request,response){

			    	var carType    = request.param("carType");
			    	var distance   = request.param("distance");
			    	var source_lat = request.param("source_lat");
			    	var source_lng = request.param("source_lng");  
			    	var getDistance = distance.split(" ");
			    	 var msg_payload = {"carType":carType,"distance":getDistance[0],"source_lat":source_lat,"source_lng" :source_lng ,"reqType":"getRideEstimate"};
					    mqClient.makeRequest('rider',msg_payload,function(err,results){
					    	console.log('results'+results);	
						    response.json(results);
					    });
			    }
			});
		    
				self.routeTable.push({
						
						requestType : 'get',
					    requestUrl  : '/viewBill',
					    callbackFunction : function (request,response){
					    	
					    	response.render('view_bill');
					    }
					});
				
				
				self.routeTable.push({
					
					requestType : 'post',
				    requestUrl  : '/submitCustomerReview',
				    callbackFunction : function (request,response){
				    	
				    	var driverId = request.param('driverId');
				    	//var customerId = req.param(); -have to get this through session variable.
				        var customerId = request.session.userid;
				    	var review = request.param('review');
				    	var rating = request.param('rating');
				    	console.log(review);
				    	var reqType = "submitCustomerReview";
		    	    	var msg_payload = { "driverId": driverId, "review" : review, "rating" :rating, "customerId" : customerId, "reqType": reqType };
		    	    	mqClient.makeRequest('rider',msg_payload, function(err,results){
		    	    	
		    	    		console.log(results.status + " this is the results we are printing from submit review");
		    	    		response.send({status : 200});
		    	    	});
				    	
				    }
				});
				
				
				self.routeTable.push({
					
					requestType : 'get',
				    requestUrl  : '/viewIndividualbill',
				    callbackFunction : function (request,response){
				    		response.render("viewIndividualBill");
				    }
				});
				
				self.routeTable.push({

			    	   requestType : 'get',
			    	   requestUrl  : '/getDriverRating/:test',
			    	   callbackFunction : function (request,response){
			    		   var driverId = request.param('test');
			    		   console.log(" driverid is "+ driverId);
			    		   var query = "SELECT AVG(RATING) as rating FROM customerReviews where ReviewerID = " + dbConn.escape(driverId) + " ";
			    		   console.log(" this is the query for average rating of the customer "+ query);
			    		   dbConn.query(query,function(err,rows){
			    			   if(err){
			    				   console.log(" couldn't calculate the average rating of the customer reviews");
			    			   }else if(rows.length > 0){
			    				   console.log("avg rating is" + rows);
			    				   response.send(rows);
			    			   }
			    		   });
			    	   }
			    	});
				

				self.routeTable.push({

				     	requestType : 'get',
				     	  requestUrl  : '/viewDriverProfile',
				     	  callbackFunction : function (request,response){
				     	  response.render('driProfile');
				     	  }
				 });
				
				self.routeTable.push({

				 	   requestType : 'get',
				 	   requestUrl  : '/getIndividualDriverRating/:test',
				 	   callbackFunction : function (request,response){
				 		   var driverId = request.param('test');
				 		   var customerId = request.session.userid;
				 		   console.log(" driverid is "+ driverId);
				 		   var query = "SELECT rating, review FROM driverReviews where ReviewerID = " +
				 		                   dbConn.escape(customerId) + " and DriverID = "+ dbConn.escape(driverId);
				 		   console.log(" this is the query for  rating of the driver "+ query);
				 		   dbConn.query(query,function(err,rows){
				 			   if(err){
				 				   console.log(" couldn't calculate the average rating of the customer reviews");
				 			   }else if(rows.length > 0){
				 				   console.log("rating is" + rows);
				 				   response.send(rows);
				 			   }
				 		   });
				 	   }
				 	});
				

    
}

function placeRequest(qName, msgPayload) {
	mqClient.makeRequest(qName, msgPayload, function(err, response){
	if(err) {
	console.log("error occured" + err);
	response.status = err;
	res.json(response);
	}
	else {
	if(!response.errorOccured) {
	response.status = "success";
	console.log("Client:" + msgPayload.reqType + " success; server response below");
	console.log(response);
	res.json({drivers: response.driverList});
	callback(null,res);
	}
	else{
	console.log("Client:" + msgPayload.reqType + " failed. some error occured at server, err msg below:");
	console.log(response.status);
	res.json(response);
	}
	}
	});
}


module.exports = homeRouteConfig;