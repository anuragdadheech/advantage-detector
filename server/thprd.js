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
    var obj = JSON.parse( queryObj.jsonData );
    console.log( JSON.stringify(obj) );




    var pools = {
        "Aloha": 3,
        "Beaverton": 15,
        "Conestoga": 12,
        "Harman": 11,
        "Raleigh": 6,
        "Somerset": 22,
        "Sunset": 5,
        "Tualatin Hills": 2
    };
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var responseData = {};
    var responseCount = 1;
    for (var pool in pools) {
        var callUrl = "http://www.thprd.org/schedules/schedule.cfm?cs_id=" + pools[pool];
        request(callUrl, (function(pool){ 
            return function(err, resp, body) {
                if (err)
                    throw err;
                var $ = cheerio.load(body);
                $("#calendar .days td").each(function(day) {
                    $(this).find("div").each(function() {
                        responseData[pool] = pool + "," + days[day] + "," + $(this).text().trim().replace(/\s\s+/g, ",");
                    });
                });
                if(responseCount < Object.keys(pools).length) {
                    console.log(Object.keys(pools).length + " | " + responseCount);
                    responseCount++;
                }else {
                    console.log(JSON.stringify(responseData));
                    response.write(JSON.stringify(responseData));
                    response.end();
                }
            };

        })(pool));
    }
});
server.listen(8000);
console.log("Server running at http://127.0.0.1:8000/");

    
