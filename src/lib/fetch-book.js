import { getRequestContext } from '@cloudflare/next-on-pages';

const { env } = getRequestContext();
const API_URL = 'https://cs50-final-project.niezleziolko.app/api/data/book';
const API_KEY = `Bearer ${env.BOOK_AUTH}`;

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

export const runtime = 'edge';