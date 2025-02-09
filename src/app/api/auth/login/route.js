import { getRequestContext } from '@cloudflare/next-on-pages';

import { hashPassword } from 'utils/utils';


export async function POST(request) {
  try {
    let requestBody;
    try {
      requestBody = JSON.parse(await request.text());
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };
    
    const { username, password } = requestBody;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Missing username or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const db = getRequestContext().env.DATABASE;

    const result = await db.prepare('SELECT id, username, password FROM users WHERE username = ?').bind(username).first();
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const storedHashedPassword = result.password;
    const enteredHashedPassword = await hashPassword(password);

    if (storedHashedPassword !== enteredHashedPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const sessionData = {
      id: result.id,
      username: result.username,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000
    };

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': `session=${JSON.stringify(sessionData)}; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Strict` }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  };
};

export const runtime = 'edge';