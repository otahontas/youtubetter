// Open connection to the tracker
const socket = new WebSocket('ws://localhost:8080')

socket.addEventListener('open', () => {
    console.log("connected to tracker")
    socket.send('ping')
})

export default socket
