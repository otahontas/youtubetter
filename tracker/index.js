import WebSocket, { WebSocketServer } from "ws";
import queue from "queue";

const wss = new WebSocketServer({ port: 8080 });
const q = queue({ results: [] });
// Log when stuff happens in queue
q.on("success", (result) => console.log(`Succesfully finished job: ${result}`));
q.on("end", () => console.log("No more stuff in queue"));

q.start();

const sendMessageToAll = (data, isBinary) => {
  // wss clients is Set() so destructuring
  const clientsConnected = [...wss.clients].reduce(
    (connected, client) => connected && client.readyState === WebSocket.OPEN,
    true
  );
  if (clientsConnected) {
    wss.clients.forEach((client) => client.send(data, { binary: isBinary }));
  } else {
    // push message back to queue if clients are not ready
    // maybe wait here?
    q.push(sendMessageToAll(data));
  }
};

// Add received messages to queue
wss.on("connection", (ws) => {
  ws.on("message", (data, isBinary) => {
    q.push(sendMessageToAll(data, isBinary));
  });
});
