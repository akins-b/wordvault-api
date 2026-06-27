async function loadStats() {
  try {
    const res = await apiFetch('/user/stats');
    const { totalWords, mastered, streak } = await res.json();
    document.getElementById('stat-total').textContent = totalWords;
    document.getElementById('stat-mastered').textContent = mastered;
    document.getElementById('stat-streak').textContent = streak;
  } catch (err) {
    console.error('Stats error:', err);
  }
}

async function loadRecentEntries() {
  try {
    const res = await apiFetch('/entry');
    const entries = await res.json();
    const container = document.getElementById('recent-entries');

    if (entries.length === 0) {
      container.innerHTML = `<div style="text-align:center;color:var(--text-secondary);padding:20px;font-size:14px">No words saved yet. Look up your first word!</div>`;
      return;
    }

    const recent = entries.slice(-5).reverse();
    container.innerHTML = recent.map(entry => `
      <div class="word-card">
        <div>
          <div class="word-card-title">${entry.text}</div>
          <div class="word-card-def">${entry.definition}</div>
          ${entry.mastered ? '<span class="word-card-tag">Mastered</span>' : ''}
        </div>
        <span class="material-symbols-outlined" style="color:var(--text-secondary);font-size:20px">
          ${entry.mastered ? 'bookmark' : 'bookmark_border'}
        </span>
      </div>
    `).join('');
  } catch (err) {
    console.error('Entries error:', err);
  }
}


document.getElementById('go-lookup-btn').addEventListener('click', () => {
  window.location.href = 'lookup.html';
});

document.getElementById('nav-home').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

document.getElementById('nav-vault').addEventListener('click', () => {
  window.location.href = 'vault.html';
});

document.getElementById('nav-settings').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

document.getElementById('logout-btn').addEventListener('click', () => {
  clearAuth();
  window.location.href = 'popup.html';
});


function init() {
  const token = getToken();
  if (!token) {
    window.location.href = 'popup.html';
    return;
  }
  loadStats();
  loadRecentEntries();
}

init();