'use client';
import { useAudio } from 'context/audio-context';
import { useAuth } from 'context/auth-context';
import { useState } from 'react';

export default function HeartButton() {
  const { currentBookId } = useAudio();
  const { user, setUser } = useAuth();

  const [isLiked, setIsLiked] = useState(() => {
    const likedBooks = user?.liked ? user.liked.split(',') : [];
    return likedBooks.includes(currentBookId);
  });

  const handleLike = async () => {
    if (!currentBookId || !user) return;

    try {
      const response = await fetch('/api/auth/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CLIENT_AUTH}`
        },
        body: JSON.stringify({
          id: currentBookId,
          username: user.username
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(prevUser => ({...prevUser, liked: data.liked}));
          setIsLiked(true);
          console.log('Book liked successfully');
        } else {
          console.error(data);
        };
      } else {
        console.error(response.statusText);
      };
    } catch (error) {
      console.error(error);
    };
  };

  return (
    <div className='heart' onClick={handleLike}>
      <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
    </div>
  );
};