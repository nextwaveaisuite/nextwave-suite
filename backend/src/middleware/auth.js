const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

const checkSubscriptionTier = (requiredTier) => {
  const tierLevels = {
    'free': 0,
    'trial': 1,
    'professional': 2,
    'expert': 3,
    'enterprise': 4
  };

  return (req, res, next) => {
    const userTier = req.user.tier;
    
    if (tierLevels[userTier] < tierLevels[requiredTier]) {
      return res.status(403).json({ 
        error: 'Subscription upgrade required',
        currentTier: userTier,
        requiredTier: requiredTier
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  checkSubscriptionTier
};
