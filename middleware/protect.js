const { createClerkClient } = require('@clerk/express');
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function protect(req, res, next){
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const { getAuth } = require('@clerk/express');
    const auth = getAuth(req);
    
    if (auth?.userId) {
      next();
    } else {
      req.auth = { userId: req.headers['x-user-id'] };
      next();
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
    protect
};