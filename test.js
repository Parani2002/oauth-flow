/**
 * Test script for HRM OAuth flow
 * Run this to manually test authorization URL generation and token exchange
 */

require('dotenv').config();
const HRMOAuth = require('./oauth');

async function runTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  HRM OAuth Flow Test                   ║');
  console.log('╚════════════════════════════════════════╝\n');

  const oauth = new HRMOAuth();

  // Test 1: Generate Authorization URL
  console.log('TEST 1: Generate Authorization URL');
  console.log('─'.repeat(40));
  const authUrl = oauth.getAuthorizationUrl();
  console.log('Copy and open this URL in your browser to authorize:\n');
  console.log(authUrl);

  // Test 2: Manual token exchange (for demo purposes)
  console.log('\n\nTEST 2: Token Exchange');
  console.log('─'.repeat(40));
  console.log('To test token exchange, you need an authorization code.');
  console.log('Use the authorization URL above to get a code, then modify');
  console.log('test.js to include your actual code and uncomment the section below.\n');

  // UNCOMMENT BELOW AND ADD YOUR CODE TO TEST TOKEN EXCHANGE
  /*
  const authorizationCode = 'YOUR_AUTHORIZATION_CODE_HERE';
  try {
    const tokenResponse = await oauth.getAccessToken(authorizationCode);
    console.log('\nToken obtained successfully!');
  } catch (error) {
    console.error('Token exchange failed.');
  }
  */

  console.log('\n\nFor interactive testing, run:');
  console.log('  npm start\n');
  console.log('Then open http://localhost:3000 in your browser.\n');
}

runTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
