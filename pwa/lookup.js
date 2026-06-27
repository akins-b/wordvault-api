const wordInput = document.getElementById('word-input');
const lookupBtn = document.getElementById('lookup-btn');
const resultSection = document.getElementById('result-section');
const resultWord = document.getElementById('result-word');
const resultDefinition = document.getElementById('result-definition');
const resultExample = document.getElementById('result-example');
const resultSynonyms = document.getElementById('result-synonyms');
const resultAntonyms = document.getElementById('result-antonyms');
const wantsExample = document.getElementById('wants-example');
const bookSelect = document.getElementById('book-select');
const saveBtn = document.getElementById('save-btn');
const loading = document.getElementById('loading');
const feedback = document.getElementById('feedback');

async function loadBooks() {
  try {
    const res = await apiFetch('/book');
    const books = await res.json();
    books.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = book.title;
      bookSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Books error:', err);
  }
}

lookupBtn.addEventListener('click', async () => {
  const text = wordInput.value.trim();
  if (!text) return;

  loading.classList.remove('hidden');
  resultSection.classList.add('hidden');

  try {
    const res = await apiFetch('/entry/lookup', {
      method: 'POST',
      body: JSON.stringify({ text, wantsExample: wantsExample.checked })
    });

    const data = await res.json();
    loading.classList.add('hidden');

    resultWord.textContent = data.text || text;
    resultDefinition.textContent = data.definition;

    if (data.example) {
      resultExample.textContent = `"${data.example}"`;
      resultExample.classList.remove('hidden');
    } else {
      resultExample.classList.add('hidden');
    }

    resultSynonyms.innerHTML = data.synonyms?.map(s => `<span class="tag">${s}</span>`).join('') || '';
    resultAntonyms.innerHTML = data.antonyms?.map(a => `<span class="tag">${a}</span>`).join('') || '';

    resultSection.classList.remove('hidden');
  } catch (err) {
    loading.classList.add('hidden');
    console.error('Lookup error:', err);
  }
});

saveBtn.addEventListener('click', async () => {
  const text = wordInput.value.trim();
  const bookId = bookSelect.value || undefined;

  try {
    const res = await apiFetch('/entry', {
      method: 'POST',
      body: JSON.stringify({ text, bookId, wantsExample: wantsExample.checked })
    });

    if (res.ok) {
      feedback.textContent = 'Word saved! 🎉';
      feedback.className = 'feedback success';
      feedback.classList.remove('hidden');
      setTimeout(() => feedback.classList.add('hidden'), 3000);
    } else {
      const data = await res.json();
      feedback.textContent = data.message || 'Failed to save';
      feedback.className = 'feedback error';
      feedback.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Save error:', err);
  }
});


document.getElementById('back-btn').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
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
  if (!token) { window.location.href = 'popup.html'; return; }
  loadBooks();
}

init();