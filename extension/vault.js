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

let allEntries = [];

function renderEntries(entries) {
  const container = document.getElementById('vault-entries');

  if (entries.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-secondary);padding:20px;font-size:14px">No words found.</div>`;
    return;
  }

  container.innerHTML = entries.map(entry => `
    <div class="word-card" data-id="${entry.id}">
      <div style="flex:1">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
          <span class="word-card-title">${entry.text}</span>
        </div>
        <p class="word-card-def">${entry.definition}</p>
      </div>
      <label class="mastered-label" title="Mark as mastered">
        <input type="checkbox" class="mastered-checkbox" data-id="${entry.id}" ${entry.mastered ? 'checked' : ''} />
        <div class="mastered-box">
          <span class="material-symbols-outlined icon-filled" style="font-size:16px;color:var(--accent-text);${entry.mastered ? '' : 'display:none'}">check</span>
        </div>
      </label>
    </div>
  `).join('');


  container.querySelectorAll('.mastered-checkbox').forEach(cb => {
    cb.addEventListener('change', async () => {
      const id = cb.dataset.id;
      const mastered = cb.checked;
      try {
        await apiFetch(`/entry/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ mastered })
        });

        const entry = allEntries.find(e => e.id === id);
        if (entry) entry.mastered = mastered;
        updateStats();
      } catch (err) {
        console.error('Update error:', err);
      }
    });
  });
}

function updateStats() {
  document.getElementById('vault-total').textContent = allEntries.length;
  document.getElementById('vault-mastered').textContent = allEntries.filter(e => e.mastered).length;
}

async function loadEntries() {
  try {
    const res = await apiFetch('/entry');
    allEntries = await res.json();
    renderEntries(allEntries);
    updateStats();
  } catch (err) {
    console.error('Entries error:', err);
  }
}


document.getElementById('search-input').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = allEntries.filter(entry =>
    entry.text.toLowerCase().includes(q) ||
    entry.definition.toLowerCase().includes(q)
  );
  renderEntries(filtered);
});

document.getElementById('logout-btn').addEventListener('click', () => {
  chrome.storage.local.remove(['token', 'userId'], () => {
    window.location.href = 'popup.html';
  });
});

async function init() {
  const token = await getToken();
  if (!token) { window.location.href = 'popup.html'; return; }
  await loadEntries();
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