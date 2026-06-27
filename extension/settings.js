async function getToken() {
  return new Promise(resolve => chrome.storage.local.get('token', r => resolve(r.token)));
}

async function getUserId() {
  return new Promise(resolve => chrome.storage.local.get('userId', r => resolve(r.userId)));
}

async function apiFetch(endpoint, options = {}) {
  const token = await getToken();
  const userId = await getUserId();
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId,
      'ngrok-skip-browser-warning': 'true',
      ...options.headers
    }
  });
}

async function loadProfile() {
  try {
    const userId = await getUserId();
    const res = await apiFetch(`/user/${userId}`);
    const user = await res.json();

    document.getElementById('settings-name').textContent =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
    document.getElementById('settings-email').textContent = user.email;
    document.getElementById('avatar').textContent =
      (user.firstName?.[0] || user.username?.[0] || '?').toUpperCase();
  } catch (err) {
    console.error('Profile error:', err);
  }
}

document.getElementById('logout-btn').addEventListener('click', signOut);
document.getElementById('signout-btn').addEventListener('click', signOut);

function signOut() {
  chrome.storage.local.remove(['token', 'userId'], () => {
    window.location.href = 'popup.html';
  });
}

async function init() {
  const token = await getToken();
  if (!token) { window.location.href = 'popup.html'; return; }
  await loadProfile();
}

init();


document.getElementById('nav-home')?.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
document.getElementById('nav-vault')?.addEventListener('click', () => {
  window.location.href = 'vault.html';
});
document.getElementById('nav-settings')?.addEventListener('click', () => {
  window.location.href = 'settings.html';
});