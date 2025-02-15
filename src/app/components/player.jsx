'use client';
import { useAudio } from 'context/audio-context';

export default function AudioPlayer() {
  const { currentFile, currentPicture } = useAudio();

  return (
    <div className='audio-player' style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
      {currentPicture && (
        <div>
          <img src={currentPicture} alt="Current Book Cover" />
        </div>
      )}
      <media-controller audio>
        <audio
          slot="media"
          src={currentFile}
          crossOrigin="true"
        />
        <media-control-bar>
          <media-seek-backward-button></media-seek-backward-button>
          <media-play-button></media-play-button>
          <media-seek-forward-button></media-seek-forward-button>
          <media-time-display></media-time-display>
          <media-time-range></media-time-range>
          <media-duration-display></media-duration-display>
          <media-mute-button></media-mute-button>
        </media-control-bar>
      </media-controller>
    </div>
  );
}
