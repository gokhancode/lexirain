/**
 * Shared storage for analytics data
 * Note: In-memory storage resets on serverless function restart
 * For production, use a database (Vercel KV, MongoDB, etc.)
 */

interface AnalyticsEvent {
  type: string;
  data: any;
  receivedAt: string;
}

// In-memory storage (resets on function restart)
// TODO: Replace with database for production
let analyticsData: AnalyticsEvent[] = [];

export function addEvents(events: AnalyticsEvent[]) {
  analyticsData.push(...events);
  
  // Keep only last 1000 events to prevent memory issues
  if (analyticsData.length > 1000) {
    analyticsData = analyticsData.slice(-1000);
  }
}

export function getEvents(filter?: { type?: string; limit?: number }) {
  let filtered = [...analyticsData];
  
  if (filter?.type) {
    filtered = filtered.filter(event => event.type === filter.type);
  }
  
  if (filter?.limit) {
    filtered = filtered.slice(-filter.limit);
  }
  
  return filtered.reverse(); // Most recent first
}

export function getStats() {
  const answers = analyticsData.filter(e => e.type === 'answer');
  
  return {
    totalEvents: analyticsData.length,
    byType: analyticsData.reduce((acc: any, event: any) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {}),
    answers: {
      total: answers.length,
      correct: answers.filter((e: any) => e.data?.isCorrect).length,
      wrong: answers.filter((e: any) => !e.data?.isCorrect).length,
    },
    games: {
      started: analyticsData.filter((e: any) => e.type === 'game_start').length,
      ended: analyticsData.filter((e: any) => e.type === 'game_end').length,
    },
  };
}

export function clearData() {
  analyticsData = [];
}

