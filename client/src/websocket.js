const socket = new WebSocket('ws://localhost:8080')

socket.addEventListener('open', () => {
    console.log("connected to tracker")
    socket.send('ping')
})

socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data)
})

export default socket
