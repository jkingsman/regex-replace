/*
 ** file: js/main.js
 ** description: javascript code for "html/main.html" page
 */

var ruleSet;

$('#flags').multiselect();

function init_main() {
    //get the current enabled state and rule list
    chrome.storage.sync.get('regexStatus', function(data) {
        if (typeof data.regexStatus === 'undefined') {
            //this is first use; enable by default and save
            chrome.storage.sync.set({
                regexStatus: 1
            });
            var isEnabled = 1;
        } else {
            var isEnabled = parseInt(data.regexStatus);
        }

        //make the switch reflect our current state
        if (isEnabled) {
            $('#regexStatus').bootstrapSwitch('state', true);
        } else {
            $('#regexStatus').bootstrapSwitch('state', false);
        }
    });

    listRules();

    //init our switch
    $('#regexStatus').bootstrapSwitch();

    //show the menu
    $('html')
        .hide()
        .fadeIn('slow');
}

function htmlEncode(value) {
    return $('<div/>')
        .text(value)
        .html();
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        return arr;
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}

function listRules() {
    $('#tbody-rules').empty();
    chrome.storage.sync.get('rules', function(data) {
        if (typeof data.rules === 'undefined') {
            chrome.storage.sync.set({
                rules: []
            });
            ruleSet = [];
        } else {
            ruleSet = data.rules;
        }
        if (ruleSet.length === 0) {
            $('#tbody-rules').append('<tr><td colspan="4">No regex rules set.</td></td>');
        }
        //print out current rules
        ruleSet.forEach(function(rule, i) {
            let moveUp = '<i class="glyphicon glyphicon-stop"></i>';
            let moveDown = '<i class="glyphicon glyphicon-stop"></i>';
            if (i !== 0) {
                moveUp = `<a href="#" class="moveUp" data-index="${i}">
                    <i class="glyphicon glyphicon-arrow-up"></i></a>`;
            }
            if (i < ruleSet.length - 1) {
                moveDown = `<a href="#" class="moveDown" data-index="${i}">
                    <i class="glyphicon glyphicon-arrow-down"></i></a>`;
            }
            $('#tbody-rules').append(
                `<tr>
                    <td><code>${htmlEncode(rule.searchString)}</code></td>
                    <td><code>${htmlEncode(rule.replaceString)}</code></td>
                    <td><code>${htmlEncode(rule.flags)}</code></td>
                    <td>
                        ${moveUp}
                        ${moveDown}
                        <a href="#" class="delete-button" data-index="${i}" id="del-${rule.key}">
                            <i class="glyphicon glyphicon-trash"></i></a>
                        <a 
                            href="#" 
                            class="edit-rule" 
                            data-index="${i}" 
                            data-key="edit-${rule.key}"
                        ><i class="glyphicon glyphicon-pencil"></i></a>
                    </td>
                </tr>`
            );
        });

        //attach delete function listener
        $('.delete-button').click(function() {
            if (!confirm('Are you sure?')) {
                return;
            }

            let idx = parseInt($(this).attr('data-index'));
            ruleSet.splice(idx, 1);

            chrome.storage.sync.set({ rules: ruleSet });
            listRules();
        });

        $('.edit-rule').click(function() {
            let idx = parseInt($(this).attr('data-index'));
            let rule = ruleSet[idx];
            let $flags = $('#flags');

            $('#search').val(rule.searchString);
            $('#replace').val(rule.replaceString);
            $flags.val(rule.flags.split(''));
            $flags.multiselect('refresh');
            $('#key').val(rule.key);
            $('#form-action').val('edit');
            $('.form-new').addClass('hidden');
            $('.form-editing').removeClass('hidden');
        });

        $('#button-cancel').click(function() {
            reset();
        });

        $('.moveUp').click(function() {
            let idx = parseInt($(this).attr('data-index'));
            array_move(ruleSet, idx, idx - 1);
            chrome.storage.sync.set({ rules: ruleSet });
            listRules();
        });

        $('.moveDown').click(function() {
            let idx = parseInt($(this).attr('data-index'));
            array_move(ruleSet, idx, idx + 1);
            chrome.storage.sync.set({ rules: ruleSet });
            listRules();
        });
    });
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//handle enabling or disabling or the extension
$('#regexStatus').on('switchChange.bootstrapSwitch', function(event, state) {
    if (state) {
        chrome.storage.sync.set({
            regexStatus: 1
        });
    } else {
        chrome.storage.sync.set({
            regexStatus: 0
        });
    }
});

//handle rule addition
$('#rule-form').submit(function(e) {
    e.preventDefault();
    
    let action = $('#form-action').val();
    let key = parseInt($('#key').val());
    if (!key) {
        key = Math.floor(Math.random() * 99999 + 10000);
    }
    let rule = {
        key,
        searchString: $('#search').val(),
        replaceString: $('#replace').val(),
        flags: $('#flags')
            .val()
            .join('')
    };

    if (action === 'add') {
        ruleSet.push(rule);
    } else {
        ruleSet.forEach((r, idx) => {
            if (r.key === key) {
                ruleSet.splice(idx, 1, rule);
            }
        });
    }

    chrome.storage.sync.set({
        rules: ruleSet
    });

    listRules();
    reset();
});

function reset() {
    let $flags = $('#flags');
    $('#search').val('');
    $('#replace').val('');
    $flags.val(['g']);
    $flags.multiselect('refresh');
    $('#key').val('');
    $('#form-action').val('add');
    $('.form-new').removeClass('hidden');
    $('.form-editing').addClass('hidden');
}
