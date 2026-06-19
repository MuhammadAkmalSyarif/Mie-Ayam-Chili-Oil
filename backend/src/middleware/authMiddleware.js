const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  // Simple mock token validation (matching what authController returns)
  if (!token.startsWith('mock-jwt-token-')) {
    return res.status(403).json({ success: false, message: 'Token tidak valid.' });
  }

  // In a real app, you would verify the JWT here and attach the user to the request
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = decoded;

  next();
};

module.exports = authMiddleware;
