import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const response = await fetch('https://cs50-final-project.niezleziolko.app/api/data/book', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer aGVCzBMZvmaIujfzlLovQGPuB93E1eId'
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
        'Authorization': 'Bearer aGVCzBMZvmaIujfzlLovQGPuB93E1eId'
      }
    });

    const book = await response.json();

    if (!book || !id) {
      notFound();
    };

    return (
      <>
        <h1>{book.title}</h1>
        <p>{book.description}</p>
        <p>Autor: {book.author}</p>
        <img src={book.picture} alt={book.title} />
      </>
    );
  } catch (error) {
    console.error('Error:', error);
    notFound();
  };
};