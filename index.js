require('dotenv').config();
const express = require('express');
const OrangeHRMOAuth = require('./oauth');

const app = express();
const oauth = new OrangeHRMOAuth();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Home page - provides links to test OAuth flow
 */
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OrangeHRM OAuth Flow Test</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; margin: 10px 0; }
        .button-primary { background-color: #4CAF50; color: white; border: none; border-radius: 4px; }
        .button-primary:hover { background-color: #45a049; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
        code { background-color: #f4f4f4; padding: 10px; display: block; margin: 10px 0; }
        h2 { color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>OrangeHRM OAuth Flow Test</h1>
        
        <div class="section">
          <h2>Step 1: Generate Authorization URL</h2>
          <p>Click the button below to generate and view the authorization URL.</p>
          <form action="/auth" method="get">
            <button type="submit" class="button-primary">Start Authorization</button>
          </form>
        </div>

        <div class="section">
          <h2>Step 2: Exchange Authorization Code</h2>
          <p>After authorization, you'll be redirected with a code.</p>
          <p>Or manually enter the authorization code below:</p>
          <form action="/callback" method="get">
            <input type="text" name="code" placeholder="Enter authorization code" required />
            <input type="text" name="state" placeholder="Enter state (optional)" />
            <button type="submit" class="button-primary">Exchange for Token</button>
          </form>
        </div>

        <div class="section">
          <h2>Configuration</h2>
          <p>Base URL: <code>${process.env.ORANGEHRM_BASE_URL}</code></p>
          <p>Client ID: <code>${process.env.ORANGEHRM_CLIENT_ID}</code></p>
          <p>Redirect URI: <code>${process.env.REDIRECT_URI}</code></p>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

/**
 * Generate authorization URL
 */
app.get('/auth', (req, res) => {
  try {
    const state = Math.random().toString(36).substring(7);
    const authUrl = oauth.getAuthorizationUrl(state);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization URL</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          code { background-color: #f4f4f4; padding: 15px; display: block; margin: 10px 0; word-break: break-all; }
          a { color: #4CAF50; text-decoration: none; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 4px; display: inline-block; margin: 10px 0; }
          a:hover { background-color: #4CAF50; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Authorization URL Generated</h1>
          <p>Open this URL in your browser to authorize the application:</p>
          <code>${authUrl}</code>
          <p><a href="${authUrl}" target="_blank">Open Authorization URL</a></p>
          <p><a href="/">← Back to Home</a></p>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

/**
 * Handle OAuth callback
 * This is called after user authorizes, with authorization code in query params
 */
app.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).send(`Authorization Error: ${error}`);
    }

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    console.log(`\nReceived callback with code: ${code}`);
    if (state) console.log(`State: ${state}`);

    // Exchange code for access token
    const tokenData = await oauth.getAccessToken(code);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Token Response</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          .success { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 10px 0; }
          code { background-color: #f4f4f4; padding: 15px; display: block; margin: 10px 0; word-break: break-all; }
          a { color: #4CAF50; text-decoration: none; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 4px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Token Exchange Successful</h1>
          <div class="success">Access token received!</div>
          <h2>Token Response:</h2>
          <code>${JSON.stringify(tokenData, null, 2)}</code>
          <p><a href="/">← Back to Home</a></p>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send(`<p>Error: ${error.message}</p><p><a href="/">← Back to Home</a></p>`);
  }
});

// Start server
app.listen(port, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  OrangeHRM OAuth Flow Test Server      ║`);
  console.log(`╚════════════════════════════════════════╝`);
  console.log(`\nServer running at: http://localhost:${port}`);
  console.log(`\nConfiguration:`);
  console.log(`  Base URL: ${process.env.ORANGEHRM_BASE_URL}`);
  console.log(`  Client ID: ${process.env.ORANGEHRM_CLIENT_ID}`);
  console.log(`  Redirect URI: ${process.env.REDIRECT_URI}`);
  console.log(`\nOpen http://localhost:${port} in your browser to start testing.\n`);
});
