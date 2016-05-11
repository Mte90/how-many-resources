// Send a message to the current tab's content script.
function toggleToolbar() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "toggle-in-page-toolbar");
  });
}

// Handle the browser action button.
chrome.browserAction.onClicked.addListener(toggleToolbar);

chrome.runtime.onMessage.addListener(function (data, sender) {
  if (data.direction && data.direction === "window-performance-page") {
    console.log('Sending to the iframe from the background the window.performance object');
    chrome.tabs.sendMessage(sender.tab.id, data.message);
  }
});
