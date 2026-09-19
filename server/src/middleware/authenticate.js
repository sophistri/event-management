import jwt from 'jsonwebtoken';

// Protects a route: reads the httpOnly "token" cookie, verifies it, and
// attaches req.userId. Use this on any route that should require login.
export function authenticate(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}
