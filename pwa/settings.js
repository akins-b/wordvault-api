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

async function loadPreferences(){
  try {
    const userId = getUserId();
    const res = await apiFetch(`/user/${userId}`);
    const user = await res.json();

    document.getElementById('weekly-toggle').checked = user.weeklyEmailEnabled;
    document.getElementById('push-toggle').checked = user.pushEnabled;
  } catch (error) {
    console.error('Preferences error:', error);
  }
}

async function savePreferences() {
  try {
    await apiFetch('/user/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ [key]: value })
    });
    console.log('Preferences saved successfully');
  } catch (error) {
    console.error('Preferences error:', error);
  }
  
} 

document.getElementById('weekly-toggle').addEventListener('change', (e) => {
  savePreference('weeklyEmailEnabled', e.target.checked);
});

document.getElementById('push-toggle').addEventListener('change', async (e) => {
  if (e.target.checked) {
    await subscribeToPush();
  }
  savePreference('pushEnabled', e.target.checked);
});

async function subscribeToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
    });

    await apiFetch('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    });
    console.log('Push subscription saved');
  } catch (err) {
    console.error('Push subscription error:', err);
  }
}

async function init() {
  const token = getToken();
  if (!token) { window.location.href = 'popup.html'; return; }
  await loadProfile();
  await loadPreferences();
}


init();