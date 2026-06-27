function getToken() {
  return localStorage.getItem('token');
}

function saveToken(token) {
  localStorage.setItem('token', token);
}

function getUserId() {
  return localStorage.getItem('userId');
}

function saveUserId(userId) {
  localStorage.setItem('userId', userId);
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const userId = getUserId();
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId,
      ...options.headers
    }
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err));
  });
}