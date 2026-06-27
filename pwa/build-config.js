require('dotenv').config();
const fs = require('fs');

const apiUrl = process.env.API_URL || 'http://localhost:3006';

const content = `const API_URL = '${apiUrl}';\n`;

fs.writeFileSync('./config.js', content);
console.log(`config.js generated with API_URL=${apiUrl}`);