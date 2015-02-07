/*global $:false, chrome */
(function(){
	"use strict";
	console.log("FK Advantage plugin");
	window.fka_pageCount = 2;
	window.fka_firstLoad = true;
	// chrome.devtools.network.onRequestFinished.addListener(
	// 	function(request) {
	// 		alert("works");
	// 		console.log("FK Advantage plugin");
	// 		if (request.response) {
	// 			chrome.experimental.devtools.console.addMessage(
	// 				"Fk advantage | URL: " + request.request.url
	// 			);
	// 		}
			
	// 	});
	$("#products").bind("DOMSubtreeModified", function() {
		//First time products loading
		if($("#products").length && $("a.fk-product-thumb").length && window.fka_firstLoad) {
			window.fka_firstLoad = false;
			console.log("Flipkart Advantage plugin | First page updated");
		}


		//Taking into account dynamic loading
		if($("#page-"+window.fka_pageCount).length) {
			console.log("Flipkart Advantage plugin | Page updated | Added page "+window.fka_pageCount);
			window.fka_pageCount++;	
		}

		
	});

}());

// $("a.fk-product-thumb").length

 