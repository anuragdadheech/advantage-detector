/*global $:false */
(function(){
	"use strict";
	console.log("FK Advantage plugin");
	window.fka_pageCount = 2;
	window.fka_firstLoad = true;
	window.fka_pincode = "560034";
	window.fka_server_url = "http://127.0.0.1:8080";
	// window.fka_server_url = "http://fkfirst-nlmm01.rhcloud.com";
	var fka_affiliate_id = "anuragdad";

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
		var skuList = {};
		$("a.fk-product-thumb", $(parent)).each(function() {
			var link = $(this).attr("href");
			generate_affiliate_links(this, link);
			skuList[$(this).parent().parent().attr("data-pid")]="http://www.flipkart.com" + $(this).attr("href")+"&pincode="+window.fka_pincode;
			console.log($(this).parent().parent().attr("data-pid"));
		});
		return skuList;
	}

	function updateDOMWithAdvantage(data){
		//TODO: send data to server and get boolean key value pairs for advantage
		console.log(data);	
		$.ajax({
			type: "GET",
		    url: window.fka_server_url,
		    dataType: "json",
		    data: {
		    	jsonData: JSON.stringify(data)
		    }
		})
		.done(function( resp ) {
			console.log( "Sample of data:--------------------------------------" + resp );
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

 