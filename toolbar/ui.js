let {port1, port2} = new MessageChannel();

port1.onmessage = (event) => {
  if (event.data.JSONPerformance) {
    let performanceData = JSON.parse(event.data.JSONPerformance);
    console.log("iframe received a port message", performanceData);
    document.querySelector("pre").innerHTML = JSON.stringify(performanceData, null, 2);
  }
};

document.querySelector("#scan").onclick = () => {
  console.log("CLICKED scan");
  port1.postMessage("scan");
};

window.parent.postMessage("connect-perfomance-toolbar", "*", [port2]);
