const fs = require('fs');

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    require('dotenv').config();
  } catch (e) {
  }
}

const apiUrl = process.env.API_URL || 'http://localhost:3006';
const clerkKey = process.env.CLERK_PUBLISHABLE_KEY;

const content = `const API_URL = '${apiUrl}';
const CLERK_PUBLISHABLE_KEY = '${clerkKey}';\n`;

fs.writeFileSync('./config.js', content);