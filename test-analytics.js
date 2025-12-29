/**
 * Simple test script to verify analytics is configured correctly
 * Run with: node test-analytics.js
 */

// Simulate Expo environment variable
process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT = 'https://lexirain.vercel.app/api/analytics';

const ANALYTICS_ENDPOINT = process.env.EXPO_PUBLIC_ANALYTICS_ENDPOINT || '';

console.log('🔍 Testing Analytics Configuration...\n');
console.log('Analytics Endpoint:', ANALYTICS_ENDPOINT || '(not set)');
console.log('');

if (!ANALYTICS_ENDPOINT) {
  console.log('❌ Analytics endpoint is not configured!');
  console.log('   Please set EXPO_PUBLIC_ANALYTICS_ENDPOINT in your .env file');
  process.exit(1);
}

console.log('✅ Analytics endpoint is configured');
console.log('');

// Test the endpoint
console.log('🌐 Testing API endpoint...');
const testEvent = {
  events: [
    {
      type: 'test',
      data: {
        message: 'Test event from setup script',
        timestamp: new Date().toISOString(),
      },
    },
  ],
};

fetch(ANALYTICS_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testEvent),
})
  .then(async (response) => {
    const text = await response.text();
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Body:', text);
    
    if (response.ok) {
      console.log('\n✅ API endpoint is working!');
      console.log('   Analytics tracking is ready to use.');
    } else {
      console.log('\n⚠️  API endpoint returned an error');
      console.log('   Check your Vercel deployment and function logs');
    }
  })
  .catch((error) => {
    console.log('\n❌ Failed to connect to API endpoint');
    console.log('   Error:', error.message);
    console.log('');
    console.log('   This might mean:');
    console.log('   1. The API hasn\'t been deployed yet');
    console.log('   2. The endpoint URL is incorrect');
    console.log('   3. There\'s a network issue');
    console.log('');
    console.log('   Try deploying with: vercel --prod');
  });

