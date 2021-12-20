import YouTube from 'react-youtube';
import { useEffect, useState } from 'react';
import { useInterval } from './hooks';
import socket from './websocket'

const CLIENT_ID = Math.floor(Math.random() * 100)

const YoutubeEmbed = ({ embedId }) => {
  const [player, setPlayer] = useState(null)
  const [ready, setReady] = useState(false)
  const [interval, setInterval] = useState(2000)

  socket.addEventListener('message', ({ data }) => {
    try {
      const { tc, status, clientReady, clientId } = JSON.parse(data)
      if (clientId === CLIENT_ID || !player) return // don't seek video when got own message
      console.log({tc, status, clientReady, clientId})
      switch(status) {
        case 'PAUSE': {
          player.seekTo(tc, true)
          player.pauseVideo()
          break
        }
        case 'PLAY': {
          player.seekTo(tc, true)
          player.playVideo()
          break
        }
        case 1: {
          if (tc && getTCDiff(tc) > 1)
            player.seekTo(tc, true)
          if (player.getPlayerState() !== 1)
            player.playVideo()
          break
        }
        default:
          break
      }
      if (tc && getTCDiff(tc) > 1)
        player.seekTo(tc, true)

      if (status === 1 && player.getPlayerState() !== 1)
        player.playVideo()
    } catch {
      // lul
    }
  })

  useEffect(() => {
    if (!ready && player && player.getCurrentTime() === 0) {
      player.seekTo(0, true)
      setReady(true)
    }
  }, [player, ready])

  const getTC = () => player && player.getCurrentTime()
  const getTCDiff = (tc) => tc - player.getCurrentTime()
  const sendTC = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: player ? player.getPlayerState() : -1,
      clientReady: ready,
      clientId: CLIENT_ID
    }))
  }
  const sendPause = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: 'PAUSE',
      clientId: CLIENT_ID
    }))
  }
  const sendPlay = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: 'PLAY',
      clientId: CLIENT_ID
    }))
  }

  useInterval(sendTC, interval)

  const playerOpts = {
    width: 853,
    height: 480,
    playerVars: {
      controls: 0,
      disablekb: 1
    }
  }

  return <>
    <div>
      <YouTube
        opts={playerOpts}
        videoId={embedId}
        onReady={({ target }) => setPlayer(target)}
      />
    </div>
    <div>
      Please use the buttons bellow<br/>
      <button onClick={() => {
        sendPlay()
        setInterval(2000)
        player.playVideo()}
        }>PLAY</button>
      <button onClick={() => {
        sendPause()
        setInterval(null)
        player.pauseVideo()}
      }>PAUSE</button>
    </div>
  </>
}


export default YoutubeEmbed