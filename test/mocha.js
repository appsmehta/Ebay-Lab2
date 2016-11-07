/**
 * New node file
 */
var expect  = require("chai").expect;
var request = require("request");


describe("Homepage Check", function() {

    var url = "http://localhost:3050/";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

});


describe("Ads Check", function() {

    var url = "http://localhost:3050/ads";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

});


describe("About Page Check", function() {

    var url = "http://localhost:3050/about";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });


});

describe("Auctions Check", function() {

    var url = "http://localhost:3050/getAds";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

});


describe("Get Bought Items Check", function() {

    var url = "http://localhost:3050/getBoughtItems";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

});