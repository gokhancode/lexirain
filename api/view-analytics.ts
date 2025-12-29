import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * View Analytics API endpoint
 * Returns stored analytics data
 * 
 * Access at: https://lexirain.vercel.app/api/view-analytics
 */

// Simple in-memory storage (resets on server restart)
// For production, use a database instead
let analyticsData: any[] = [];

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

    // Filter by event type if specified
    let filteredData = analyticsData;
    if (type) {
      filteredData = analyticsData.filter(event => event.type === type);
    }

    // Limit results
    const limitedData = filteredData.slice(-Number(limit));

    // Calculate statistics
    const stats = {
      totalEvents: analyticsData.length,
      byType: analyticsData.reduce((acc: any, event: any) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {}),
      answers: {
        total: analyticsData.filter((e: any) => e.type === 'answer').length,
        correct: analyticsData.filter((e: any) => e.type === 'answer' && e.data?.isCorrect).length,
        wrong: analyticsData.filter((e: any) => e.type === 'answer' && !e.data?.isCorrect).length,
      },
      games: {
        started: analyticsData.filter((e: any) => e.type === 'game_start').length,
        ended: analyticsData.filter((e: any) => e.type === 'game_end').length,
      },
    };

    return res.status(200).json({
      success: true,
      stats,
      events: limitedData.reverse(), // Most recent first
      count: limitedData.length,
    });

  } catch (error) {
    console.error('[View Analytics] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Export the storage array so analytics.ts can write to it
export { analyticsData };

