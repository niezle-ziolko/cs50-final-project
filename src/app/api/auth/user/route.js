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

    const credentialsHeader = request.headers.get('Credentials');

    if (!credentialsHeader) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    let decodedCredentials;
    try {
      decodedCredentials = Buffer.from(credentialsHeader, 'base64').toString('utf-8');
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid Base64 encoding' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const [username, password] = decodedCredentials.split(':');

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const db = getRequestContext().env.DATABASE;

    const result = await db.prepare(
      `SELECT * FROM users WHERE username = '${username}'`
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

    const userData = {
      id: result.id,
      username: result.username,
      email: result.email,
      photo: result.photo,
      created: result.created,
      currently: result.currently,
      liked: result.liked,
      expiresDate: new Date().toISOString()
    };

    return new Response(JSON.stringify(userData), {
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
    
    await db.prepare(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)'
    ).bind(userId, username, email, hashedPassword).run();

    const result = await db.prepare(
      `SELECT * FROM users WHERE id = '${userId}'`
    ).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Created user not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const userData = {
      id: result.id,
      username: result.username,
      email: result.email,
      photo: result.photo,
      created: result.created,
      currently: result.currently,
      liked: result.liked,
      expiresDate: new Date().toISOString()
    };

    return new Response(JSON.stringify(userData), {
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

export async function PUT(request) {
  try {
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

    const { username, email, password, photo } = requestBody;

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const db = getRequestContext().env.DATABASE;
    const result = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const updates = [];
    const params = [];
    if (email) { updates.push('email = ?'); params.push(email); }
    if (password) { updates.push('password = ?'); params.push(password); }
    if (photo) { updates.push('photo = ?'); params.push(photo); }

    if (updates.length > 0) {
      params.push(username);
      await db.query(`UPDATE users SET ${updates.join(', ')} WHERE username = ?`, params);
    };

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
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