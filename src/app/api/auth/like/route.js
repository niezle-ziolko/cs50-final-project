import { getRequestContext } from '@cloudflare/next-on-pages';
import { bearerHeaders } from 'utils/headers';

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

  const { id, username } = requestBody;

  if (!id || !username) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const db = env.D1;
  
  try {
    const userQuery = await db.prepare('SELECT liked FROM users WHERE username = ?').bind(username).first();
    
    if (!userQuery) {
      return new Response(JSON.stringify({ error: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const likedArray = userQuery.liked ? userQuery.liked.split(',').map(item => item.trim()) : [];
    
    if (likedArray.includes(id.toString())) {
      return new Response(JSON.stringify({ error: 'ID has already been added.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    likedArray.push(id.toString());
    
    const updatedLiked = likedArray.join(', ');

    await db.prepare('UPDATE users SET liked = ? WHERE username = ?').bind(updatedLiked, username).run();
    
    return new Response(JSON.stringify({ success: true, liked: updatedLiked }), {
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

export async function DELETE(request) {
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

  const { id, username } = requestBody;

  if (!id || !username) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const db = env.D1;

  try {
    const userQuery = await db.prepare('SELECT liked FROM users WHERE username = ?').bind(username).first();
    
    if (!userQuery) {
      return new Response(JSON.stringify({ error: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const likedArray = userQuery.liked ? userQuery.liked.split(', ').filter(likedId => likedId !== id) : [];

    if (likedArray.length === userQuery.liked.split(', ').length) {
      return new Response(JSON.stringify({ error: 'ID not found in liked.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const updatedLiked = likedArray.join(', ');

    await db.prepare('UPDATE users SET liked = ? WHERE username = ?').bind(updatedLiked, username).run();

    return new Response(JSON.stringify({ success: true, liked: updatedLiked }), {
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