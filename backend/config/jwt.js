module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'keyboardcat',
  tokenExpiry: '7d'
};
