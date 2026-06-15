const API_URL = 'https://herman-cognisable-intensely.ngrok-free.dev';

// DOM ELEMENTS
const authScreen = document.getElementById('auth-screen');
const lookupScreen = document.getElementById('lookup-screen');
const signOutBtn = document.getElementById('sign-out-btn');
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

// AUTH TABS
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const authFeedback = document.getElementById('auth-feedback');

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

// HELPERS
function showScreen(screen) {
  authScreen.classList.add('hidden');
  lookupScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function showFeedback(message, type = 'success') {
  feedback.textContent = message;
  feedback.className = type;
  feedback.classList.remove('hidden');
  setTimeout(() => feedback.classList.add('hidden'), 3000);
}

function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function showAuthFeedback(message, type = 'error') {
  authFeedback.textContent = message;
  authFeedback.className = type;
  authFeedback.classList.remove('hidden');
}

// TOKEN
async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get('token', (result) => {
      resolve(result.token);
    });
  });
}

async function saveToken(token) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ token }, resolve);
  });
}

async function clearToken() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['token', 'userId'], resolve);
  });
}

// USER ID
async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get('userId', (result) => {
      resolve(result.userId);
    });
  });
}

async function saveUserId(userId) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ userId }, resolve);
  });
}

// API FETCH
async function apiFetch(endpoint, options = {}) {
  const token = await getToken();
  const userId = await getUserId();
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

// SIGN IN
document.getElementById('sign-in-btn').addEventListener('click', async () => {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if (!email || !password) return showAuthFeedback('Please fill in all fields');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      await saveToken(data.token);
      await saveUserId(data.userId);
      showScreen(lookupScreen);
      await loadBooks();
      checkForHighlightedText();
    } else {
      showAuthFeedback(data.message);
    }
  } catch (error) {
    showAuthFeedback('Connection failed. Is your server running?');
  }
});

// SIGN UP
document.getElementById('sign-up-btn').addEventListener('click', async () => {
  const firstName = document.getElementById('signup-firstname').value.trim();
  const lastName = document.getElementById('signup-lastname').value.trim();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (!firstName || !lastName || !username || !email || !password)
    return showAuthFeedback('Please fill in all fields');

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      await saveToken(data.token);
      await saveUserId(data.userId);
      showScreen(lookupScreen);
      await loadBooks();
      checkForHighlightedText();
    } else {
      showAuthFeedback(data.message);
    }
  } catch (error) {
    showAuthFeedback('Connection failed. Is your server running?');
  }
});

// SIGN OUT
signOutBtn.addEventListener('click', async () => {
  await clearToken();
  showScreen(authScreen);
});

// BOOKS
async function loadBooks() {
  try {
    const res = await apiFetch('/book');
    const books = await res.json();

    while (bookSelect.options.length > 1) {
      bookSelect.remove(1);
    }

    books.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = book.title;
      bookSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load books:', error);
  }
}

// WORD LOOKUP
lookupBtn.addEventListener('click', async () => {
  const text = wordInput.value.trim();
  if (!text) return;

  showLoading(true);
  resultSection.classList.add('hidden');

  try {
    const res = await apiFetch('/entry/lookup', {
      method: 'POST',
      body: JSON.stringify({ text, wantsExample: wantsExample.checked })
    });

    const data = await res.json();
    showLoading(false);

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
  } catch (error) {
    showLoading(false);
    showFeedback('Failed to look up word', 'error');
  }
});

// SAVE ENTRY
saveBtn.addEventListener('click', async () => {
  const text = wordInput.value.trim();
  const bookId = bookSelect.value || undefined;

  try {
    const res = await apiFetch('/entry', {
      method: 'POST',
      body: JSON.stringify({
        text,
        bookId,
        wantsExample: wantsExample.checked
      })
    });

    if (res.ok) {
      showFeedback('Word saved! 🎉', 'success');
      resultSection.classList.add('hidden');
      wordInput.value = '';
    } else {
      const data = await res.json();
      showFeedback(data.message || 'Failed to save word', 'error');
    }
  } catch (error) {
    showFeedback('Failed to save word', 'error');
  }
});

// HIGHLIGHTED TEXT
function checkForHighlightedText() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_SELECTION' }, (response) => {
      if (response?.text) {
        wordInput.value = response.text.trim();
      }
    });
  });
}

// INIT
async function init() {
  const token = await getToken();
  if (token) {
    showScreen(lookupScreen);
    await loadBooks();
    checkForHighlightedText();
  } else {
    showScreen(authScreen);
  }
}

// START
init();