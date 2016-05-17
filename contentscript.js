var toolbarUI;

// Create the toolbar ui iframe and inject it in the current page
function initToolbar() {
  var iframe = document.createElement("iframe");
  iframe.className = 'how-many-resources-iframe';
  iframe.setAttribute("src", chrome.runtime.getURL("toolbar/ui.html"));
  iframe.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 10000; width: 100%; height: auto;");
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
    console.log("window postMessage", event);

    if (event.data == "connect-perfomance-toolbar") {
      console.log("content script received and setup messagechannel port");

      let [port] = event.ports;
      port.onmessage = function(event) {
        console.log("content script received a port message", event);
        if (event.data == "scan") {
          // send an updated data set
          port.postMessage({
            JSONPerformance: JSON.stringify(window.performance),
          });
        }
      };

      // send an initial data set
      port.postMessage({
        JSONPerformance: JSON.stringify({
          message: "click scan to send a real data set"
        })
      });

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
