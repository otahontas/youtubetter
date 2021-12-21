// Open connection to the tracker
import { trackerUrl } from './config'
const socket = new WebSocket(trackerUrl)

socket.addEventListener('open', () => {
    console.log("connected to tracker")
    socket.send('ping')
})

export default socket
