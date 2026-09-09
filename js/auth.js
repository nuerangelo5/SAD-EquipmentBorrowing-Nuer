// Authentication functions

async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session.user;
}

async function login(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  if (error) {
    throw error;
  }
  return data;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

async function getCurrentUser() {
  const { data: { user } } = await sb.auth.getUser();
  return user;
}
