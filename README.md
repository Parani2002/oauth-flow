# OrangeHRM OAuth Flow Testing

A Node.js project for testing the OrangeHRM OAuth 2.0 flow including authorization URL generation and access token exchange.

## Features

- **Authorization URL Generation** - Generate the URL to redirect users for authorization
- **Access Token Exchange** - Exchange authorization code for access tokens
- **Token Refresh** - Refresh expired access tokens
- **Express Server** - Interactive web interface for testing the OAuth flow
- **Console Utilities** - Command-line tools for testing

## Prerequisites

- Node.js 14+ 
- OrangeHRM instance with OAuth 2.0 configured
- OAuth credentials (Client ID, Client Secret)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OrangeHRM OAuth credentials:
   ```
   ORANGEHRM_BASE_URL=https://your-instance.orangehrm.com
   ORANGEHRM_CLIENT_ID=your_client_id
   ORANGEHRM_CLIENT_SECRET=your_client_secret
   REDIRECT_URI=http://localhost:3000/callback
   PORT=3000
   ```

## Usage

### Option 1: Interactive Web Interface (Recommended)

Start the Express server:
```bash
npm start
```

Then open http://localhost:3000 in your browser. The interface provides:
- Link to generate authorization URL
- Manual code exchange form
- Token response viewer

### Option 2: Console Testing

```bash
npm test
```

This will generate an authorization URL. Copy it to your browser, authorize, get the code, and manually test the token exchange.

### Option 3: Programmatic Usage

```javascript
const OrangeHRMOAuth = require('./oauth');

const oauth = new OrangeHRMOAuth();

// Generate authorization URL
const authUrl = oauth.getAuthorizationUrl();

// Exchange code for token
const tokenData = await oauth.getAccessToken(authorizationCode);

// Refresh token
const newTokenData = await oauth.refreshAccessToken(refreshToken);
```

## OAuth Flow

### 1. Authorization URL
```
GET /oauth/authorize?client_id=xxx&redirect_uri=xxx&response_type=code&scope=openid+profile&state=xxx
```

### 2. User Authorization
User logs in and grants permission. Browser redirects to:
```
http://localhost:3000/callback?code=AUTH_CODE&state=xxx
```

### 3. Token Exchange
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
client_id=xxx&
client_secret=xxx&
redirect_uri=xxx&
code=AUTH_CODE
```

Response:
```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "scope": "openid profile"
}
```

## File Structure

```
├── package.json           # Project dependencies
├── .env.example          # Environment variables template
├── oauth.js              # OAuth client class
├── index.js              # Express server with web interface
├── test.js               # Console testing script
└── README.md             # This file
```

## Troubleshooting

### "Invalid client_id" Error
- Verify Client ID in `.env` is correct
- Check OrangeHRM OAuth application settings

### "Invalid redirect_uri" Error
- Ensure `REDIRECT_URI` matches the registered URI in OrangeHRM
- Common: `http://localhost:3000/callback`

### "Unauthorized client" Error
- Check Client Secret is correct
- Verify credentials have proper OAuth permissions

### Connection Refused
- Verify OrangeHRM instance URL is correct
- Check network connectivity to OrangeHRM

## Next Steps

1. Configure with your OrangeHRM credentials
2. Run `npm start` and test the OAuth flow
3. Once working, integrate into your application using the `oauth.js` class

## License

MIT
