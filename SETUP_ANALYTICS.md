# Analytics Setup Guide - Step by Step

Follow these steps to set up analytics tracking for your LexiRain game.

## Step 1: Deploy the API Endpoint

The API endpoint is already created at `api/analytics.ts`. You just need to deploy it:

```bash
vercel --prod
```

This will deploy both your app and the API endpoint.

## Step 2: Get Your API URL

After deployment, your API endpoint will be available at:
- **Production**: `https://lexirain.vercel.app/api/analytics`
- Or your custom domain if you have one

## Step 3: Configure the Analytics Endpoint

You have two options:

### Option A: Environment Variable (Recommended)

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add your analytics endpoint:
   ```
   EXPO_PUBLIC_ANALYTICS_ENDPOINT=https://lexirain.vercel.app/api/analytics
   ```

3. Restart your Expo dev server:
   ```bash
   npm start
   ```

### Option B: Direct Code Edit

1. Open `src/services/analytics.ts`
2. Find this line:
   ```typescript
   const ANALYTICS_ENDPOINT = process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT || '';
   ```
3. Replace with:
   ```typescript
   const ANALYTICS_ENDPOINT = 'https://lexirain.vercel.app/api/analytics';
   ```

## Step 4: Test It

1. Start your game:
   ```bash
   npm start
   ```

2. Play a game and make some answers (correct and wrong)

3. Check your Vercel logs:
   - Go to https://vercel.com/gokhancodes-projects/lexirain
   - Click on "Functions" tab
   - Click on "analytics" function
   - View the logs - you should see events being logged

## Step 5: View the Data

### Option 1: Vercel Logs (Temporary)
- Events are logged to Vercel function logs
- Good for testing, but logs expire after a few days

### Option 2: Add Database Storage (Recommended)

Edit `api/analytics.ts` and uncomment/add database code. Here are some options:

#### Using Vercel KV (Simple Key-Value Store)

1. Install Vercel KV:
   ```bash
   npm install @vercel/kv
   ```

2. In Vercel dashboard, go to your project → Storage → Create Database → KV
3. Get your connection string
4. Add to Vercel environment variables: `KV_REST_API_URL` and `KV_REST_API_TOKEN`
5. Uncomment the KV example code in `api/analytics.ts`

#### Using MongoDB

1. Create a MongoDB Atlas account (free tier available)
2. Get your connection string
3. Add `MONGODB_URI` to Vercel environment variables
4. Uncomment the MongoDB example code in `api/analytics.ts`

#### Using Supabase (PostgreSQL)

1. Create a Supabase project
2. Get your connection string
3. Add to Vercel environment variables
4. Add code to save events to Supabase

## Step 6: Analyze the Data

Once you're collecting data, you can analyze:

### Most Difficult Words
```sql
SELECT word, COUNT(*) as attempts, 
       SUM(CASE WHEN isCorrect THEN 1 ELSE 0 END) as correct,
       AVG(CASE WHEN isCorrect THEN 1.0 ELSE 0.0 END) as accuracy
FROM analytics
WHERE type = 'answer'
GROUP BY word
ORDER BY accuracy ASC;
```

### Common Mistakes
```sql
SELECT userAnswer, word, translation, COUNT(*) as frequency
FROM analytics
WHERE type = 'answer' AND isCorrect = false
GROUP BY userAnswer, word, translation
ORDER BY frequency DESC;
```

### Language Performance
```sql
SELECT language, 
       AVG(score) as avg_score,
       AVG(level) as avg_level,
       AVG(wordsCompleted) as avg_words
FROM analytics
WHERE type = 'game_end'
GROUP BY language;
```

## Troubleshooting

### Events not being sent?
1. Check that `EXPO_PUBLIC_ANALYTICS_ENDPOINT` is set correctly
2. Check browser console for errors
3. Verify the API endpoint is deployed and accessible

### API returning errors?
1. Check Vercel function logs
2. Verify CORS is enabled (should be automatic with Vercel)
3. Check that the request format matches what the API expects

### Want to disable analytics?
Simply remove or empty the `EXPO_PUBLIC_ANALYTICS_ENDPOINT` environment variable, or set it to an empty string in the code.

## Next Steps

- Set up a database to persist data
- Create a dashboard to visualize the analytics
- Add more detailed tracking (session IDs, user IDs, etc.)
- Set up alerts for interesting patterns

## Need Help?

Check the `ANALYTICS.md` file for more detailed information and examples.

