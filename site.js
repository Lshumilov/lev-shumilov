(() => {
  const form = document.getElementById('brief');
  const status = document.getElementById('form-status');
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    if (!form.dataset.endpoint) {
      status.textContent = 'Форма пока не подключена. Напишите мне напрямую в Telegram по ссылке рядом.';
      return;
    }
    sending = true;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('send failed');
      form.reset();
      status.textContent = 'Заявка отправлена! Лёва свяжется с вами по указанному контакту.';
    } catch {
      status.textContent = 'Не удалось подтвердить отправку. Ваши данные сохранены в форме. Попробуйте позже или напишите мне в Telegram.';
    } finally {
      sending = false;
      button.disabled = false;
    }
  });
})();
