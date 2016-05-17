var msgchan = new MessageChannel();

var port1 = msgchan.port1;
var port2 = msgchan.port2;

port1.onmessage = function (event) {
  if (event.data.JSONPerformance) {
    var performanceData = JSON.parse(event.data.JSONPerformance);
    console.log("Iframe received a message");
    document.querySelector("pre").innerHTML = JSON.stringify(performanceData, null, 2);
  }
};

document.querySelector("#scan").onclick = function() {
  console.log("You clicked the scan button");
  port1.postMessage("scan");
};

window.parent.postMessage("connect-perfomance-toolbar", "*", [port2]);
