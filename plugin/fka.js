/*global chrome, $:false */
(function(){
	"use strict";//do something
	console.log("FK Advantage plugin");
	window.fka_pageCount = 2;
	window.fka_firstLoad = true;
	window.fka_pincode = "560034";
	// window.fka_server_url = "http://127.0.0.1:8080";
	window.fka_server_url = "http://fkfirst-nlmm01.rhcloud.com";
	var fka_affiliate_id = "anuragdad";

	chrome.storage.sync.get({
	state: true
	}, function(items) {
		if(items.state === true) {
			setUpAdvantageDetector();
        }
	});

	function setUpAdvantageDetector(){
		//First page load
		window.fka_firstLoad = false;
		var firstData = getProductSKUs($("#products"));
		updateDOMWithAdvantage(firstData);
		console.log("Flipkart Advantage plugin | First page updated");
		window.fka_filters = $(".filter-group").length;

		// $("#browse").bind("DOMSubtreeModified", function() {
		// 	//Taking into account filters
		// 	console.log("Filter initial: "+window.fka_filters+" Filter final: "+$("#selectedFilters").length);
		// 	if($(".filter-group").length && ($(".filter-group").length != window.fka_filters)) {
		// 		window.fka_filters = $(".filter-group").length;
		// 		console.log("Flipkart Advantage plugin | Filters Updated | ");
		// 		getProductSKUs($("#products"));
		// 	}
		// });


		$("#products").bind("DOMSubtreeModified", function() {
			//Taking into account dynamic loading
			if($("#page-"+window.fka_pageCount).length) {
				console.log("Flipkart Advantage plugin | Page updated | Added page "+window.fka_pageCount);
				window.fka_pageCount++;	
				var pageData = getProductSKUs($("#page-"+(window.fka_pageCount - 1)));
				updateDOMWithAdvantage(pageData);
			}		
		});

	}
		
	//functions
	function getProductSKUs(parent){
		var skuList = [];		
		$("a.fk-product-thumb", $(parent)).each(function() {

			var link = $(this).attr("href");
			generate_affiliate_links(this, link);
			var sku = {
				pid: $(this).parent().parent().attr("data-pid"),
				link: "http://www.flipkart.com" + $(this).attr("href")+"&pincode="+window.fka_pincode
			};
			skuList.push(sku);
			// console.log($(this).parent().parent().attr("data-pid"));
			// updateDOMWithAdvantage(sku);
		});
		return skuList;
	}

	function updateDOMWithAdvantage(data){
		// var count=0;
		//TODO: send data to server and get boolean key value pairs for advantage
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
			// var elm = $( "div[data-pid="+resp.pid+"]");
			// if(resp.advantage){
			// 	elm.addClass("has-fka");
			// }
			// if(resp.ndd){
			// 	elm.addClass("has-ndd");
			// }
			// if(resp.sdd){
			// 	elm.addClass("has-sdd");
			// }
			// count++;
			// if(count==19){
			// 	$("#products").show();
			// }
			$.each( resp, function( key, value ) {
				var elm = $( "div[data-pid="+key+"]");
				if(value.advantage){
					elm.addClass("has-fka");
				}
				if(value.ndd){
					elm.addClass("has-ndd");
				}
				if(value.sdd){
					elm.addClass("has-sdd");
				}
					
			});
				
		});

			
		
	}

	function generate_affiliate_links(elm, link){
		$(elm).attr("href", link+"&affid="+fka_affiliate_id);
		$(".fk-display-block", $(elm).parent().parent()).attr("href", link+"&affid="+fka_affiliate_id);
	}

}());

// $("a.fk-product-thumb").length

 