import YouTube from 'react-youtube';
import { useEffect, useState } from 'react';
import { useInterval } from './hooks';
import socket from './websocket'

// Generate id for client
const CLIENT_ID = Math.floor(Math.random() * 100)

const YoutubeEmbed = ({ embedId }) => {
  const [player, setPlayer] = useState(null)
  // Is client ready, that is the player is initialized and buffered
  const [ready, setReady] = useState(false)
  const [interval, setInterval] = useState(2000)

  // Listen for messages from the tracker
  socket.addEventListener('message', ({ data }) => {
    try {
      const { tc, status, clientReady, clientId } = JSON.parse(data)
      if (clientId === CLIENT_ID || !player) return // don't seek video when got own message
      console.log({ tc, status, clientReady, clientId })
      switch (status) {
        // In case of pause command pause the player and seek to given time
        case 'PAUSE': {
          player.seekTo(tc, true)
          player.pauseVideo()
          break
        }
        // In case of play command play the player and seek to given time
        case 'PLAY': {
          player.seekTo(tc, true)
          player.playVideo()
          break
        }
        // Normal periodic message
        // If the time is greater that 1s from local player, seek the local
        // player to time form the message. If the local player is paused play the video
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

  // When player is initialized buffer it to zero and wait for commands
  useEffect(() => {
    if (!ready && player && player.getCurrentTime() === 0) {
      player.seekTo(0, true)
      setReady(true)
    }
  }, [player, ready])

  // Get local player time
  const getTC = () => player && player.getCurrentTime()

  // Get diff to local player from given time
  const getTCDiff = (tc) => tc - player.getCurrentTime()

  // Send current time of local player
  const sendTC = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: player ? player.getPlayerState() : -1,
      clientReady: ready,
      clientId: CLIENT_ID
    }))
  }
  // Send pause command
  const sendPause = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: 'PAUSE',
      clientId: CLIENT_ID
    }))
  }
  // Send play command
  const sendPlay = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: 'PLAY',
      clientId: CLIENT_ID
    }))
  }

  // Send periodically current time and status of player
  useInterval(sendTC, interval)

  // Youtube embed options
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
        // Save player to local variable
        onReady={({ target }) => setPlayer(target)}
      />
    </div>
    <div>
      Please use the buttons bellow<br />
      <button onClick={() => {
        sendPlay()
        setInterval(2000)
        player.playVideo()
      }
      }>PLAY</button>
      <button onClick={() => {
        sendPause()
        setInterval(null)
        player.pauseVideo()
      }
      }>PAUSE</button>
    </div>
  </>
}


export default YoutubeEmbed