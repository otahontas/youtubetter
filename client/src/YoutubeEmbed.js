import YouTube from 'react-youtube';
import { useEffect, useState } from 'react';
import { useInterval } from './hooks';
import socket from './websocket'

const CLIENT_ID = Math.floor(Math.random() * 100)

const YoutubeEmbed = ({ embedId }) => {
  const [player, setPlayer] = useState(null)
  const [ready, setReady] = useState(false)

  socket.addEventListener('message', ({ data }) => {
    try {
      const { tc, status, clientReady, clientId } = JSON.parse(data)
      if (clientId === CLIENT_ID) return // don't seek video when got own message
      console.log({tc, status, clientReady, clientId})
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
  const getTCDiff = (tc) => Math.abs(player.getCurrentTime() - tc)
  const sendTC = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({
      tc: getTC(),
      status: player ? player.getPlayerState() : -1,
      clientReady: ready,
      clientId: CLIENT_ID
    }))
  }

  useInterval(sendTC, 2000)

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
      <button onClick={() => player.playVideo()}>PLAY</button>
      <button onClick={() => player.pauseVideo()}>PAUSE</button>
    </div>
  </>
}


export default YoutubeEmbed