var passport = require("passport");
var crypto = require('crypto');
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./mongo');
var loginDatabase = "mongodb://localhost:27017/login";
var mq_client = require('../rpc/client');
module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
         var request_payload = {email:username,password:password};
         process.nextTick(function(){
          mq_client.make_request("login_queue",request_payload,function(err,response) {
          if (err) { return done(err); }
          if(response){
            if(response.invalidUser){
              return done(null, false, { message: 'Incorrect username.' });
            }
            else if(response.invalidPassword){
              return done(null, false, { message: 'Incorrect password.' });
            }
             return done(null, response.user);
          }

             })
        });
     }));
    }

