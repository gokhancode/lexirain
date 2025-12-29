import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Analytics API endpoint
 * Receives game analytics data from the LexiRain app
 * 
 * To view the data, you can:
 * 1. Check Vercel function logs in your dashboard
 * 2. Store in a database (see examples below)
 * 3. Send to an external service
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Expected an array of events in the request body'
      });
    }

    // Log events to console (visible in Vercel logs)
    console.log(`[Analytics] Received ${events.length} event(s):`, JSON.stringify(events, null, 2));

    // Process each event
    for (const event of events) {
      console.log(`[Analytics] Processing ${event.type} event:`, JSON.stringify(event.data, null, 2));
      
      // You can add custom processing here:
      // - Save to database
      // - Send to analytics service
      // - Aggregate statistics
      // - etc.
    }

    // TODO: Add your data storage here
    // Example options:
    
    // Option 1: Save to a database
    // await saveToDatabase(events);
    
    // Option 2: Send to external analytics service
    // await sendToAnalyticsService(events);
    
    // Option 3: Store in Vercel KV (key-value store)
    // await storeInKV(events);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      received: events.length,
      message: 'Events processed successfully'
    });

  } catch (error) {
    console.error('[Analytics] Error processing events:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Example: Save to a database
 * Uncomment and configure based on your database choice
 */
/*
async function saveToDatabase(events: any[]) {
  // Example with MongoDB
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(process.env.MONGODB_URI);
  
  await client.connect();
  const db = client.db('lexirain');
  const collection = db.collection('analytics');
  
  await collection.insertMany(events.map(event => ({
    ...event,
    receivedAt: new Date(),
  })));
  
  await client.close();
}
*/

/**
 * Example: Store in Vercel KV
 * Requires: npm install @vercel/kv
 */
/*
import { kv } from '@vercel/kv';

async function storeInKV(events: any[]) {
  const key = `analytics:${Date.now()}`;
  await kv.set(key, events, { ex: 86400 * 30 }); // Expire after 30 days
}
*/

