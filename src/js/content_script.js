var rules = {
	"[a-z]" : "chocolate? ",
    "[A-Z]" : "CHOCOLATE!!!!!! "
};

chrome.storage.sync.get('regexStatus', function (data) {
	if(typeof data.regexStatus === "undefined"){
		chrome.storage.sync.set({"regexStatus": 1});
		walk(document.body);
	}
	else{
		if(parseInt(data.regexStatus)){
			walk(document.body);
		}
	}
});

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	var v = textNode.nodeValue;
	var regex;
	
	for (var searchString in rules) {
		if (rules.hasOwnProperty(searchString)) {
			regex = new RegExp(searchString, "g");
			v = v.replace(regex, rules[searchString]);
			textNode.nodeValue = v;
		}
	}
}

