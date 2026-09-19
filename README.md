# Web App Scaffold

A minimal full-stack starter: **React (Vite) + Node/Express + MongoDB**, with just
login / signup / logout wired up end-to-end, and a placeholder home page. Structured
so you can build a real product on top of it.

```
scaffold/
├── client/     React app (Vite, plain JS)
└── server/     Express API (MongoDB via Mongoose)
```

## Quick start

### 1. MongoDB
Run MongoDB locally (`mongod`) or use a free Atlas cluster — you just need a connection string.

### 2. Server
```bash
cd server
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:5000
```

### 3. Client
```bash
cd client
cp .env.example .env   # defaults to the server above
npm install
npm run dev             # http://localhost:5173
```

Open http://localhost:5173 — you'll land on the placeholder home page, with
links to sign up / log in. Once logged in, the home page shows your name and
a logout button.

## How auth works

- Every user has both an `email` and a unique `username`. Signup requires
  both; **login accepts either one** — the client sends whatever the user
  typed as `identifier`, and the server checks for an `@` to decide whether
  to look it up by email or username.
- Passwords are hashed with `bcrypt` before being stored.
- On signup/login the server signs a JWT and sets it as an **httpOnly cookie**
  (`token`) — the client never touches the token directly, so it isn't
  exposed to XSS.
- `withCredentials: true` on the client's axios instance makes sure that
  cookie is sent with every request.
- `GET /api/auth/me` is how the client checks "am I logged in?" on page load.
- `authenticate` middleware protects any route you add later — just import
  it and drop it in front of a route.

## Email verification (not enabled by default)

The scaffold currently logs a user in immediately after signup, with no
verification step. A full email-verification flow is written but commented
out, so you can turn it on later:

- `server/src/models/User.js` — `isVerified` / `verificationToken` /
  `verificationTokenExpires` fields
- `server/src/services/auth.service.js` — `generateVerificationToken()`
- `server/src/controllers/auth.controller.js` — verification block inside
  `signup()`, plus `verifyEmail()` and `resendVerification()`
- `server/src/routes/auth.routes.js` — `POST /verify-email` and
  `POST /resend-verification`

To enable it: uncomment those blocks, add a `verifyEmail` check inside
`login()` (also commented, right below the password check), and wire up
an actual email service (e.g. `nodemailer` or a provider API) — sending
email isn't included in this scaffold.

## Where to build from here

- `server/src/models` — add your own Mongoose models next to `User.js`.
- `server/src/routes` + `controllers` — add feature routes the same way
  `auth.routes.js` / `auth.controller.js` are wired into `app.js`.
- `client/src/pages` — add pages, then register them in
  `client/src/AppRoutes/AppRoutes.jsx`.
- Wrap any route that needs a logged-in user with `<ProtectedRoute>` the way
  `/home` optionally could be (see comments in `AppRoutes.jsx`).
