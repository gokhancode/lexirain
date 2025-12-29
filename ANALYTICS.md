# Analytics Setup Guide

This app tracks user answers and game statistics. Here's how to set it up:

## What Gets Tracked

1. **Game Start**: When a player starts a game (language selected)
2. **Answers**: Every answer attempt with:
   - Word ID and meaning
   - Correct translation
   - User's answer
   - Whether it was correct
   - Current level
   - Timestamp
3. **Game End**: Final game statistics:
   - Final score
   - Level reached
   - Words completed
   - Lives remaining

## Setup Options

### Option 1: Environment Variable (Recommended)

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_ANALYTICS_ENDPOINT=https://your-api.com/api/analytics
```

### Option 2: Direct Code Edit

Edit `src/services/analytics.ts` and set the `ANALYTICS_ENDPOINT` constant:

```typescript
const ANALYTICS_ENDPOINT = 'https://your-api.com/api/analytics';
```

## Example Backend Endpoint

Your backend should accept POST requests with this format:

```json
{
  "events": [
    {
      "type": "answer",
      "data": {
        "language": "spanish",
        "wordId": "word-123",
        "word": "hello",
        "translation": "hola",
        "userAnswer": "hola",
        "isCorrect": true,
        "level": 2,
        "timestamp": "2024-01-01T12:00:00.000Z"
      }
    },
    {
      "type": "game_start",
      "data": {
        "language": "spanish",
        "timestamp": "2024-01-01T12:00:00.000Z"
      }
    },
    {
      "type": "game_end",
      "data": {
        "language": "spanish",
        "score": 150,
        "level": 3,
        "wordsCompleted": 15,
        "livesRemaining": 0,
        "timestamp": "2024-01-01T12:05:00.000Z"
      }
    }
  ]
}
```

## Example Serverless Function (Vercel)

Create `api/analytics.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { events } = req.body;

  // Process events (save to database, etc.)
  console.log('Received events:', events);

  // Example: Save to a database
  // await saveToDatabase(events);

  res.status(200).json({ success: true, received: events.length });
}
```

## Example with Firebase

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export default async function handler(req, res) {
  const { events } = req.body;
  
  for (const event of events) {
    await addDoc(collection(db, 'analytics'), {
      ...event,
      receivedAt: new Date(),
    });
  }
  
  res.status(200).json({ success: true });
}
```

## Data Analysis Ideas

With this data, you can analyze:

- **Most difficult words**: Words with lowest correct answer rates
- **Common mistakes**: Wrong answers that appear frequently
- **Language difficulty**: Compare performance across languages
- **Level progression**: Average level reached per game
- **User patterns**: Time of day, session length, etc.

## Privacy Note

The analytics service only tracks game-related data. No personal information is collected unless you add it to your backend. Consider adding a privacy policy if you collect this data.

