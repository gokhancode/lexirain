import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Simple test endpoint to verify the API is working
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
  });
}

