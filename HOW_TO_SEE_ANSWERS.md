# How to See User Answers in Vercel Logs

## What You're Currently Seeing

The **405 errors** in your logs are normal - those are GET requests (probably from someone trying to access the endpoint in a browser). The analytics endpoint only accepts POST requests.

## To See Actual Answer Data

You need **POST requests** from the game. Here's what to look for:

### In Vercel Logs:

1. **Filter for POST requests:**
   - In the search bar, change the filter to: `function:/api/analytics method:POST`
   - Or look for entries that show `POST` instead of `GET`

2. **What you'll see:**
   - When a user plays the game, you'll see POST requests with status `200`
   - Click on a POST request to see the full log entry
   - The log will show the JSON data with all the answers

3. **Example log entry:**
   ```
   [Analytics] Received 3 event(s): 
   [
     {
       "type": "answer",
       "data": {
         "language": "spanish",
         "wordId": "word-123",
         "word": "hello",
         "translation": "hola",
         "userAnswer": "hola",
         "isCorrect": true,
         "level": 1,
         "timestamp": "2024-12-30T02:10:00.000Z"
       }
     }
   ]
   ```

## Steps to Generate Data

1. **Make sure your app is using the analytics:**
   - Check that `.env` file has: `EXPO_PUBLIC_ANALYTICS_ENDPOINT=https://lexirain.vercel.app/api/analytics`
   - Restart your Expo dev server: `npm start`

2. **Play the game:**
   - Open your app (web, iOS, or Android)
   - Start a game
   - Make some answers (correct and wrong)
   - Finish or end the game

3. **Check the logs:**
   - Go back to Vercel logs
   - You should now see POST requests with `200` status
   - Click on them to see the answer data

## Better Viewing Option

I've created a dashboard that's easier to read. After deploying, visit:

**https://lexirain.vercel.app/api/analytics-dashboard.html**

This shows all answers in a nice table format with statistics.

## If You Don't See Any POST Requests

1. **Check the endpoint is deployed:**
   ```bash
   vercel --prod
   ```

2. **Verify the .env file:**
   - Make sure `EXPO_PUBLIC_ANALYTICS_ENDPOINT` is set
   - Restart Expo dev server after changing .env

3. **Check browser console:**
   - Open browser dev tools (F12)
   - Look for any errors when playing the game
   - Check Network tab for failed requests to `/api/analytics`

4. **Test manually:**
   ```bash
   curl -X POST https://lexirain.vercel.app/api/analytics \
     -H "Content-Type: application/json" \
     -d '{"events":[{"type":"test","data":{"message":"test"}}]}'
   ```

## What Data You'll See

For each answer, the logs will show:
- **word**: The word shown to the player (e.g., "hello")
- **translation**: The correct answer (e.g., "hola")
- **userAnswer**: What the player typed (e.g., "hola" or "holo")
- **isCorrect**: true or false
- **level**: Game level (1, 2, 3, etc.)
- **language**: Which language (spanish, french, etc.)
- **timestamp**: When it happened

