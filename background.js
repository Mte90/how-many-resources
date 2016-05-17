// Send a message to the current tab's content script.
function toggleToolbar() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "toggle-in-page-toolbar");
  });
}

// Handle the browser action button.
chrome.browserAction.onClicked.addListener(toggleToolbar);
