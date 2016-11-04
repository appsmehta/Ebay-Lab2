
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , login = require('./routes/login')
  , register = require('./routes/register')
  ,registerM = require('./routes/RegisterM')
  ,session = require('client-sessions')
  ,aboutM = require('./routes/about')
  ,adM = require('./routes/adM')
  ,checkout = require('./routes/checkout')
  ,processCard = require('./routes/processCard')
  ,pool = require('./routes/sql_pool');
  var logger=require('./log.js');

  //URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/login";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
  
var app = express();

// all environments
app.use(expressSession({
  secret: 'cmpe273_teststring',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  duration: 30 * 60 * 1000,    
  activeDuration: 5 * 60 * 1000,
  store: new mongoStore({
    url: mongoSessionConnectURL
  })
}));
app.set('port', process.env.PORT || 3050);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/signIn', login.signIn);
app.get('/Register', login.signIn);
app.get('/ads',adM.ad);
app.get('/about',aboutM.about);
app.get('/logout',register.logout);
app.get('/aboutProfile',aboutM.getProfile);
app.get('/getAds',adM.getAds);
app.get('/checkout',checkout.home);
app.get('/getCart',checkout.getCart);
app.get('/sell',adM.sellHome);
app.get('/getAuctions',adM.getAuctions);
app.get('/getBoughtItems',aboutM.getBoughtItems);
app.get('/getSoldItems',aboutM.getSoldItems);
app.get('/MyBidResults',aboutM.getBidResults);

app.post('/Register',registerM.signup);
app.post('/checklogin',registerM.authenticateP);
app.post('/updateAbout',aboutM.updateProfile);
app.post('/postAd',adM.postAd);
app.post('/addItem',adM.addtoCart);
app.post('/processCard',processCard.validate);
app.post('/removeItem',adM.removeFromCart);
app.post('/postAuction',adM.postAuction);
app.post('/registerBid',adM.registerBid);
app.post('/concludeAuction',adM.concludeAuction);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

/*pool.createNewPool(25);
*/

mongo.connect(mongoSessionConnectURL, function(){
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });  
});

/*const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
   
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});*/
logger.info('Hello world');