/* global require */
"use strict";
var request = require("request");
var cheerio = require("cheerio");
var http = require("http");
var queryString = require( "querystring" );
var url = require( "url" );

var server = http.createServer(function (req, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.writeHead(200, {"Content-Type": "application/json"});
    console.log("request received");

    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var products = JSON.parse( queryObj.jsonData );
    console.log( JSON.stringify(products) );

    var responseData = {};
    var responseCount = 1;
    for (var product in products) {
        var callUrl = "http://www.flipkart.com/search?q=" + products[product];
        request(callUrl, (function(product){ 
            return function(err, resp, body) {
                if (err)
                    throw err;
                var $ = cheerio.load(body);
                responseData[products[product]] = {};
                if($(".express.sdd").length > 0) {
                    responseData[products[product]].sdd = true;
                }
                if($(".express.ndd").length > 0) {
                    responseData[products[product]].ndd = true;
                }
                if($(".fk-advantage").length > 0) {
                    responseData[products[product]].advantage = true;
                }
                else{
                    responseData[products[product]].advantage = false;    
                }
                if(responseCount < Object.keys(products).length) {
                    console.log(Object.keys(products).length + " | " + responseCount);
                    responseCount++;
                }else {
                    console.log(JSON.stringify(responseData));
                    response.write(JSON.stringify(responseData));
                    response.end();
                }
            };

        })(product));
    }
});
server.listen(8000);
console.log("Server running at http://127.0.0.1:8000/");

    
