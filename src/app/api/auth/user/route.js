import { getRequestContext } from '@cloudflare/next-on-pages';

import { bearerHeaders } from 'utils/headers';
import { hashPassword } from 'utils/utils';


export async function GET(request) {
  try {
    const { env } = getRequestContext();
    const authToken = env.CLIENT_AUTH;
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

    const db = env.DATABASE;

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
  const { env } = getRequestContext();
  const authToken = env.CLIENT_AUTH;
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

  const db = env.DATABASE;
  
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
    const defaultPhotoUrl = 'https://cdn.niezleziolko.app/final-project/profile-photo/default-profile-picture.webp';
    
    await db.prepare(
      'INSERT INTO users (id, username, email, password, photo) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, username, email, hashedPassword, defaultPhotoUrl).run();

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
    const { env } = getRequestContext();
    const authToken = env.CLIENT_AUTH;
    const authResponse = bearerHeaders(request, authToken);
    if (authResponse) return authResponse;

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const photo = formData.get('photo');

    if (!username || typeof username !== 'string' || !username.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
      return new Response(JSON.stringify({ error: 'Invalid username' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = env.DATABASE;
    const user = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates = [];
    const params = [];

    if (email && email !== user.email) {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return new Response(JSON.stringify({ error: 'Invalid email format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      updates.push('email = ?');
      params.push(email);
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    let uploadedPhotoUrl = user.photo;
    if (photo && photo instanceof File) {
      const mimeType = photo.type;
      if (!mimeType.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'Invalid photo format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const arrayBuffer = await photo.arrayBuffer();
      const imageKey = `users/${username}/${photo.name}`;
      await env.R2.put(imageKey, arrayBuffer, { httpMetadata: { contentType: mimeType } });
      uploadedPhotoUrl = `https://cdn.niezleziolko.app/${imageKey}`;
      updates.push('photo = ?');
      params.push(uploadedPhotoUrl);
    }

    if (updates.length > 0) {
      params.push(username);
      await db.prepare(
        `UPDATE users SET ${updates.join(', ')} WHERE username = ?`
      ).bind(...params).run();
    }

    return new Response(JSON.stringify({
      id: user.id,
      username: user.username,
      email: email || user.email,
      photo: uploadedPhotoUrl,
      expiresDate: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


export const runtime = 'edge';