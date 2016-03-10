
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash')
  , session = require('express-session')
  , cookie = require('cookie-parser')
  , mongoose = require('mongoose')
  , mongoStore = require("connect-mongo")(session)
  , configDB = require('./config/mongoconn.js')
  , busboy = require('busboy-body-parser');

mongoose.connect(configDB.url);
var redis = require('redis');
var client = redis.createClient(6379, 'localhost');
client.on('connect', function(err,result) {
    console.log('connected');
});
var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(busboy());
app.use(express.methodOverride());
app.use(express.session({
	  secret: 'uberapp',
	  resave: true,  // forces the session to store every time, even when no session data has been modified with the request 
	  saveUninitialized: true, //Forces a new session to be saved to the memory
	  duration: 30 * 60 * 1000, //how long the session will stay valid in ms    
	  activeDuration: 5 * 60 * 1000,
	  store: new mongoStore({
			url: configDB.url
		})  
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport')(passport,client);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());




 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var homeRoute = require('./routes/homeRouteConfig.js');
new homeRoute(app, passport,client);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



