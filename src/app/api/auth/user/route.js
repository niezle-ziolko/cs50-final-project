import { getRequestContext } from '@cloudflare/next-on-pages';

import { bearerHeaders } from 'utils/headers';
import { hashPassword } from 'utils/utils';


export async function GET(request) {
  try {
    const authToken = getRequestContext().env.CLIENT_AUTH;
    const authResponse = bearerHeaders(request, authToken);

    if (authResponse) {
      return authResponse;
    };

    const urlSearchParams = new URL(request.url);
    const credentials = urlSearchParams.searchParams.get('credentials');

    if (!credentials) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const decodedCredentials = decodeURIComponent(credentials);
    const [username, password] = decodedCredentials.split(':');

    const db = getRequestContext().env.DATABASE;

    const result = await db.prepare(
      `SELECT id, username, password FROM users WHERE username = '${username}'`
    ).first();    
    
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

export async function POST(request) {
  const authToken = getRequestContext().env.CLIENT_AUTH;
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

  const { username, email, password } = requestBody;

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const db = getRequestContext().env.DATABASE;
  
  try {
    const existingUser = await db.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).bind(email, username).first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email or username already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    
    const result = await db.prepare(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)'
    ).bind(userId, username, email, hashedPassword).run();

    return new Response(JSON.stringify({ message: 'User registered successfully', userId }), {
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