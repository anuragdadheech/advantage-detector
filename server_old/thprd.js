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
    if(typeof queryObj.jsonData == "undefined"){
        response.write("Invalid data received");
        response.end();
        return false;
    }
    var products = JSON.parse( queryObj.jsonData );
    console.log( JSON.stringify(products) );

    var responseData = {};
    var responseCount = 1;
    for (var product in products) {
        var callUrl = products[product];
        request({
            method: "GET",
            url: callUrl,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36" }
        }, (function(product){ 
            return function(err, resp, body) {
                if (err)
                    throw err;
                var $ = cheerio.load(body);
                responseData[product] = {};
                if($(".express.sdd").length > 0) {
                    responseData[product].ndd = true;
                }
                if($(".express.ndd").length > 0) {
                    responseData[product].ndd = true;
                }
                if($(".fk-advantage").length > 0) {
                    responseData[product].advantage = true;
                }
                else{
                    responseData[product].advantage = false;    
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

    
