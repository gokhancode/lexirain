/**
 * Analytics service for tracking user answers and game statistics
 * Configure ANALYTICS_ENDPOINT to send data to your backend
 */

// Configure your analytics endpoint here
// For example: 'https://your-api.com/api/analytics'
// Leave empty to disable analytics
const ANALYTICS_ENDPOINT = process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT || '';

export interface AnswerEvent {
  type: 'answer';
  data: {
    language: string;
    wordId: string;
    word: string;
    translation: string;
    userAnswer: string;
    isCorrect: boolean;
    level: number;
    timestamp: string;
  };
}

export interface GameStartEvent {
  type: 'game_start';
  data: {
    language: string;
    timestamp: string;
  };
}

export interface GameEndEvent {
  type: 'game_end';
  data: {
    language: string;
    score: number;
    level: number;
    wordsCompleted: number;
    livesRemaining: number;
    timestamp: string;
  };
}

export type AnalyticsEvent = AnswerEvent | GameStartEvent | GameEndEvent;

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;
  private batchSize: number = 10;
  private flushInterval: number = 5000; // 5 seconds
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.isEnabled = !!ANALYTICS_ENDPOINT;
    if (this.isEnabled) {
      this.startFlushTimer();
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Track a user answer
   */
  trackAnswer(data: AnswerEvent['data']) {
    if (!this.isEnabled) return;

    const event: AnswerEvent = {
      type: 'answer',
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    };

    this.queue.push(event);

    // Flush if queue is full
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Track game start
   */
  trackGameStart(language: string) {
    if (!this.isEnabled) return;

    const event: GameStartEvent = {
      type: 'game_start',
      data: {
        language,
        timestamp: new Date().toISOString(),
      },
    };

    this.queue.push(event);
    this.flush(); // Immediately send game start events
  }

  /**
   * Track game end
   */
  trackGameEnd(data: GameEndEvent['data']) {
    if (!this.isEnabled) return;

    const event: GameEndEvent = {
      type: 'game_end',
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    };

    this.queue.push(event);
    this.flush(); // Immediately send game end events
  }

  /**
   * Flush queued events to the server
   */
  private async flush() {
    if (this.queue.length === 0 || !this.isEnabled) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.warn('Analytics: Failed to send events', error);
      // Re-queue events on failure (optional - you might want to drop them)
      // this.queue.unshift(...events);
    }
  }

  /**
   * Manually flush remaining events (call on app close, etc.)
   */
  async flushAll() {
    await this.flush();
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

