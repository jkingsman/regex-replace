/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

var syncRules;

function init_main () {	
	//get the current enabled state and rule list
	chrome.storage.sync.get('regexStatus', function (data) {
		if(typeof data.regexStatus === "undefined"){
			//this is first use; enable by default and save
			chrome.storage.sync.set({"regexStatus": 1});
			var isEnabled = 1;
		}
		else{
			var isEnabled = parseInt(data.regexStatus);
		}
		
		//make the switch reflect our current state
		if(isEnabled){
			$('#regexStatus').bootstrapSwitch('state', true);
		}
		else{
			$('#regexStatus').bootstrapSwitch('state', false);
		}
	});
	
	//init our switch
	$('#regexStatus').bootstrapSwitch();
	
	//build the options link
	$("#regex-opt-link").attr("href", chrome.extension.getURL("html/options.html")); 
	
	//show the menu
	$('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//handle enabling or disabling or the extension
$('#regexStatus').on('switchChange.bootstrapSwitch', function(event, state) {
	if(state) {
		chrome.storage.sync.set({"regexStatus": 1});
	}
	else{
		chrome.storage.sync.set({"regexStatus": 0});
	}		
 });