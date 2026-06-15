const { createClerkClient } = require('@clerk/express');
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { data: users } = await clerk.users.getUserList({
      emailAddress: [email]
    });

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    const { verified } = await clerk.users.verifyPassword({
      userId: user.id,
      password
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 604800
    });

    res.json({ token: signInToken.token, userId: user.id });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: 'Invalid email or password' });
  }
}

async function register(req, res) {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    await clerk.users.createUser({
      emailAddress: [email],
      password,
      username,
      firstName,
      lastName,
    });

    const { data: users } = await clerk.users.getUserList({
      emailAddress: [email]
    });

    const user = users[0];

    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 604800
    });

    res.status(201).json({ token: signInToken.token, userId: user.id });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { login, register };