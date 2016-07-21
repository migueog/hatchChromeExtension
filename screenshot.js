var port = chrome.runtime.connect({name:"screenshot"});
port.onMessage.addListener(function(message,sender){
	if (message.type == "title") {
		document.getElementById('titleText').innerHTML = message.text;
	}
	if (message.type == "url") {
		document.getElementById('website').innerHTML = message.text;
	}
	if (message.type == "canvas"){
		document.getElementById('target').src = message.text;
	}
});