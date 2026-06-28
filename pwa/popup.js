
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


document.getElementById('sign-in-btn').addEventListener('click', async () => {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if (!email || !password) return showAuthFeedback('Please fill in all fields');

  const btn = document.getElementById('sign-in-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      saveToken(data.token);
      saveUserId(data.userId);
      window.location.href = 'dashboard.html';
    } else {
      showAuthFeedback(data.message);
    }
  } catch (error) {
    showAuthFeedback('Connection failed. Is your server running?');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});


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
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      saveToken(data.token);
      saveUserId(data.userId);
      window.location.href = 'dashboard.html';
    } else {
      showAuthFeedback(data.message);
    }
  } catch (error) {
    showAuthFeedback('Connection failed. Is your server running?');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});


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