async function loadProfile() {
  try {
    const userId = getUserId();
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


document.getElementById('nav-home').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

document.getElementById('nav-vault').addEventListener('click', () => {
  window.location.href = 'vault.html';
});

document.getElementById('nav-settings').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

document.getElementById('logout-btn').addEventListener('click', signOut);
document.getElementById('signout-btn').addEventListener('click', signOut);

function signOut() {
  clearAuth();
  window.location.href = 'popup.html';
}


function init() {
  const token = getToken();
  if (!token) { window.location.href = 'popup.html'; return; }
  loadProfile();
}

init();