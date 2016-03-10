var mqClient = require('../rpc/client');
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../model/user');

module.exports = function(passport,client) {
	
   passport.serializeUser(function(user, done) {
	   done(null, user.id);
    });

   passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
   
  passport.use('local-driver-login', new LocalStrategy({
	      usernameField : 'email',
	      passwordField : 'password',
	      passReqToCallback : true
	  },
	  function(req, email, password, done) {
	     var username = req.param("email");
	     var password = req.param("password");
	     var reqType = "driverLogin";
	     var msg_payload = { "username": username, "password": password, "reqType": reqType };

	     console.log("In POST Request = UserName:"+ username+" "+password);
	     mqClient.makeRequest('driver',msg_payload, function(err,results){
         if(err){
	       console.log(err);
	       return done(err);
	     }
	     else
	     {
	      if(results.code == "200"){
	        console.log("valid Loginnnnnnn");
	        var userDetails = results.result[0];
            req.session.userid = userDetails.DriverID;
	        req.session.firstname = userDetails.FirstName;
	        req.session.user = userDetails;
	        req.session.user.picFiletype = "jpg";
	        req.session.user.videoFiletype = "mp4";
	        req.session.save();
	        client.hmset(req.session.userid,userDetails);
	        return done(null, results);
	     }
	     else {    
	      console.log("Invalid Login");
	      if (!err) {
	         return done(null, false,'');
	      }else {
	            return done(err);
	           console.log(err);
	       }
	     }
	   }  
	  });
	 }));
  


   passport.use('local-driver-signup', new LocalStrategy({
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback : true
   },
   function(req, email, password, done) {
       
       process.nextTick(function() {
       var email = req.param("email");
       var password = req.param("password");
       var newUser = new User();
       var reqType = "driverLogin";
       var msg_payload = { "username": email, "password": password, "reqType": reqType };
       console.log("In POST Request = UserName:"+ email+" "+password);
       mqClient.makeRequest('driver',msg_payload, function(err,results){
       if(err){
        return done(err);
        }else{
        	console.log(results.result);
           if(results.result != null && results.result.length > 0){
        	     return done(null, false);
           }else{
        	   var firstname = req.param("firstname");
               var lastname = req.param("lastname");
               var fullname = firstname+" "+lastname;
               var address = req.param("address");
               var city = req.param("city");
               var state = req.param("state");
               var zipCode = req.param("zipCode");
               var mobileNumber = req.param("mobileNumber");
               var carType = req.param("carType");
               reqType = "driverSignUp";
               msg_payload = { "email": email, "password": password, "firstname":firstname, "lastname":lastname, "address":address, "city":city,"state":state,"zipCode": zipCode,
               "mobileNumber":mobileNumber,"carType":carType, "reqType": reqType};
               mqClient.makeRequest('driver',msg_payload, function(err,results){
               console.log(results.code);
               console.log(results);
               if(err){
                 console.log(err);
                 return done(err);
               }
               else
               {
                if(results.code == 200){
                   console.log("valid signup");
                   req.session.userid = results.DriverID;
                   req.session.firstname = firstname;
                   var userDetails = { "Email": email, "FirstName":firstname, "LastName":lastname, "Address":address, "City":city,"State":state,"ZipCode": zipCode,"PhoneNumber":mobileNumber};
      	           req.session.user = userDetails;
                   req.session.save();
                   return done(null, newUser);
                }
               else {    
                   console.log("Invalid signup");
                   return done(null, false);
                   }
               }  
             });
           }
         }
     });
    });
   }));
   
 passport.use('local-rider-login', new LocalStrategy({
         usernameField : 'email',
         passwordField : 'password',
         passReqToCallback : true 
     },
     function(req, email, password, done) { 
        var username = req.param("email");
        var password = req.param("password");
        var reqType = "riderLogin";
        var msg_payload = { "username": username, "password": password, "reqType": reqType };

        console.log("In POST Request = UserName:"+ username+" "+password);
        mqClient.makeRequest('rider',msg_payload, function(err,results){
        if(err){
          console.log(err);
          return done(err);
        }
        else 
        {
          if(results.code == 200){
            console.log("valid Loginnnnnnn");
            console.log(results);
            var userDetails = results.result[0];
            req.session.userid = userDetails.CustomerID;
            req.session.firstname = userDetails.FirstName;
            req.session.user = userDetails;
            req.session.save();
            client.hmset(req.session.userid,userDetails);
            return done(null, results);
         }
         else {    
           console.log("Invalid Login");
           if (!err) {
               return done(null, false, ''); 
           }else {
               return done(err);
           }
       }
      }  
     });
   }));
   
   
   passport.use('local-rider-signup', new LocalStrategy({
          usernameField : 'email',
          passwordField : 'password',
          passReqToCallback : true
      },
      function(req, email, password, done) {
           
        process.nextTick(function() {
        var email = req.param("email");
      	var password = req.param("password");
      	var newUser = new User();
      	var reqType = "riderLogin";
        var msg_payload = { "username": email, "password": password, "reqType": reqType };
        console.log("In POST Request = UserName:"+ email+" "+password);
        mqClient.makeRequest('rider',msg_payload, function(err,results){
          if(err){
          	console.log(err);
            return done(err);
      	}else{
      	           if(results.result != null && results.result.length > 0){
      	           return done(null, false);
      	           }else{
      	   	       var firstname = req.param("firstname");
      	           var lastname = req.param("lastname");
      	           var fullname = firstname+" "+lastname;
      	           var address = req.param("address");
      	           var city = req.param("city");
      	           var state = req.param("state");
      	           var zipCode = req.param("zipCode");
      	           var mobileNumber = req.param("mobileNumber");
      	           var creditcardNumber = req.param("creditcardNumber");
      	           var reqType = "riderSignUp";
      	           var msg_payload = { "email": email, "password": password, "firstname":firstname, "lastname":lastname, "address":address, "city":city,"state":state,"zipCode": zipCode,
      	           "mobileNumber":mobileNumber,"creditcardNumber":creditcardNumber, "reqType": reqType};
      	           mqClient.makeRequest('rider',msg_payload, function(err,results){
      	            console.log('printing results after signup call'+results);
      	            if(err){
      	             console.log(err);
      	             return done(err);
      	            }
      	            else 
      	            {
      	           if(results.code == 200){
      	           console.log("valid signup");
      	           req.session.userid = results.CustomerID;
      	           req.session.firstname = firstname;
      	           var userDetails = { "Email": email, "FirstName":firstname, "LastName":lastname, "Address":address, "City":city,"State":state,"ZipCode": zipCode,"PhoneNumber":mobileNumber};
      	           req.session.user = userDetails;
                   req.session.save();
      	           return done(null, newUser);
      	           }
      	           else {    
      	           console.log("Invalid signup");
      	           return done(null, false);
      	         }
      	   	   }  
      	   	   });
      	         }
      	   	}
      	     });
      	 });
          }));
      
   
   
   passport.use('local-admin-login', new LocalStrategy({
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback : true 
   },
   function(req, email, password, done) { 
	    var username = req.param("email");
		var password = req.param("password");
		var reqType = "adminLogin";
		var msg_payload = { "username": username, "password": password, "reqType": reqType };
			
		console.log("In POST Request = UserName:"+ username+" "+password);
		mqClient.makeRequest('admin',msg_payload, function(err,results){
			if(err){
				console.log(err);
				return done(err);
			}
			else 
			{
				if(results.code == 200){
					console.log("valid Loginnnnnnn");
					console.log('inside passprt'+results.result[0]);
					var userDetails = results.result[0];
					req.session.userid = userDetails.AdminID;
					req.session.firstname = userDetails.FirstName;
				    req.session.save();
				    client.hmset(req.session.userid,userDetails);
					return done(null, results);
				}
				else {    
					
					console.log("Invalid Login");
					if (!err) {
				    return done(null, false, ''); 
				    }else {
						return done(err);
			            console.log(err);
			        }
				}
			}  
		});
		
    }));
  

   passport.use('local-admin-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
         
        process.nextTick(function() {
        console.log(req.body);
        var email = req.param("email");
    	var password = req.param("password");
    	var newUser = new User();
    	var reqType = "adminLogin";
		var msg_payload = { "username": email, "password": password, "reqType": reqType };
		console.log("In POST Request = UserName:"+ email+" "+password);
		mqClient.makeRequest('admin',msg_payload, function(err,results){
    	if(err){
        	console.log(err);
			return done(err);
    	}else{
    		if(results.result != null && results.result.length > 0){
    			    return done(null, false);
    	    }else{
                    var firstname = req.param("firstname");
    	            var lastname = req.param("lastname");
    	            var fullname = firstname+" "+lastname;
    	            var address = req.param("address");
    	            var city = req.param("city");
    	            var state = req.param("state");
    	            var zipCode = req.param("zipCode");
    	            var mobileNumber = req.param("mobileNumber");
    	            var reqType = "adminSignup";
    	            var msg_payload = { "email": email, "password": password, "firstname":firstname, "lastname":lastname, "address":address, "city":city,"state":state,"zipCode": zipCode,
    			    "mobileNumber":mobileNumber,"reqType": reqType};
    	            mqClient.makeRequest('driver',msg_payload, function(err,results){
    		             console.log(results);
    		             if(err){
    			            console.log(err);
    			            return done(err);
    		             }
    		             else 
    		             {
    			            if(results.code == 200){
    				            console.log("valid signup");
    				            req.session.userid = results.AdminID;
    							req.session.firstname = firstname;
    						    req.session.save();
    				            return done(null, newUser);
    		              }
    			          else {    
    				           console.log("Invalid signup");
    				           return done(null, false);
    			          }
    		    		    }  
    		    	    });
    		          }
    		    	}
    		      });
    		  });
        }));


};
