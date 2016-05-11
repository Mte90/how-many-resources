var toolbarUI;

// Create the toolbar ui iframe and inject it in the current page
function initToolbar() {
  var iframe = document.createElement("iframe");
  iframe.className = 'how-many-resources-iframe';
  iframe.setAttribute("src", chrome.runtime.getURL("toolbar/ui.html"));
  iframe.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 10000; width: 100%; height: auto;");
  document.body.appendChild(iframe);
  console.log('Iframe injected in the page');
  iframe.contentWindow['test'] = window.performance;

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
  chrome.runtime.onMessage.addListener(function (msg) {
    console.log(msg)
    if (msg === "toggle-in-page-toolbar") {
      if (toolbarUI) {
        toggleToolbar(toolbarUI);
      } else {
        toolbarUI = initToolbar();
      }
    }
  });
}

window.addEventListener("message", function (event) {
  if (event.data.direction && event.data.direction === "window-performance-iframe") {
    console.log('Sending to the background js from the page the window.performance object');
    chrome.runtime.sendMessage({
      direction: "window-performance-page",
      message: window.performance
    });
    
  }
});