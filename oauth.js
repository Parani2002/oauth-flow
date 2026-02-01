require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

class OrangeHRMOAuth {
  constructor() {
    this.baseURL = process.env.ORANGEHRM_BASE_URL;
    this.clientId = process.env.ORANGEHRM_CLIENT_ID;
    this.clientSecret = process.env.ORANGEHRM_CLIENT_SECRET;
    this.redirectUri = process.env.REDIRECT_URI;
  }

  /**
   * Generate the authorization URL
   * User should be redirected to this URL to authorize the application
   */
  getAuthorizationUrl(state = null) {
    if (!state) {
      state = Math.random().toString(36).substring(7);
    }

    const params = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      state: state,
    };

    const authUrl = `${this.baseURL}/oauth2/authorize?${querystring.stringify(params)}`;
    console.log('Authorization URL:', authUrl);
    return authUrl;
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from callback
   * @returns {Promise} Token response with access_token, refresh_token, etc.
   */
  async getAccessToken(code) {
    try {
      const tokenUrl = `${this.baseURL}/oauth2/token`;
      
      const payload = {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: code
      };

      console.log('\nExchanging authorization code for access token...');
      console.log('Token URL:', tokenUrl);

      const response = await axios.post(tokenUrl, querystring.stringify(payload), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      console.log('\n✓ Access Token Response:');
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('\n✗ Error exchanging code for token:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token from previous token response
   * @returns {Promise} New token response
   */
  async refreshAccessToken(refreshToken) {
    try {
      const tokenUrl = `${this.baseURL}/oauth/token`;
      
      const payload = {
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      };

      console.log('\nRefreshing access token...');

      const response = await axios.post(tokenUrl, querystring.stringify(payload), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      console.log('\n✓ Refreshed Token Response:');
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('\n✗ Error refreshing token:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  }
}

module.exports = OrangeHRMOAuth;
