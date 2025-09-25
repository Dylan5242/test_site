// main.js
// Подключается с defer, поэтому DOM уже загружен
(() => {
    // Получаем элементы
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    const phone = document.getElementById('phone');

    // Для возврата фокуса туда, откуда открыли модалку
    let lastActiveElement = null;

    // ---------------------
    // Открытие модалки
    // ---------------------
    openBtn?.addEventListener('click', () => {
        // Сохраняем элемент, который был активен до открытия модалки
        lastActiveElement = document.activeElement;

        // Если браузер поддерживает <dialog>.showModal() — используем его
        if (typeof dlg?.showModal === 'function') {
            dlg.showModal();
        } else {
            // Если нет — graceful fallback (показать простое окно, можно улучшить)
            // В простейшем варианте — alert (неидеально), в реальном проекте можно добавить "ручную" модалку.
            alert('В вашем браузере не поддерживается <dialog>. Форма откроется отдельно.');
            return;
        }

        // Ставим фокус в первое поле ввода внутри формы (для удобства)
        dlg.querySelector('input, select, textarea, button')?.focus();
    });

    // ---------------------
    // Закрытие модалки
    // ---------------------
    closeBtn?.addEventListener('click', () => {
        // Закрываем с причной 'cancel'
        dlg?.close('cancel');
    });

    // При закрытии модалки — возвращаем фокус на элемент, который был активен
    dlg?.addEventListener('close', () => {
        // Если закрыто с меткой 'success', можно показать сообщение (в данном примере покажем alert)
        if (dlg.returnValue === 'success') {
            // В реальном проекте лучше показывать ненавязчивый статус в DOM
            // alert('Сообщение отправлено. Спасибо!');
            // для UX можно показать ненавязчивый баннер — здесь оставим комментарий.
        }
        // Возвращаем фокус
        lastActiveElement?.focus?.();
    });

    // ---------------------
    // Обработка отправки формы (Constraint Validation API)
    // ---------------------
    form?.addEventListener('submit', (e) => {
        // 1) Сбросим кастомные сообщения
        [...form.elements].forEach(el => el.setCustomValidity?.(''));

        // 2) Проверим валидность - если не валидна, покажем подсказки
        if (!form.checkValidity()) {
            e.preventDefault(); // не закрываем форму

            // Пример кастомного сообщения для email
            const email = form.elements['email'];
            if (email && email.validity && email.validity.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }

            // Пример кастомного сообщения для телефона (если нужно)
            const phoneInput = form.elements['phone'];
            if (phoneInput && phoneInput.validity && phoneInput.validity.patternMismatch) {
                phoneInput.setCustomValidity('Телефон должен быть в формате +7 (900) 000-00-00');
            }

            // Показываем браузерные подсказки
            form.reportValidity();

            // Доступность: пометим проблемные поля aria-invalid="true"
            [...form.elements].forEach(el => {
                if (el.willValidate) {
                    el.toggleAttribute('aria-invalid', !el.checkValidity());
                }
            });

            return; // выход — пользователь должен исправить поля
        }

        // 3) Если всё валидно — имитируем отправку (на практике отправляйте через fetch)
        e.preventDefault();

        // Пример: имитация запроса на сервер (здесь мгновенно)
        // Можно отправлять formData: const fd = new FormData(form);
        // fetch('/send', {method: 'POST', body: fd})...

        form.reset();              // очистим поля
        dlg?.close('success');     // закроем модалку, вернётся dlg.returnValue === 'success'
        // Можно тут показать ненавязчивое сообщение об успехе
        // Например: показать баннер, toast, или вставить DOM-элемент с role="status"
        // Для простоты используем alert (но в реальном UI — избегайте alert)
        setTimeout(() => {
            // Немного задерживаем, чтобы закрытие прошло и фокус вернулся
            alert('Спасибо! Вашесообщение отправлено.'); //нет...
        }, 100);
    });

    // ---------------------
    // Лёгкая маска телефона (ввод и нормализация)
    // ---------------------
    phone?.addEventListener('input', () => {
        // Берём только цифры, ограничиваем до 11 (например: 7 + 10 цифр)
        let digits = phone.value.replace(/\D/g, '').slice(0, 11);

        // Нормализуем: если пользователь вводит 8 в начале, заменим на 7
        digits = digits.replace(/^8/, '7');

        // Формируем части для отображения: +7 (xxx) xxx-xx-xx
        const parts = [];
        if (digits.length > 0) parts.push('+7');
        if (digits.length >= 2) parts.push(' (' + digits.slice(1, 4) + ')');
        if (digits.length >= 5) parts.push(' ' + digits.slice(4, 7));
        if (digits.length >= 8) parts.push('-' + digits.slice(7, 9));
        if (digits.length >= 10) parts.push('-' + digits.slice(9, 11));

        phone.value = parts.join('');
    });

    // При желании можно дополнительно навесить blur-валидацию, подсказки и т.д.
})();