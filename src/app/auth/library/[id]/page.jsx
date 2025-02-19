import { getRequestContext } from '@cloudflare/next-on-pages';

import { notFound } from 'next/navigation';

import AudioPlayer from 'components/player';
import BookPanel from 'components/panel/book-panel';

export default async function Page({ params }) {
  const { id } = await params;
  const { env } = getRequestContext();

  try {
    const response = await fetch(`https://cs50-final-project.niezleziolko.app/api/data/book?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.NEXT_PUBLIC_CLIENT_AUTH}`
      }
    });

    const book = await response.json();

    if (!book || !id) {
      notFound();
    };

    return (
      <>
        <BookPanel book={book} />
        <AudioPlayer />
      </>
    );
  } catch (error) {
    console.error('Error:', error);
    notFound();
  };
};

export const runtime = 'edge';