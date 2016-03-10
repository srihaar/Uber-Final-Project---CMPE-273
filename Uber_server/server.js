var amqp = require('amqp')
, util = require('util')
,homeDAO = require('./service/HomeDAO');

var requestHandler = require('./service/requestHandler');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on queue");
	//queue1 	
	cnn.queue('queue1', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue1");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//queue2
	cnn.queue('queue2', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue2");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//queue3
	cnn.queue('rider', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on rider queue");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('driver', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on driver queue");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('admin', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on admin queue");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	
	cnn.queue('admin_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log("Message: "+JSON.stringify(message));
			switch(message.reqType){
			case "loginAdmin":
				homeDAO.loginAdmin(message, function(err,res){

					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				
			});
				break;		
			case "adminSearch":
				homeDAO.searchAdmin(message, function(err,res){

					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				
			});	
				break;
				
				
			case "viewCusProfile" :
			homeDAO.viewCusProfile(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			
		});	
			break;
				
			case "viewDriProfile" :
			homeDAO.viewDriProfile(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			
		});	
			break;
				
				
				
			case "deleteCustomer":
			         homeDAO.deleteCustomer(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
			         break;				
				
			case "deleteDriver":
				
			         homeDAO.deleteDriver(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
			         break;
				
			case "getAllCustomers" :
				
			         homeDAO.getAllCustomers(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
			         break;
				
			case "getAllDrivers":
				
			         homeDAO.getAllDrivers(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
			         break;
				
			case "billSearch":
				
			         homeDAO.billSearch(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
			         break;
				
			case "viewBill" :
			         homeDAO.viewBill(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });
			         break;
				
				
			case "deleteBill" :
				
			         homeDAO.deleteBill(message, function(err,res){

				//return index sent
				          cnn.publish(m.replyTo, res, {
					            contentType:'application/json',
					            contentEncoding:'utf-8',
					            correlationId:m.correlationId
				           });
			         });	
				   break;
				   
			case "getRequests" :
				
		         homeDAO.getRequests(message, function(err,res){

			//return index sent
			          cnn.publish(m.replyTo, res, {
				            contentType:'application/json',
				            contentEncoding:'utf-8',
				            correlationId:m.correlationId
			           });
		         });	
			   break;
			   
			case "approveRequest" :
				
		         homeDAO.approveRequest(message, function(err,res){

			//return index sent
			          cnn.publish(m.replyTo, res, {
				            contentType:'application/json',
				            contentEncoding:'utf-8',
				            correlationId:m.correlationId
			           });
		         });	
			   break;
			   
			case "rejectRequest" :
				
		         homeDAO.rejectRequest(message, function(err,res){

			//return index sent
			          cnn.publish(m.replyTo, res, {
				            contentType:'application/json',
				            contentEncoding:'utf-8',
				            correlationId:m.correlationId
			           });
		         });	
			   break;   
				
			case "viewPendingProfile" :
				
		         homeDAO.viewPendingProfile(message, function(err,res){

			//return index sent
			          cnn.publish(m.replyTo, res, {
				            contentType:'application/json',
				            contentEncoding:'utf-8',
				            correlationId:m.correlationId
			           });
		         });	
			   break;   
				     
				   
				   
			case "showgraph" :
				
		         homeDAO.showgraph(message, function(err,res){

			//return index sent
			          cnn.publish(m.replyTo, res, {
				            contentType:'application/json',
				            contentEncoding:'utf-8',
				            correlationId:m.correlationId
			           });
		         });	
			   break;
				
			}	
				
				
					});
	});
	
	//queue4
	cnn.queue('queue4', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue4");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});