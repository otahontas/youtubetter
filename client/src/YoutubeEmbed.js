import YouTube from 'react-youtube';
import { useState } from 'react';
import { useInterval } from './hooks';
import ws from './websocket'

const YoutubeEmbed = ({ embedId }) => {
  const [player, setPlayer] = useState(null)

  const getTC = () => player && player.getCurrentTime()
  const sendTC = () => ws.readyState === WebSocket.OPEN ? ws.send(getTC()) : null

  useInterval(sendTC, 1000)

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