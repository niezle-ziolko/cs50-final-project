import { getRequestContext } from '@cloudflare/next-on-pages';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

export async function POST(request) {
  const requestBody = await request.text();
  const { username, email, password } = JSON.parse(requestBody);

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const db = getRequestContext().env.DATABASE;

    const result = await db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `).bind(username, email, hashedPassword).run();

    return new Response(JSON.stringify({ message: 'User registered successfully', userId: result.lastInsertRowid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const runtime = 'edge';