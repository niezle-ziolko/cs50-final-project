import { notFound } from 'next/navigation';

import AudioPlayer from 'components/player';
import BookPanel from 'components/panel/book-panel';

import { getBookById } from 'lib/fetch-book';

export default async function Page({ params }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  };

  return (
    <div className='page'>
      <BookPanel book={book} />
      <AudioPlayer />
    </div>
  );
};