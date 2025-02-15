'use client';
import { useAudio } from 'context/audio-context';

export default function AudioPlayer() {
  const { file, picture } = useAudio();

  return (
    <div className='audio-player' style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
      {picture && (
        <img
          src={picture}
          alt="Cover"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', marginBottom: '10px' }}
        />
      )}

      <media-controller audio>
        <audio
          slot="media"
          src={file}
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
