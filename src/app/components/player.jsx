'use client';
import Link from 'next/link';
import { useAudio } from 'context/audio-context';

import Placeholder from './placeholder';
import LikeButton from './buttons/like-button';

import 'styles/css/components/player.css';

export default function AudioPlayer() {
  const { bookId, bookFile, bookPicture, bookTitle } = useAudio();

  return (
    <div className='player'>
      <div className='container'>
        <p className='heading'>Currently book playing</p>
        <div className='image'>
          {bookPicture ? (
            <img src={bookPicture} alt='bookly book cover' />
          ) : (
            <div className='placeholder'>
              <Placeholder />
            </div>
          )}
        </div>
        <Link href={`/auth/library/${bookId}`} className='title'>{bookTitle}</Link>
        <media-controller audio>
          <audio slot='media' src={bookFile} crossOrigin='true' />
          <media-control-bar>
            <div className='box'>
              <media-time-display />
              <media-time-range />
              <media-duration-display />
            </div>
            <div className='box'>
              <LikeButton />
              <media-seek-backward-button>
                <i slot='icon' className='fa-solid fa-arrow-rotate-left' />
              </media-seek-backward-button>
              <media-play-button>
                <i slot='play' className='fa-solid fa-play' />
                <i slot='pause' className='fa-solid fa-pause' />
              </media-play-button>
              <media-seek-forward-button>
                <i slot='icon' className='fa-solid fa-arrow-rotate-right' />
              </media-seek-forward-button>
              <media-mute-button>
                <i slot='high' className='fa-solid fa-volume-high' />
                <i slot='off' className='fa-solid fa-volume-xmark' />
              </media-mute-button>
            </div>
          </media-control-bar>
        </media-controller>
      </div>
    </div>
  );
};