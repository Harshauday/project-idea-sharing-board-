
const config = {
  jwtSecret: process.env.JWT_SECRET || 'keyboardcat',
  tokenExpiry: '7d'
};

module.exports = config;
