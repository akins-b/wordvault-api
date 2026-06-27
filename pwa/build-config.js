const fs = require('fs');

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    require('dotenv').config();
  } catch (e) {
  }
}

const apiUrl = process.env.API_URL || 'http://localhost:3006';

const content = `const API_URL = '${apiUrl}';\n`;

fs.writeFileSync('./config.js', content);
console.log(`config.js generated with API_URL=${apiUrl}`);