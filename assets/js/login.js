const API = 'api';

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Check if already logged in
  fetch(API + '/auth/me').then(r => r.json()).then(data => {
    if (data.role === 'admin') window.location.href = 'index.html';
    else if (data.role === 'user') window.location.href = 'user.html';
  }).catch(() => {});

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-login');
    const errEl = document.getElementById('login-error');
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Memproses...';

    try {
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.role === 'admin') window.location.href = 'index.html';
      else window.location.href = 'user.html';
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Masuk';
    }
  });
});
