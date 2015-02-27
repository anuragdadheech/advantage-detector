#!/bin/env node

/* global require */
"use strict";
var request = require("request");
var cheerio = require("cheerio");
var http = require("http");
var queryString = require( "querystring" );
var url = require( "url" );

var FKAapp = function(){
    //  Scope.
    var self = this;
    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        http.globalAgent.maxSockets = 50;
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 80;
        http.globalAgent.maxSockets = 50;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn("No OPENSHIFT_NODEJS_IP var, using 127.0.0.1");
            self.ipaddress = "127.0.0.1";
        }
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log("%s: Received %s - terminating app ...",
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log("%s: Node server stopped.", Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on("exit", function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
         "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
        ].forEach(function(element) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.server = http.createServer(function (req, response) {
            console.log("request received at: "+new Date());
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.writeHead(200, {"Content-Type": "application/json"});

            var theUrl = url.parse( req.url );
            var queryObj = queryString.parse( theUrl.query );
            if(typeof queryObj.jsonData == "undefined"){
                response.write("Invalid data received");
                response.end();
                return false;
            }
            var products = JSON.parse( queryObj.jsonData );
            // console.log( JSON.stringify(products) );

            var responseData = {};
            var responseCount = 1;
            // var callUrl = sku.link;
            // console.log("++++++++++++++"+sku.pid + " time: "+new Date());
            // request({
            //     method: "GET",
            //     url: callUrl,
            //     headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36" }
            // }, (function(sku){ 
            //     return function(err, resp, body) {
            //         console.log("--------++++++++++++++-----------"+sku.pid + " time: "+new Date());

            //         if (err)
            //             throw err;
            //         var $ = cheerio.load(body);
            //         var responseData = {
            //             pid: sku.pid
            //         };
            //         if($(".express.sdd").length > 0) {
            //             responseData.ndd = true;
            //         }
            //         if($(".premium").length > 0) {
            //             responseData.sdd = true;
            //         }
            //         if($(".fk-advantage").length > 0) {
            //             responseData.advantage = true;
            //         }
            //         else{
            //             responseData.advantage = false;    
            //         }
            //         console.log(" time: "+new Date() + JSON.stringify(responseData));
            //         response.write(JSON.stringify(responseData));
            //         response.end();
                    
            //     };

            // })(sku));

            for (var product in products) {
                var callUrl = products[product].link;
                request({
                    method: "GET",
                    url: callUrl,
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36" }
                }, (function(product){ 
                    return function(err, resp, body) {
                        if (err)
                            throw err;
                        var $ = cheerio.load(body);
                        var sku = products[product].pid;
                        responseData[sku] = {};
                        if($(".express.sdd").length > 0) {
                            responseData[sku].ndd = true;
                        }
                        if($(".premium").length > 0) {
                            responseData[sku].sdd = true;
                        }
                        if($(".fk-advantage").length > 0) {
                            responseData[sku].advantage = true;
                        }
                        else{
                            responseData[sku].advantage = false;    
                        }
                        if($(".not-serviceable").length>0){
                            responseData[sku].service = false;    
                        }
                        // console.log(JSON.stringify(responseData));
                        
                        if(responseCount < Object.keys(products).length) {
                            responseCount++;
                        }else {
                            console.log("request finished at: "+new Date());
                            response.write(JSON.stringify(responseData));
                            response.end();
                        }
                        
                    };

                })(product));
            }
        });
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.server.listen(self.port, self.ipaddress, function() {
            console.log("%s: Node server started on %s:%d ...",
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };


};


/**
 *  main():  Main code.
 */
var zapp = new FKAapp();
zapp.initialize();
zapp.start();

    

    
