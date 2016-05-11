// Handle click events on the toolbar button.
document.querySelector("#scan").addEventListener("click", function () {
  console.log('Asking to the page from iframe for the window.performance object');
  window.parent.postMessage({
    direction: "window-performance-iframe",
    message: "Asking for performance"
  }, '*');
  console.log(window.test)
});


window.addEventListener("message", function (event) {
  console.log(event)
  if (event.data.direction && event.data.direction === "window-performance-page") {
    console.log(event.data.message)

//  var resources = window.parent.performance.getEntriesByType("resource");
//  resources.forEach(function (resource) {
//    console.log(resource.name);
//  });
  }
});

chrome.runtime.onMessage.addListener(function (msg) {
  console.log(msg)
});