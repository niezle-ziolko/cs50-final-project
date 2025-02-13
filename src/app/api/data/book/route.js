import { getRequestContext } from '@cloudflare/next-on-pages';
import { bearerHeaders } from 'utils/headers';

export async function GET(request) {
  try {
    const { env } = getRequestContext();
    const authToken = env.BOOK_AUTH;
    const authResponse = bearerHeaders(request, authToken);

    if (authResponse) return authResponse;

    const urlSearchParams = new URL(request.url);
    const id = urlSearchParams.searchParams.get('id');

    const db = env.DATABASE;

    let result;

    if (!id) {
      result = await db.prepare('SELECT * FROM books').all();
      
      if (result.length === 0) {
        return new Response(JSON.stringify({ error: 'No books found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      return new Response(JSON.stringify({
        results: result.results
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      result = await db.prepare(
        `SELECT * FROM books WHERE id = '${id}'`
      ).first();

      if (!result) {
        return new Response(JSON.stringify({ error: 'Book not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const bookData = {
        id: result.id,
        title: result.title,
        description: result.description,
        file: result.file,
        picture: result.picture,
        author: result.author
      };

      return new Response(JSON.stringify({ result: bookData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


export async function POST(request) {
  const { env } = getRequestContext();
  const authToken = env.BOOK_AUTH;
  const authResponse = bearerHeaders(request, authToken);

  if (authResponse) return authResponse;

  let requestBody;
  try {
    requestBody = JSON.parse(await request.text());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const { title, description, author, picture, file } = requestBody;

  if (!title || !description || !author || !picture || !file) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const db = env.DATABASE;
  
  try {
    const existingBook = await db.prepare(
      'SELECT id FROM books WHERE title = ?'
    ).bind(title).first();

    if (existingBook) {
      return new Response(JSON.stringify({ error: 'Title book already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const bookId = crypto.randomUUID();
    const dateCreated = new Date().toISOString();

    const imageName = `${bookId}.webp`;
    const imageKey = `final-project/book-picture/${imageName}`;
    await getRequestContext().env.R2.put(imageKey, picture);
    const imageUrl = `https://cdn.niezleziolko.app/${imageKey}`;

    const fileName = `${bookId}.mp3`;
    const fileKey = `final-project/book-file/${fileName}`;
    await getRequestContext().env.R2.put(fileKey, file);
    const fileUrl = `https://cdn.niezleziolko.app/${fileKey}`;
    
    await db.prepare(
      'INSERT INTO books (id, title, description, author, picture, link) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(bookId, title, description, author, imageUrl, fileUrl, dateCreated).run();

    const result = await db.prepare(
      `SELECT * FROM books WHERE id = '${bookId}'`
    ).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Created user not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const bookData = {
      id: result.id,
      title: result.title,
      description: result.description,
      link: result.link,
      picture: result.picture,
      author: result.author
    };

    return new Response(JSON.stringify(bookData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  };
};

export const runtime = 'edge';