import { getRequestContext } from '@cloudflare/next-on-pages';

import { corsHeaders, bearerHeaders } from 'utils/headers';


export async function POST(request) {
  try {
    const authToken = getRequestContext().env.CHALLENGE_AUTH;
    const authResponse = bearerHeaders(request, authToken);

    if (authResponse) {
      return authResponse;
    };

    const req = request;

    const { token } = await req.json();
    const clientIps = req.headers.get('x-forwarded-for')?.split(/\s*,\s*/) || [''];
    const ip = clientIps[0];

    if (!token) {
      return new Response(JSON.stringify({ operation: false, error: 'Missing required variables.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (req.method === 'OPTIONS') {
      return new Response(JSON.stringify({ operation: true, response: 'ok' }), {
        status: 200,
        headers: corsHeaders
      });
    };

    let formData = new FormData();
    formData.append('secret', getRequestContext().env.SECRET_KEY || '');
    formData.append('response', token);
    formData.append('remoteip', ip);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
      body: formData,
      method: 'POST'
    });

    const response = await result.json();
    console.log(response);
    
    if (response.success) {
      return new Response(JSON.stringify({ operation: true, response: 'success' }), {
        status: 200,
        headers: corsHeaders
      });
    };

    return new Response(JSON.stringify({ operation: true, response: 'true' }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ operation: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  };
};

export const runtime = 'edge';