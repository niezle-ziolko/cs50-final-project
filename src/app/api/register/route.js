import { getRequestContext } from '@cloudflare/next-on-pages';


export async function POST(request) {
  const requestBody = await request.text();
  const { username, email, password } = JSON.parse(requestBody);

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  try {
    const db = getRequestContext().env.DATABASE;;

    const result = await db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `).bind(username, email, password).run();


    return new Response(JSON.stringify({ message: 'User registered successfully', userId: result.lastInsertRowid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const runtime = 'edge';