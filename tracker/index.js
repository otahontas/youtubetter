import WebSocket, { WebSocketServer } from "ws";
import queue from "queue";

// Configuration. Give env variables in either .env file or via settings environment
// variables
const DEBUG = process.env.DEBUG || false;
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });
const messageQueue = queue({ results: [] });

// Functions to help debugging
const timeOutRangeInSeconds = 10;
const randomTimeout = () =>
  Math.floor(Math.random() * timeOutRangeInSeconds * 1000);
const waitForRandomTime = () => setTimeout(async () => {}, randomTimeout());

// Log when something happens with messageQueue
messageQueue.on("success", (result) =>
  console.log(`Succesfully finished job: ${result}`)
);
messageQueue.on("end", () => console.log("No more stuff in queue"));

// Start receiving messages
messageQueue.start();

// Send message to all connected clients
const sendMessageToAll = (data, isBinary) => {
  const allClientsConnected = [...wss.clients].reduce(
    (connected, client) => connected && client.readyState === WebSocket.OPEN,
    true
  );

  // Check if clients are connected, else push the message back to the queue
  if (allClientsConnected) {
    wss.clients.forEach((client) => client.send(data, { binary: isBinary }));
  } else {
    // push message back to queue if clients are not ready
    messageQueue.push(sendMessageToAll(data));
  }
};

// Add event listeners to the connected websocket server
wss.on("connection", (ws) => {
  ws.on("message", (data, isBinary) => {
    if (DEBUG) {
      // Wait for random time to simulate a slow connection
      waitForRandomTime();
    }
    console.log("got message", data.toString());
    // Map each incoming message to a function which will send message to all clients
    // and push the function to the queue
    messageQueue.push(sendMessageToAll(data, isBinary));
  });
});
