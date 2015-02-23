"use strict";
/*global chrome*/ 
// Saves options to chrome.storage
var state, pin;
function save_options() {

	state = document.getElementById("state").checked;
	pin = document.getElementById("fka-pincode-input").value;
	chrome.storage.sync.set({
		state: state,
		picode: pin
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById("button-state");
		if (state === true) {
			status.textContent = "Enabled";
		}
		else if (state === false) {
			status.textContent = "Disabled";
		}
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = "red" and likesColor = true.
	chrome.storage.sync.get({
	state: true,
	pincode: "560034"
	}, function(items) {
		document.getElementById("state").checked = items.state;
		var status = document.getElementById("button-state");
		if (items.state === true) {
			status.textContent = "Enabled";
		}
		else if (items.state === false) {
			status.textContent = "Disabled";
		}
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
var switchButton = document.getElementsByClassName("switch")[0];
var pincodeInput = document.getElementById("fka-pincode-input");
switchButton.addEventListener("click",
    save_options);
pincodeInput.addEventListener("change",
    save_options);