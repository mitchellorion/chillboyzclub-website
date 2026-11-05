const loginForm = document.getElementById('login-form');
const uploadPanel = document.getElementById('upload-panel');
const uploadForm = document.getElementById('upload-form');
const logoutButton = document.getElementById('logout');

async function checkAuth() {
  const response = await fetch('/api/status');
  const data = await response.json();
  if (data.authenticated) {
    loginForm.classList.add('hidden');
    uploadPanel.classList.remove('hidden');
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const password = formData.get('password');

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (data.ok) {
    loginForm.classList.add('hidden');
    uploadPanel.classList.remove('hidden');
  } else {
    alert('Incorrect password');
  }
});

uploadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.ok) {
    alert(`Uploaded ${data.uploaded} item(s)`);
    uploadForm.reset();
    window.location.href = '/';
  }
});

logoutButton?.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  uploadPanel.classList.add('hidden');
  loginForm.classList.remove('hidden');
  loginForm.reset();
});

checkAuth();
