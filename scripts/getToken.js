// scripts/getToken.js
require('dotenv').config();
const { createClerkClient } = require('@clerk/express');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function getToken() {
  // ✅ get user id from your DB or Clerk dashboard
  const userId = 'user_3EVFTjsiiwZbuQXL0Vpb3Xk2eDg'; // your actual user id

  // ✅ create a fresh session
  const signInToken = await clerk.signInTokens.createSignInToken({
    userId,
    expiresInSeconds: 3600
  });

  console.log('🔑 Sign in token:', signInToken.token);
  console.log('\nUse this URL to sign in and get a session token:');
  console.log(`https://current-whippet-53.accounts.dev/?__clerk_ticket=${signInToken.token}`);
}

getToken().catch(console.error);