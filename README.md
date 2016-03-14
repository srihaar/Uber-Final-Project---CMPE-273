# Uber-Final-Project---CMPE-273

Uber Application is done using Angular JS, Node JS, Express JS, Mongo DB, MySql,Rabbit MQ.

Single Page Angular App is done using ui-router.

The goal is to build a prototype of Uber application. 

In this project, you will design a 3-tier application that will implement the functions of Uber System for cab services. 
 
 we have different types of objects: Drivers, Customers, Billing and Admin.

A client and server to perform operations such as Rider and Customer Signup, Login to the application, Rider’s portal, 
where rider can search for the drivers nearby his location, request rides, fare estimation, view his rides history, 
view bills and rate driver. 

Application should also include Driver portal, where driver gets notification 
when a rider requests a ride on selecting him, accepts rider’s ride request, view rides history, start a ride, and 
stop a ride after completing the ride and rate rider. 

For pricing, we implemented dynamic pricing algorithm in which coast of ride changes based on many factors like time, location,
number of cars available.


Admin should view all riders(can delete riders), view all drivers(can delete drivers), view all bills, 
view statistics of rides with revenue per ride attribute, per rider, per driver, and also per location. 
 

Implemented Connection pooling and maintaining sessions. Messaging queues. 
