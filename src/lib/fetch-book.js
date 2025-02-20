const API_URL = 'https://cs50-final-project.niezleziolko.app/api/data/book';
const API_KEY = `Bearer ${process.env.BOOK_AUTH}`;

export async function fetchBooks() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY
      }
    });

    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function getBookById(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book');
    };

    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  };
};