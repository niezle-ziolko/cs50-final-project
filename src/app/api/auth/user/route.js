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
    const { env } = getRequestContext();
    const authToken = env.CLIENT_AUTH;
    const authResponse = bearerHeaders(request, authToken);
    if (authResponse) return authResponse;

    let requestBody;
    try {
      requestBody = JSON.parse(await request.text());
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    };

    const { username, email, password, photo } = requestBody;

    if (!username || typeof username !== "string" || !username.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
      return new Response(JSON.stringify({ error: "Invalid username" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    };

    const db = env.DATABASE;
    const user = await db.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    };

    const updates = [];
    const params = [];

    if (email && email !== user.email) {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return new Response(JSON.stringify({ error: "Invalid email format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      };

      const emailExists = await db.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first();
      if (emailExists) {
        return new Response(JSON.stringify({ error: "Email already in use" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      };

      updates.push("email = ?");
      params.push(email);
    };

    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
      if (hashedPassword !== user.password) {
        updates.push("password = ?");
        params.push(hashedPassword);
      };
    };

    if (photo && photo !== user.photo) {
      if (!photo.match(/^https?:\/\/.+\..+/)) {
        return new Response(JSON.stringify({ error: "Invalid photo URL" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      };

      updates.push("photo = ?");
      params.push(photo);
    };

    if (updates.length === 0) {
      return new Response(JSON.stringify({ message: "No changes detected" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    params.push(username);
    await db.prepare(
      `UPDATE users SET ${updates.join(", ")} WHERE username = ?`
    ).bind(...params).run();

    const result = await db.prepare(
      `SELECT * FROM users WHERE username = '${username}'`
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
      expiresDate: new Date().toISOString()
    };

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  };
};

export const runtime = 'edge';