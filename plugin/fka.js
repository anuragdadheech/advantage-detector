/*global chrome, $:false */
(function(){
	"use strict";//do something
	console.log("FK Advantage plugin");
	window.fka_pageCount = 2;
	window.fka_firstLoad = true;
	window.fka_numberOfProducts = parseInt($("#searchCount .items").html());
	// window.fka_server_url = "http://127.0.0.1:8080";
	window.fka_server_url = "http://fkfirst-nlmm01.rhcloud.com";

	chrome.storage.sync.get({
	state: true,
	pincode: "560034"
	}, function(items) {
		if(items.state === true) {
			console.log("FKA ADVANTAGE | Pincode | "+items.pincode);	
			setUpAdvantageDetector(items.pincode);
			$("#browse").bind("DOMNodeInserted", function() {
				//Taking into account filters
				var productCount = parseInt($("#searchCount .items").html());
				if(productCount != window.fka_numberOfProducts){
					setUpAdvantageDetector(items.pincode);
					console.log("FKA BROWSE SUBTREE MODIFIED" + new Date());
					window.fka_numberOfProducts = productCount;
				}
			});
        }
	});

	function setUpAdvantageDetector(pincode){
		//First page load
		window.fka_firstLoad = false;
		var firstData = getProductSKUs($("#products"), pincode);
		updateDOMWithAdvantage(firstData);
		console.log("Flipkart Advantage plugin | First page updated");
		window.fka_filters = $(".filter-group").length;

		$("#products").bind("DOMSubtreeModified", function() {
			//Taking into account dynamic loading
			if($("#page-"+window.fka_pageCount).length) {
				console.log("Flipkart Advantage plugin | Page updated | Added page "+window.fka_pageCount);
				window.fka_pageCount++;	
				var pageData = getProductSKUs($("#page-"+(window.fka_pageCount - 1)), pincode);
				updateDOMWithAdvantage(pageData);
			}		
		});

		//sorting
		$("select#sort-dropdown").change(function(){
			$("#searchCount .items").html("5");
		});
		$("div#sort-dropdown").click(function(){
			$("#searchCount .items").html("5");
		});

	}
		
	//functions
	function getProductSKUs(parent, pincode){
		var skuList = [];	

		$("a.fk-product-thumb", $(parent)).each(function() {

			var link = $(this).attr("href");
			//TODO: add code here
			var sku = {
				pid: $(this).parent().parent().attr("data-pid"),
				link: "http://www.flipkart.com" + $(this).attr("href")+"&pincode="+pincode
			};
			skuList.push(sku);
		});
		return skuList;
	}

	function updateDOMWithAdvantage(data){
		//send data to server and get boolean key value pairs for advantage
		console.log("Going data---------------"+JSON.stringify(data));	
		$.ajax({
			type: "GET",
		    url: window.fka_server_url,
		    dataType: "json",
		    data: {
		    	jsonData: JSON.stringify(data)
		    }
		})
		.done(function( resp ) {
			console.log( "returning data+++++++++++++++++" + JSON.stringify(resp) );
			$.each( resp, function( key, value ) {
				var elm = $( "div[data-pid="+key+"]");
				if(!value.service){
					elm.addClass("no-service");
				}
				else{
					if(value.advantage){
						elm.addClass("has-fka");
					}
					if(value.ndd){
						elm.addClass("has-ndd");
					}
					if(value.sdd){
						elm.addClass("has-sdd");
					}
				}
					
					
			});
				
		});

			
		
	}


}());

// $("a.fk-product-thumb").length

 