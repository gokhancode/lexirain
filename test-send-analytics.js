/**
 * Test script to send sample analytics data
 * Run with: node test-send-analytics.js
 */

const ANALYTICS_ENDPOINT = 'https://lexirain.vercel.app/api/analytics';

const testEvents = {
  events: [
    {
      type: 'game_start',
      data: {
        language: 'spanish',
        timestamp: new Date().toISOString(),
      },
    },
    {
      type: 'answer',
      data: {
        language: 'spanish',
        wordId: 'test-word-1',
        word: 'hello',
        translation: 'hola',
        userAnswer: 'hola',
        isCorrect: true,
        level: 1,
        timestamp: new Date().toISOString(),
      },
    },
    {
      type: 'answer',
      data: {
        language: 'spanish',
        wordId: 'test-word-2',
        word: 'goodbye',
        translation: 'adiós',
        userAnswer: 'adios',
        isCorrect: true,
        level: 1,
        timestamp: new Date().toISOString(),
      },
    },
    {
      type: 'answer',
      data: {
        language: 'spanish',
        wordId: 'test-word-3',
        word: 'thank you',
        translation: 'gracias',
        userAnswer: 'gracia', // Wrong answer
        isCorrect: false,
        level: 2,
        timestamp: new Date().toISOString(),
      },
    },
    {
      type: 'game_end',
      data: {
        language: 'spanish',
        score: 150,
        level: 2,
        wordsCompleted: 15,
        livesRemaining: 1,
        timestamp: new Date().toISOString(),
      },
    },
  ],
};

console.log('🧪 Sending test analytics data...\n');
console.log('Endpoint:', ANALYTICS_ENDPOINT);
console.log('Events:', testEvents.events.length);
console.log('');

fetch(ANALYTICS_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testEvents),
})
  .then(async (response) => {
    const text = await response.text();
    console.log('✅ Response Status:', response.status, response.statusText);
    console.log('Response:', text);
    console.log('');
    console.log('📊 Now check your Vercel logs - you should see the events!');
    console.log('   Go to: https://vercel.com/gokhancodes-projects/lexirain');
    console.log('   → Functions → analytics → Logs');
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
  });

