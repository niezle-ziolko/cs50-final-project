import { getRequestContext } from '@cloudflare/next-on-pages';

import { bearerHeaders } from 'utils/headers';
import { hashPassword } from 'utils/utils';


export async function POST(request) {
  const authToken = getRequestContext().env.REGISTER_TOKEN;
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
      `SELECT id FROM users WHERE email = ? OR username = ?`
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
      `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`
    ).bind(userId, username, email, hashedPassword).run();

    return new Response(JSON.stringify({ message: 'User registered successfully', userId }), {
      status: 201,
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