// auth.js
const { auth } = require('express-openid-connect');
console.log(process.env.BASE_URL);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.BASE_URL || 'http://localhost:5173',
  clientID: process.env.AUTH0_CLIENT_ID || 'UfyHRaP6qgLCz6CRDXgtSRB0vBYdbp7P',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-d7u1nvmex7yyfut7.us.auth0.com'
};

module.exports = auth(config);
