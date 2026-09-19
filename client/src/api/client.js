import axios from 'axios';

// The JWT lives in an httpOnly cookie, so the browser sends it automatically —
// we just need withCredentials so the cookie is included cross-origin.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default client;
