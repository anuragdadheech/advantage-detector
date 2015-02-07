/*global $:false, chrome */
(function(){
	"use strict";
	chrome.devtools.network.onRequestFinished.addListener(
		function(request) {
			if (request.response) {
				chrome.experimental.devtools.console.addMessage(
					"URL: " + request.request.url
				);
			}
			
		});

}());

 