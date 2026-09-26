const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const authFeedback = document.getElementById('auth-feedback');

const loadClerk = async () => {
  while (!window.Clerk) await new Promise(r => setTimeout(r, 50));
  if (!window.Clerk.isReady) {
    try {
      await window.Clerk.load({ publishableKey: CLERK_PUBLISHABLE_KEY });
    } catch(e) {}
  }
};

// --- GOOGLE OAUTH ---
document.getElementById('google-signin-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('google-signin-btn');
  btn.textContent = 'Redirecting...';
  btn.disabled = true;
  await loadClerk();
  await window.Clerk.client.signIn.authenticateWithRedirect({
    strategy: 'oauth_google',
    redirectUrl: window.location.href,
    redirectUrlComplete: window.location.href
  });
});

document.getElementById('google-signup-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('google-signup-btn');
  btn.textContent = 'Redirecting...';
  btn.disabled = true;
  await loadClerk();
  await window.Clerk.client.signUp.authenticateWithRedirect({
    strategy: 'oauth_google',
    redirectUrl: window.location.href,
    redirectUrlComplete: window.location.href
  });
});

// --- UI TABS ---
signinTab.addEventListener('click', () => {
  signinTab.classList.add('active');
  signupTab.classList.remove('active');
  signinForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  authFeedback.classList.add('hidden');
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  signinTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  signinForm.classList.add('hidden');
  authFeedback.classList.add('hidden');
});

function showAuthFeedback(message, type = 'error') {
  authFeedback.textContent = message;
  authFeedback.className = `auth-feedback ${type}`;
  authFeedback.classList.remove('hidden');
}

// --- EMAIL / PASSWORD SIGN IN (VIA CLERK) ---
document.getElementById('sign-in-btn').addEventListener('click', async () => {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if (!email || !password) return showAuthFeedback('Please fill in all fields');

  const btn = document.getElementById('sign-in-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  try {
    await loadClerk();
    const signInAttempt = await window.Clerk.client.signIn.create({
      identifier: email,
      password,
    });

    if (signInAttempt.status === 'complete') {
      await window.Clerk.setActive({ session: signInAttempt.createdSessionId });
      const clerkToken = await window.Clerk.session.getToken();
      saveToken(clerkToken);
      saveUserId(window.Clerk.user.id);
      window.location.href = 'dashboard.html';
    } else {
      showAuthFeedback('Additional verification required.');
    }
  } catch (error) {
    showAuthFeedback(error.errors?.[0]?.message || 'Sign in failed');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// --- EMAIL / PASSWORD SIGN UP (VIA CLERK) ---
document.getElementById('sign-up-btn').addEventListener('click', async () => {
  const firstName = document.getElementById('signup-firstname').value.trim();
  const lastName = document.getElementById('signup-lastname').value.trim();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (!firstName || !lastName || !username || !email || !password)
    return showAuthFeedback('Please fill in all fields');

  const btn = document.getElementById('sign-up-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Signing up...';
  btn.disabled = true;

  try {
    await loadClerk();
    const signUpAttempt = await window.Clerk.client.signUp.create({
      emailAddress: email,
      password,
      firstName,
      lastName,
      username,
    });

    if (signUpAttempt.status === 'complete') {
      await window.Clerk.setActive({ session: signUpAttempt.createdSessionId });
      const clerkToken = await window.Clerk.session.getToken();
      saveToken(clerkToken);
      saveUserId(window.Clerk.user.id);
      window.location.href = 'dashboard.html';
    } else {
      showAuthFeedback('Verification required to complete signup.');
    }
  } catch (error) {
    showAuthFeedback(error.errors?.[0]?.message || 'Sign up failed');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// --- INIT & SESSION CHECK ---
async function init() {
  const token = getToken();
  if (token) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  await loadClerk();
  if (window.Clerk.session) {
    const clerkToken = await window.Clerk.session.getToken();
    saveToken(clerkToken);
    saveUserId(window.Clerk.user.id);
    window.location.href = 'dashboard.html';
  }
}

init();

// --- STORAGE & API HELPERS ---
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

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err));
  });
}