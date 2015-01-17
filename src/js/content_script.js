var ruleSet;

chrome.storage.sync.get(null, function (data) {
    if (typeof data.rules === 'undefined') {
	chrome.storage.sync.set({
            'rules': []
	});
	
	ruleSet = [];
    }
    else{
	ruleSet = data.rules;
    }
	
	

    if (typeof data.regexStatus === 'undefined') {
        chrome.storage.sync.set({
            'regexStatus': 1
        });
        walk(document.body);
    }
    else {
        if (parseInt(data.regexStatus)) {
            walk(document.body);
        }
    }
});

chrome.storage.sync.get('regexStatus', function (data) {
    if (typeof data.regexStatus === 'undefined') {
        chrome.storage.sync.set({
            'regexStatus': 1
        });
        chrome.storage.sync.set({
            'rules': [{
                "key": Math.floor((Math.random() * 99999) + 10000),
                "searchString": "searchString",
                "replaceString": "replaceString"
            }]
        });
        walk(document.body);
    }
    else {
        if (parseInt(data.regexStatus)) {
            walk(document.body);
        }
    }
});

function walk(node) {
    // I stole this function from here:
    // http://is.gd/mwZp7E
    var child, next;

    switch (node.nodeType) {
    case 1:
        // Element
    case 9:
        // Document
    case 11:
        // Document fragment
        child = node.firstChild;
        while (child) {
            next = child.nextSibling;
            walk(child);
            child = next;
        }
        break;

    case 3:
        // Text node
        handleText(node);
        break;
    }
}

function handleText(textNode) {
    var v = textNode.nodeValue;
    var regex;


    for (var i = 0; i < ruleSet.length; i++) {
        var rule = ruleSet[i];

        regex = new RegExp(rule.searchString, 'g');
        v = v.replace(regex, rule.replaceString);
        textNode.nodeValue = v;
    }
}