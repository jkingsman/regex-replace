/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/


function init_main () {	
	chrome.storage.sync.get('regexStatus', function (data) {
		if(typeof data.regexStatus === "undefined"){
			chrome.storage.sync.set({"regexStatus": 1});
			var isEnabled = 1;
		}
		else{
			var isEnabled = parseInt(data.regexStatus);
		}
		
		if(isEnabled){
			$('#regexStatus').bootstrapSwitch('state', true);
		}
		else{
			$('#regexStatus').bootstrapSwitch('state', false);
		}
    });

	$('#regexStatus').bootstrapSwitch();
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

$('#regexStatus').on('switchChange.bootstrapSwitch', function(event, state) {
	if(state) {
		console.log("setting enabled");
		chrome.storage.sync.set({"regexStatus": 1});
	}
	else{
		console.log("setting diabled");
		chrome.storage.sync.set({"regexStatus": 0});
	}		
 });
