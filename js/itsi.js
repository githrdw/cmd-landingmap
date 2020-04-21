const $socket = new WebSocket("wss://school.hrdw.nl/itsi/websocket");

$socket.onopen = function (e) {
  console.log("[open] Connection established");
};

$socket.onmessage = function (event) {
  if (event.data) {
    //  Parse speed and fuel from socket data
    let data = JSON.parse(event.data)
    updateChat(data.messages)
  }
};

$socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
    alert('ITSI datasource not reachable');
  }
};

$socket.onerror = function () {
  alert('ITSI datasource not reachable');
};

function updateChat(messages) {
  const chat = document.querySelector("#ct-chat table")
  const oldBody = chat.lastElementChild
  const newBody = document.createElement("tbody")
  for (let i = 0; i < messages.length; i++) {
    const row = document.createElement("tr")
    const cell = document.createElement("td")
    cell.innerHTML = messages[i]
    row.appendChild(cell)
    newBody.appendChild(row)
  }
  chat.replaceChild(newBody, oldBody)
}
document.getElementById("chat-msg").addEventListener("keypress", e => { if (e.charCode === 13) { $socket.send(e.target.value); e.target.value = "" } })