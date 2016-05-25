var msgchan = new MessageChannel();

var port1 = msgchan.port1;
var port2 = msgchan.port2;

port1.onmessage = function (event) {
  // Check what type of object we have
  if (event.data.Timing) {
	// Get the object that we need
    var performanceData = JSON.parse(event.data.Timing);
    console.log("Iframe received a message");
    document.querySelector(".left pre.timing").innerHTML = JSON.stringify(performanceData, null, 2);
    document.querySelector(".left div.message").innerHTML = event.data.message;
  }
  if (event.data.Resources) {
	// Get the object that we need
    var resourcesData = event.data.Resources;
    console.log("Iframe received a message");
    document.querySelector(".right pre.resources").innerHTML = JSON.stringify(resourcesData, null, 2);
    document.querySelector(".right div.message").innerHTML = event.data.message;
  }
};

document.querySelector("#scan").onclick = function() {
  console.log("You clicked the scan button");
  port1.postMessage("scan");
};

// Put the iframe in listening with communication based by type
window.parent.postMessage("connect-perfomance-toolbar", "*", [port2]);
