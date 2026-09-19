import client from './client';

export async function signup({ email, username, password, name }) {
  const { data } = await client.post('/auth/signup', { email, username, password, name });
  return data.user;
}

// `identifier` can be either an email or a username — the server figures out which.
export async function login({ identifier, password }) {
  const { data } = await client.post('/auth/login', { identifier, password });
  return data.user;
}

export async function logout() {
  await client.post('/auth/logout');
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me');
  return data.user;
}
