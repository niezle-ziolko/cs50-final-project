import { notFound } from 'next/navigation';

import AudioPlayer from 'components/player';

export async function generateStaticParams() {
  try {
    const response = await fetch('https://cs50-final-project.niezleziolko.app/api/data/book', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
      }
    });

    const books = await response.json();
    
    return books.map(book => ({
      id: book.id
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  };
};

export default async function Page({ params }) {
  const { id } = await params;

  try {
    const response = await fetch(`https://cs50-final-project.niezleziolko.app/api/data/book?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
      }
    });

    const book = await response.json();

    if (!book || !id) {
      notFound();
    };

    return (
      <>
        <AudioPlayer />
      </>
    );
  } catch (error) {
    console.error('Error:', error);
    notFound();
  };
};

export const runtime = 'edge';