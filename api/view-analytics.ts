import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEvents, getStats } from './storage';

/**
 * View Analytics API endpoint
 * Returns stored analytics data
 * 
 * Access at: https://lexirain.vercel.app/api/view-analytics
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests'
    });
  }

  try {
    const { type, limit = 100 } = req.query;

    // Get events with filters
    const events = getEvents({
      type: type as string,
      limit: Number(limit),
    });

    // Get statistics
    const stats = getStats();

    return res.status(200).json({
      success: true,
      stats,
      events,
      count: events.length,
    });

  } catch (error) {
    console.error('[View Analytics] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

