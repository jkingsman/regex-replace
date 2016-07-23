/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

var ruleSet;

function init_main() {
    //get the current enabled state and rule list
    chrome.storage.sync.get('regexStatus', function (data) {
        if (typeof data.regexStatus === "undefined") {
            //this is first use; enable by default and save
            chrome.storage.sync.set({
                "regexStatus": 1
            });
            var isEnabled = 1;
        }
        else {
            var isEnabled = parseInt(data.regexStatus);
        }

        //make the switch reflect our current state
        if (isEnabled) {
            $('#regexStatus').bootstrapSwitch('state', true);
        }
        else {
            $('#regexStatus').bootstrapSwitch('state', false);
        }
    });

    listRules();

    //init our switch
    $('#regexStatus').bootstrapSwitch();

    //show the menu
    $('html').hide().fadeIn('slow');
}

function htmlEncode(value){
    return $('<div/>').text(value).html();
}

function listRules() {
    $("#rules").empty();
    chrome.storage.sync.get('rules', function (data) {
        if (typeof data.rules === 'undefined') {
            chrome.storage.sync.set({
                'rules': []
            });
            
            ruleSet = [];
        }
        else{
            ruleSet = data.rules;
        }

        //print out current rules
        for (var i = 0; i < ruleSet.length; i++) {
            var rule = ruleSet[i];
            $("#rules").append('<li>' + htmlEncode(rule.searchString) + ' --> ' + htmlEncode(rule.replaceString) + ' <a href="#" class="deleteButton" id="del-' + rule.key + '"><i class="glyphicon glyphicon-trash"></i></a></li>');
        }

        //attach delete function listener
        $('.deleteButton').click(function () {
            for (var i = 0; i < ruleSet.length; i++) {
                //this is somewhat unnecessary; we could just go by array key but it keeps us resilient if they have two tabs open
                var rule = ruleSet[i];
                if ($(this).attr('id').replace(/\D/g,'') == rule.key) {
                    ruleSet.splice(i, 1);
                    chrome.storage.sync.set({"rules": ruleSet});
                    $(this).parent().remove();
                }
            }

            chrome.storage.sync.set({
                "rules": ruleSet
            });
            listRules();
        });
    });
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//handle enabling or disabling or the extension
$('#regexStatus').on('switchChange.bootstrapSwitch', function (event, state) {
    if (state) {
        chrome.storage.sync.set({
            "regexStatus": 1
        });
    }
    else {
        chrome.storage.sync.set({
            "regexStatus": 0
        });
    }
});

//handle rule addition
$("#addRule").submit(function (e) {
    e.preventDefault();

    ruleSet.push({
        "key": Math.floor((Math.random() * 99999) + 10000),
        "searchString": $("#search").val(),
        "replaceString": $("#replace").val()
    });
    chrome.storage.sync.set({
        'rules': ruleSet
    });

    listRules();
    $("#search").val("");
    $("#replace").val("");
});