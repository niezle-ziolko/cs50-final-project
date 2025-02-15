'use client';
import { useAudio } from 'context/audio-context';

import 'styles/css/components/player.css';

export default function AudioPlayer() {
  const { currentFile, currentPicture } = useAudio();

  return (
    <div className='player'>
      {currentPicture && (
        <div>
          <img src={currentPicture} alt='Current Book Cover' />
        </div>
      )}
      <media-controller audio>
        <audio
          slot='media'
          src={currentFile}
          crossOrigin='true'
        />
        <media-control-bar>
          <div className='box'>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
          </div>
          <div className='box'>
            <media-seek-backward-button>
              <i slot='icon' className='fa-solid fa-arrow-rotate-left'></i>
            </media-seek-backward-button>
            <media-play-button>
              <i slot='play' className='fa-solid fa-play'></i>
              <i slot='pause' className='fa-solid fa-pause'></i>
            </media-play-button>
            <media-seek-forward-button>
              <i slot='icon' className='fa-solid fa-arrow-rotate-right'></i>
            </media-seek-forward-button>
            <media-mute-button>
              <i slot='high' className='fa-solid fa-volume-high'></i>
              <i slot='off' className='fa-solid fa-volume-xmark'></i>
            </media-mute-button>
          </div>
        </media-control-bar>
      </media-controller>
    </div>
  );
};