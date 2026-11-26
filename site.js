(() => {
  const form = document.getElementById('brief');
  const status = document.getElementById('form-status');
  let sending = false;
  const mobileCta = document.querySelector('.mobile-cta');
  let formVisible = false;
  const syncCta = () => {
    mobileCta.hidden = formVisible || form.contains(document.activeElement);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      formVisible = entry.isIntersecting;
      syncCta();
    }).observe(form);
  }
  form.elements.contact.addEventListener('input',()=>form.elements.contact.setCustomValidity(''));
  form.addEventListener('focusin', syncCta);
  form.addEventListener('focusout', () => requestAnimationFrame(syncCta));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const contact=form.elements.contact;
    contact.value=contact.value.trim();contact.setCustomValidity(contact.value.length<3?'Укажите Telegram, телефон или другой контакт для ответа.':'');
    if (sending || !form.reportValidity()) return;
    if (!form.dataset.endpoint) {
      status.textContent = 'Форма пока не подключена. Напишите мне напрямую в Telegram по ссылке рядом.';
      return;
    }
    status.classList.remove('is-success');
    sending = true;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Отправляем заявку…';
    try {
      const snapshot = Object.fromEntries(new FormData(form));
      const data = {...snapshot};
      if (data.service) data.task = '[' + data.service + '] ' + (data.task || '');
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('send failed');
      const unchanged=Object.entries(snapshot).every(([key,value])=>form.elements[key]?.value===value);
      if(unchanged){form.reset();form.elements.service.value=snapshot.service;}
      status.classList.add('is-success');
      status.textContent = 'Заявка отправлена! Лёва свяжется с вами по указанному контакту.'+(unchanged?'':' Изменения, сделанные во время отправки, оставлены в форме.');
    } catch {
      status.textContent = 'Не удалось подтвердить отправку. Ваши данные сохранены в форме. Попробуйте позже или напишите мне в Telegram.';
    } finally {
      sending = false;
      button.disabled = false;
    }
  });
})();
