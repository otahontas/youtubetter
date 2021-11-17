import YoutubeEmbed from "./YoutubeEmbed"
import ws from './websocket'

const App = () => {
  if (ws.readyState === WebSocket.OPEN)
    ws.send("Boii")
  return <YoutubeEmbed embedId="rokGy0huYEA" />
}

export default App
