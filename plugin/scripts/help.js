/*global $*/ 
"use strict";
$("#help-container").click(function(){
	$(".help-data").slideToggle();
	if ($("#chevron").hasClass("icon-angle-down")) {
		$("#chevron").removeClass("icon-angle-down").addClass("icon-angle-right");
	}
	else {
		$("#chevron").removeClass("icon-angle-right").addClass("icon-angle-down");	
	}

});

$("#fka-pincode-input-container").click(function(){
	$("#fka-pincode-input").prop("disabled", false);
	$("#fka-pincode-input").focus();

});

$("#fka-pincode-input").bind("enterKey",function(){
   $("#fka-pincode-input").blur();
});

$("#fka-pincode-input").blur(function(){
	$(this).prop("disabled", true);
});