import User from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../services/auth.service.js';
// import { generateVerificationToken } from '../services/auth.service.js';
// import { sendVerificationEmail } from '../services/email.service.js'; // not included in this scaffold

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function toPublicUser(user) {
  return { id: user._id, email: user.email, username: user.username, name: user.name };
}

export async function signup(req, res) {
  const { email, username, password, name } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    return res.status(409).json({ error: `An account with this ${field} already exists` });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, username, passwordHash, name });

  // --- Email verification (uncomment to enable) ---
  // Also uncomment the isVerified/verificationToken fields on the User model,
  // the isVerified check in login() below, and the routes in auth.routes.js.
  //
  // const verificationToken = generateVerificationToken();
  // user.verificationToken = verificationToken;
  // user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  // await user.save();
  // await sendVerificationEmail(user.email, verificationToken);
  // return res.status(201).json({ message: 'Account created. Check your email to verify.' });

  const token = generateToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  res.status(201).json({ user: toPublicUser(user) });
}

// --- Email verification (uncomment to enable) ---
// export async function verifyEmail(req, res) {
//   const { token } = req.body;
//
//   const user = await User.findOne({
//     verificationToken: token,
//     verificationTokenExpires: { $gt: Date.now() },
//   });
//
//   if (!user) {
//     return res.status(400).json({ error: 'Invalid or expired verification link' });
//   }
//
//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationTokenExpires = undefined;
//   await user.save();
//
//   res.json({ message: 'Email verified. You can now log in.' });
// }
//
// export async function resendVerification(req, res) {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//
//   // don't reveal whether the account exists — same response either way
//   if (!user || user.isVerified) {
//     return res.json({ message: 'If an unverified account exists for that email, a new link has been sent.' });
//   }
//
//   const verificationToken = generateVerificationToken();
//   user.verificationToken = verificationToken;
//   user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
//   await user.save();
//   await sendVerificationEmail(user.email, verificationToken);
//
//   res.json({ message: 'If an unverified account exists for that email, a new link has been sent.' });
// }

export async function login(req, res) {
  const { identifier, password } = req.body;

  // Let people log in with either their email or their username.
  const isEmail = identifier.includes('@');
  const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // --- Email verification (uncomment to enable) ---
  // if (!user.isVerified) {
  //   return res.status(403).json({ error: 'Please verify your email before logging in' });
  // }

  const token = generateToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  res.json({ user: toPublicUser(user) });
}

export async function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTS);
  res.json({ message: 'Logged out' });
}

export async function me(req, res) {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: toPublicUser(user) });
}
