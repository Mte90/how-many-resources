var toolbarUI;

// Create the toolbar ui iframe and inject it in the current page
function initToolbar() {
  var iframe = document.createElement("iframe");
  iframe.className = 'how-many-resources-iframe';
  iframe.setAttribute("src", chrome.runtime.getURL("toolbar/ui.html"));
  iframe.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 10000; width: 100%; height: 400px;");
  document.body.appendChild(iframe);
  console.log('Iframe injected in the page');

  return toolbarUI = {
	iframe: iframe, visible: true
  };
}

function toggleToolbar(toolbarUI) {
  if (toolbarUI.visible) {
	toolbarUI.visible = false;
	toolbarUI.iframe.style["display"] = "none";
  } else {
	toolbarUI.visible = true;
	toolbarUI.iframe.style["display"] = "block";
  }
}

// Handle messages from the add-on background page (only in top level iframes)
if (window.parent === window) {
  window.addEventListener("message", function (event) {
	console.log('Listening from the contentscript for messages');
	// What type of request?
	if (event.data === "connect-perfomance-toolbar") {
	  console.log("Content script received and setup a messagechannel");
	  // Get the reference of the communication
	  var port = event.ports[0];
	  port.onmessage = function (event) {
		console.log("Content script received a message", event.data);
		// What message?
		if (event.data === "scan") {
		  var timinginfo = window.performance.timing.toJSON();
		  // Loop all the element of the object
		  for (var element in timinginfo) {
			// Skip loop if the property is from prototype
			if (!timinginfo.hasOwnProperty(element))
			  continue;
			timinginfo[element] = unixToHuman(timinginfo[element]);
		  }
		  // Send the request
		  port.postMessage({
			Timing: JSON.stringify(timinginfo),
			message: '<a href="https://www.w3.org/TR/navigation-timing/#processing-model">https://www.w3.org/TR/navigation-timing/#processing-model</a>'
		  });
		  console.log(window.performance.getEntries())
		  var resources = window.performance.getEntries();
                  var resourcesname = [];
		  for (var i = 0; i < resources.length; i++) {
                        resourcesname.push(resources[i].name);
		  }
		  // Send the request
		  port.postMessage({
			Resources: resourcesname,
			message: 'How many resources!'
		  });
		}
		// Add here your new request!
	  };
	} else {
	  console.error("Unrecognized postMessage", event.data);
	}
  });

  chrome.runtime.onMessage.addListener(function (msg) {
	if (msg === "toggle-in-page-toolbar") {
	  if (toolbarUI) {
		toggleToolbar(toolbarUI);
	  } else {
		toolbarUI = initToolbar();
	  }
	}
  });
}

function unixToHuman(time) {
  if (time > 0) {
	var newDate = new Date(time);
	time = newDate.getDate() + '/' + newDate.getMonth() + '/' + newDate.getHours() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getMilliseconds();
  }
  return time;
}
