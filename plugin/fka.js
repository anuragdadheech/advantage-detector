/*global $:false */
(function(){
	"use strict";
	console.log("FK Advantage plugin");
	window.fka_pageCount = 2;
	window.fka_firstLoad = true;

	$("#products").bind("DOMSubtreeModified", function() {
		//First time products loading
		if($("#products").length && $("a.fk-product-thumb").length && window.fka_firstLoad) {
			window.fka_firstLoad = false;
			var firstData = getProductSKUs($("#products"));
			updateDOMWithAdvantage(firstData);
			console.log("Flipkart Advantage plugin | First page updated");
		}


		//Taking into account dynamic loading
		if($("#page-"+window.fka_pageCount).length) {
			console.log("Flipkart Advantage plugin | Page updated | Added page "+window.fka_pageCount);
			window.fka_pageCount++;	
			var pageData = getProductSKUs($("#page-"+(window.fka_pageCount - 1)));
			updateDOMWithAdvantage(pageData);
		}

		
	});

	//functions
	function getProductSKUs(parent){
		var skuList = [];
		$("a.fk-product-thumb", $(parent)).each(function() {
			skuList.push($(this).parent().parent().attr("data-pid"));
			console.log($(this).parent().parent().attr("data-pid"));
		});
		return skuList;
	}

	function updateDOMWithAdvantage(data){
		//TODO: send data to server and get boolean key value pairs for advantage
		$.ajax({
		    url: "http://127.0.0.1:8000",
		})
		.done(function( resp ) {
			console.log( "Sample of data:--------------------------------------" + resp );
		});
		console.log(data);	
		
		//put data from server in dom
		var serverData = {
			"ACCDZRSEYPFHAT76":true,
			"ACCEFUJPZGK7PYM4":false,
			"ACCEFYRV9RRFMJGR":true,
			"ACCDKQYSSSFYSGFU":false,
			"ACCDH45YMYXGESYU":false,
			"ACCE38HCFCAMZZJJ":true,
			"ACCDTSDEEYGTSBVG":true,
			"ACCEFYRVQTKXPUFY":false,
			"ACCDFE7NE2PNQAPR":true,
			"ACCCWPEDXMGPS3CA":true
		};

		$.each( serverData, function( key, value ) {
			$( "div[data-pid="+key+"]").addClass("has-fka");	
		});
		
	}

}());

// $("a.fk-product-thumb").length

 