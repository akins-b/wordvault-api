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

const loadClerk = async () => {
  if (!window.Clerk) {
    const script = document.createElement('script');
    script.src = 'https://current-whippet-53.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    while (!window.Clerk) await new Promise(r => setTimeout(r, 50));
  }
  if (!window.Clerk.isReady) {
    try {
      await window.Clerk.load({ publishableKey: CLERK_PUBLISHABLE_KEY });
    } catch(e) {}
  }
};

async function apiFetch(endpoint, options = {}) {
  let token = getToken();
  try {
    if (navigator.onLine !== false) {
      await loadClerk();
      if (window.Clerk && window.Clerk.session) {
        token = await window.Clerk.session.getToken();
        if (token) saveToken(token);
      }
    }
  } catch (e) {
    console.warn("Could not refresh clerk token", e);
  }

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