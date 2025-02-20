const API_URL = 'https://cs50-final-project.niezleziolko.app/api/data/book';
const API_KEY = 'Bearer aGVCzBMZvmaIujfzlLovQGPuB93E1eId';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': API_KEY
};

export async function fetchBooks() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: headers
    });

    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Error:', error);
    return [];
  };
};