'use client';
import 'styles/css/components/panel.css';

export default function BookPanel({ book }) {
  return (
    <div className='panel book'>
      <h1>{book.title}</h1>
      <hr />
      <h2>Author: {book.author}</h2>
      <p>{book.description}</p>
    </div>
  );
};