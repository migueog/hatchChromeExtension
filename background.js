var id = 100;

chrome.browserAction.onClicked.addListener( function() {
	
chrome.tabs.executeScript(
    { 
      code: " document.getElementsByClassName('project')[0].getElementsByTagName('h2')[0].innerHTML;"
    }, 
    function (ps1) {
		  chrome.runtime.onConnect.addListener(function(port){
			port.postMessage({text: ps1, type : "title"});
		});
    }
  );
});

chrome.browserAction.onClicked.addListener( function() {
  chrome.tabs.executeScript(
    { 
      code: "document.URL"
    }, 
    function (ps2) {
		  chrome.runtime.onConnect.addListener(function(port){
			port.postMessage({text:ps2, type:"url"});
		});
    }
  );
});

chrome.browserAction.onClicked.addListener( function() {
  chrome.tabs.executeScript(
    { 
      code: " document.getElementsByClassName('project')[0].getElementsByTagName('canvas')[0].toDataURL();"
    }, 
    function (ps3) {
      chrome.runtime.onConnect.addListener(function(port){
      port.postMessage({text:ps3, type:"canvas"});
    });
    }
  );
});

/*Did not write this code */
chrome.browserAction.onClicked.addListener(function() {
	
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    var viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
    var targetId = null;

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      // We are waiting for the tab we opened to finish loading.
      // Check that the tab's id matches the tab we opened,
      // and that the tab is done loading.
      if (tabId != targetId || changedProps.status != "complete")
        return;

      // Passing the above test means this is the event we were waiting for.
      // There is nothing we need to do for future onUpdated events, so we
      // use removeListner to stop getting called when onUpdated events fire.
      chrome.tabs.onUpdated.removeListener(listener);

      // Look through all views to find the window which will display
      // the screenshot.  The url of the tab which will display the
      // screenshot includes a query parameter with a unique id, which
      // ensures that exactly one view will have the matching URL.
      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view.location.href == viewTabUrl) {
			     view.setScreenshotUrl(screenshotUrl);
          break;
        }
      }
    });

    chrome.tabs.create({url: viewTabUrl}, function(tab) {
      targetId = tab.id;
    });
  });
});