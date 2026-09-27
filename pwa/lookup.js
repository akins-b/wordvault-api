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
const newBookUi = document.getElementById('new-book-ui');
const newBookInput = document.getElementById('new-book-input');
const createBookBtn = document.getElementById('create-book-btn');
const cancelBookBtn = document.getElementById('cancel-book-btn');

async function loadBooks() {
  try {
    const res = await apiFetch('/book');
    const books = await res.json();
    
    // Clear existing options except the first one
    bookSelect.innerHTML = '<option value="">No book (save standalone)</option>';
    
    books.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = book.title;
      bookSelect.appendChild(option);
    });

    const createOption = document.createElement('option');
    createOption.value = '_new';
    createOption.textContent = '+ Create New Book...';
    bookSelect.appendChild(createOption);
  } catch (err) {
    console.error('Books error:', err);
  }
}

bookSelect.addEventListener('change', (e) => {
  if (e.target.value === '_new') {
    bookSelect.classList.add('hidden');
    newBookUi.classList.remove('hidden');
    newBookInput.focus();
  }
});

cancelBookBtn.addEventListener('click', () => {
  bookSelect.value = '';
  newBookUi.classList.add('hidden');
  bookSelect.classList.remove('hidden');
  newBookInput.value = '';
});

createBookBtn.addEventListener('click', async () => {
  const title = newBookInput.value.trim();
  if (!title) return;
  
  const originalText = createBookBtn.textContent;
  createBookBtn.textContent = '...';
  createBookBtn.disabled = true;

  try {
    const res = await apiFetch('/book', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    
    if (res.ok) {
      const newBook = await res.json();
      const option = document.createElement('option');
      const bookData = newBook.book || newBook;
      option.value = bookData.id;
      option.textContent = bookData.title;
      
      bookSelect.insertBefore(option, bookSelect.lastChild);
      bookSelect.value = bookData.id;
      
      newBookUi.classList.add('hidden');
      bookSelect.classList.remove('hidden');
      newBookInput.value = '';
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to create book');
    }
  } catch (err) {
    console.error('Create book error:', err);
    alert('Network error while creating book');
  } finally {
    createBookBtn.textContent = originalText;
    createBookBtn.disabled = false;
  }
});

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

  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled = true;
  feedback.classList.add('hidden');

  try {
    const res = await apiFetch('/entry', {
      method: 'POST',
      body: JSON.stringify({ text, bookId, wantsExample: wantsExample.checked })
    });

    if (res.ok) {
      window.location.href = 'vault.html';
    } else {
      const data = await res.json();
      feedback.textContent = data.message || 'Failed to save';
      feedback.className = 'feedback error';
      feedback.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Save error:', err);
    feedback.textContent = 'Network error while saving';
    feedback.className = 'feedback error';
    feedback.classList.remove('hidden');
  } finally {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
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

document.getElementById('logout-btn').addEventListener('click', async () => {
  await clearAuth();
  window.location.href = 'popup.html';
});


function init() {
  const token = getToken();
  if (!token) { window.location.href = 'popup.html'; return; }
  loadBooks();
}

init();