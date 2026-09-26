const { Clerk } = require('@clerk/clerk-js');

const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY);
await clerk.load();

// get token to send to your backend
const token = await clerk.session.getToken();
console.log(`token: ${token}`);

// use it in API calls
const res = await fetch('https://yourapi.com/books', {
  headers: { Authorization: `Bearer ${token}` }
});


// extension popup.js
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.VAPID_PUBLIC_KEY
  });

  // send subscription to your backend
  await apiFetch('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
}