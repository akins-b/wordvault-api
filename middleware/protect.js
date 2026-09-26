const { getAuth } = require('@clerk/express');

async function protect(req, res, next) {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({ message: 'Unauthorized: No valid session' });
    }

    req.userId = auth.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = { protect };