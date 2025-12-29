import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Dashboard API endpoint
 * Serves the analytics dashboard HTML page
 * 
 * Access at: https://lexirain.vercel.app/api/dashboard
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Read the HTML file
    const htmlPath = join(process.cwd(), 'api', 'analytics-dashboard.html');
    const html = readFileSync(htmlPath, 'utf-8');
    
    // Set content type and return HTML
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('[Dashboard] Error:', error);
    return res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1>Error Loading Dashboard</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p>Please check the server logs.</p>
        </body>
      </html>
    `);
  }
}

