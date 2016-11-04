/**

 */
var passport = require("passport");
var crypto = require('crypto');
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./mongo');
var loginDatabase = "mongodb://localhost:27017/login";
var mq_client = require('../rpc/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {

        //Calling RabbitMQ login queue

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

     /*   User.findOne({ emailId: username }, function(err, user) {
          if (err) { return done(err); }
          if (!user) {
            console.log("inside function");
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(user.password,password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });*/

    });
     }));
    }
/*
         ==========================================

         console.log("Before Mongo Connection");

        mongo.connect(loginDatabase, function(connection) {
            var salt = "theSECRETString";
            password = crypto.createHash('sha512').update(password + salt).digest("hex");
            console.log("before mongo call,the password is :"+password);
            var loginCollection = mongo.collection('users', connection);
            var whereParams = {
                email:username,
                password:password
            }

            process.nextTick(function(){
                console.log("passport got:"+username);
                loginCollection.findOne(whereParams, function(error, user) {

                    if(error) {
                        return done(err);
                    }

                    if(!user) {
                        return done(null, false);
                    }

                    if(user.password != password) {
                        done(null, false);
                    }

                    connection.close();
                    console.log(user.email);
                    done(null, user);
                });
            });
        });
    }));
}
*/

