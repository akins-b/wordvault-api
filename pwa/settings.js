async function init() {
  const token = getToken();
  if (!token) { 
    window.location.href = 'popup.html'; 
    return; 
  }

  try {
    const userId = getUserId();
    const res = await apiFetch(`/user/${userId}`);
    const user = await res.json();

    populateProfile(user);
    populatePreferences(user);
  } catch (err) {
    console.error('Initialization error:', err);
  }
}

function populateProfile(user) {
  const nameEl = document.getElementById('settings-name');
  if (nameEl) {
    nameEl.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
  }
  
  const emailEl = document.getElementById('settings-email');
  if (emailEl) emailEl.textContent = user.email;

  const avatarEl = document.getElementById('avatar');
  if (avatarEl) {
    avatarEl.textContent = (user.firstName?.[0] || user.username?.[0] || '?').toUpperCase();
  }
}

function populatePreferences(user) {
  const weeklyToggle = document.getElementById('weekly-toggle');
  const pushToggle = document.getElementById('push-toggle');

  if (weeklyToggle) weeklyToggle.checked = !!user.weeklyEmailEnabled;
  if (pushToggle) pushToggle.checked = !!user.pushEnabled;
}

async function savePreference(key, value) {
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

// Event Listeners for Navigation & Auth
document.getElementById('nav-home')?.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

document.getElementById('nav-vault')?.addEventListener('click', () => {
  window.location.href = 'vault.html';
});

document.getElementById('nav-settings')?.addEventListener('click', () => {
  window.location.href = 'settings.html';
});

document.getElementById('logout-btn')?.addEventListener('click', signOut);
document.getElementById('signout-btn')?.addEventListener('click', signOut);

function signOut() {
  clearAuth();
  window.location.href = 'popup.html';
}

// Toggle Listeners
document.getElementById('weekly-toggle')?.addEventListener('change', (e) => {
  savePreference('weeklyEmailEnabled', e.target.checked);
});

document.getElementById('push-toggle')?.addEventListener('change', async (e) => {
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
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // Ensure this is converted to a Uint8Array if required by your setup
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

init();