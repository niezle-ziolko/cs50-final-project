import { getRequestContext } from '@cloudflare/next-on-pages';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = getRequestContext().env.DATABASE;;

    const result = await db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `).bind(username, email, password).run();

    res.status(201).json({ message: 'User registered successfully', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const runtime = 'edge';