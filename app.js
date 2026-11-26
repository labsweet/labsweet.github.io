/**
 * Configura aquí la URL de tu Web App de Google Apps Script para guardar
 * los correos y el registro auditable de consentimiento en Google Sheets.
 * Script listo para usar en: docs/apps_script_waitlist.gs
 */
const APPS_SCRIPT_WAITLIST_URL =
  'https://script.google.com/macros/s/AKfycby_8jwRw0znuB8kcB54cGiWZO0IpXKzqHr-SFu2lcyaQWiB_vLJdeJja7IEg4mX7nwC/exec';
const LEGAL_VERSIONS = {
  terms: '1.0',
  privacy: '1.0',
};

document.addEventListener('DOMContentLoaded', () => {
  initDesktopWindowTabs();
  initOfflineSyncDemo();
  initLegalModal();
  initWaitlistForm();
});

/**
 * Controla las pestañas interactivas de la ventana de SweetLab Desktop
 * con soporte de teclado (ArrowLeft, ArrowRight, Home, End) y sincronía con el sidebar.
 */
function initDesktopWindowTabs() {
  const tablist = document.querySelector('[role="tablist"]');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const sidebarItems = Array.from(document.querySelectorAll('[data-sync-nav]'));

  const selectTab = (targetTab, moveFocus = false) => {
    const panelId = targetTab.dataset.panel;

    tabs.forEach((tab) => {
      const isSelected = tab === targetTab;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isVisible = panel.id === panelId;
      panel.hidden = !isVisible;
      if (isVisible) {
        panel.tabIndex = 0;
      } else {
        panel.removeAttribute('tabindex');
      }
    });

    sidebarItems.forEach((item) => {
      item.classList.toggle('is-highlighted', item.dataset.syncNav === panelId);
    });

    if (moveFocus) {
      targetTab.focus();
    }
    targetTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));

    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        selectTab(tabs[nextIndex], true);
      }
    });
  });
}

/**
 * Demostración interactiva de la cola FIFO offline-first en la pestaña Modo Offline.
 */
function initOfflineSyncDemo() {
  const button = document.getElementById('simular-sync-btn');
  const badge = document.getElementById('offline-badge');
  const counter = document.getElementById('offline-counter');
  const states = Array.from(document.querySelectorAll('#sync-queue-list .queue-state'));
  if (!button || !badge || !counter || states.length === 0) return;

  let synced = false;

  button.addEventListener('click', () => {
    synced = !synced;
    if (synced) {
      badge.textContent = 'En línea · Bóveda sincronizada';
      badge.className = 'pastel-pill pastel-pill--mint';
      counter.textContent = 'sync_queue: 0 pendientes';
      button.textContent = 'Simular corte de red';
      states.forEach((el) => {
        el.dataset.state = 'synced';
        el.textContent = 'Sincronizado ✓';
      });
    } else {
      badge.textContent = 'Sin conexión · Guardando en bóveda';
      badge.className = 'pastel-pill pastel-pill--amber';
      counter.textContent = 'sync_queue: 3 pendientes';
      button.textContent = 'Simular reconexión';
      states.forEach((el) => {
        el.dataset.state = 'queued';
        el.textContent = 'En cola local (AES-256)';
      });
    }
  });
}

/**
 * Abre Términos y Condiciones y Política de Privacidad en un <dialog> modal nativo
 * dentro de la misma página, con cierre con Esc, botón o clic fuera (light-dismiss).
 */
function initLegalModal() {
  const dialog = document.getElementById('legal-modal');
  const titleEl = document.getElementById('legal-modal-title');
  const eyebrowEl = document.getElementById('legal-modal-eyebrow');
  const bodyEl = document.getElementById('legal-modal-body');
  const extLink = document.getElementById('legal-modal-external');
  const closeBtn = document.getElementById('legal-modal-close');
  if (!dialog || !titleEl || !eyebrowEl || !bodyEl || !extLink || !closeBtn) return;

  const LEGAL_DOCS = {
    terminos: {
      eyebrow: 'Versión 1.0 · Vigente desde 26 de noviembre de 2026 · Venezuela',
      title: 'Términos y Condiciones',
      url: 'terminos.html',
      html: `
        <p>Estos Términos y Condiciones regulan el acceso y uso del sitio web informativo y la lista de espera de <strong>SweetLab Desktop</strong>, de conformidad con la legislación de la República Bolivariana de Venezuela, incluyendo el Decreto con Fuerza de Ley sobre Mensajes de Datos y Firmas Electrónicas y el Código Civil venezolano.</p>
        <h2>1. Objeto del sitio</h2>
        <p>Este sitio web presenta información sobre la aplicación de escritorio <strong>SweetLab Desktop</strong> (Sistema de Información de Laboratorio Clínico — LIS) y permite registrar un correo electrónico en la lista de espera para recibir avisos sobre el acceso anticipado.</p>
        <h2>2. Registro en la lista de espera</h2>
        <p>El registro en la lista de espera es gratuito y no constituye un contrato de compraventa ni obliga al usuario a adquirir una licencia futura. Al enviar su correo, el usuario declara que es titular de dicha dirección o cuenta con autorización para registrarla.</p>
        <h2>3. Propiedad intelectual</h2>
        <p>El nombre, logotipo, diseño, textos, interfaces y código de SweetLab Desktop pertenecen a su titular. Queda prohibida su reproducción, distribución o uso comercial no autorizado.</p>
        <h2>4. Alcance y disponibilidad</h2>
        <p>Las vistas previas mostradas en este sitio son demostrativas del funcionamiento del software. Las funcionalidades finales, planes, precios y condiciones comerciales se informarán de manera previa, clara y suficiente antes de cualquier contratación.</p>
        <h2>5. Ley aplicable y jurisdicción</h2>
        <p>Estos Términos se rigen por las leyes de la República Bolivariana de Venezuela. Contacto: <a href="mailto:labadminsweet@gmail.com">labadminsweet@gmail.com</a>.</p>
      `,
    },
    privacidad: {
      eyebrow: 'Versión 1.0 · Constitución de la RBV (Arts. 28 y 60) · Venezuela',
      title: 'Política de Privacidad y Protección de Datos',
      url: 'privacidad.html',
      html: `
        <p>En cumplimiento de los artículos 28 y 60 de la <strong>Constitución de la República Bolivariana de Venezuela</strong>, la <strong>Ley Especial contra los Delitos Informáticos</strong> y el <strong>Decreto con Fuerza de Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>, informamos cómo recolectamos, resguardamos y tratamos los datos personales en este sitio web.</p>
        <h2>1. Responsable del tratamiento</h2>
        <p><strong>Responsable:</strong> Jesús Ramos / Proyecto SweetLab Desktop.<br /><strong>Contacto:</strong> <a href="mailto:labadminsweet@gmail.com">labadminsweet@gmail.com</a></p>
        <h2>2. Datos recolectados (principio de minimización)</h2>
        <p>En el formulario de lista de espera solicitamos <strong>únicamente su dirección de correo electrónico</strong>. No solicitamos datos sensibles, historias clínicas ni información financiera en este sitio web.</p>
        <p>Para dejar constancia verificable de su consentimiento como mensaje de datos, conservamos un registro técnico de aceptación: identificador único del registro, fecha y hora exacta (UTC) de aceptación de cada casilla, versión de las políticas aceptadas, URL del formulario y agente de usuario del navegador.</p>
        <h2>3. Finalidad del tratamiento</h2>
        <ul>
          <li>Gestionar su inscripción en la lista de espera de SweetLab Desktop.</li>
          <li>Enviar notificaciones exclusivamente relacionadas con la disponibilidad del acceso anticipado o lanzamiento del producto.</li>
          <li>Conservar constancia auditable de la autorización otorgada por el titular.</li>
        </ul>
        <h2>4. Derechos del titular (Habeas Data)</h2>
        <ul>
          <li><strong>Acceder</strong> a su correo registrado y a la constancia de su consentimiento.</li>
          <li><strong>Actualizar o rectificar</strong> su dirección de correo electrónico.</li>
          <li><strong>Revocar su consentimiento</strong> y solicitar la eliminación definitiva de su correo en cualquier momento escribiendo a <a href="mailto:labadminsweet@gmail.com">labadminsweet@gmail.com</a>.</li>
        </ul>
      `,
    },
  };

  document.querySelectorAll('[data-legal-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const docKey = trigger.dataset.legalModal;
      const doc = LEGAL_DOCS[docKey];
      if (!doc) return;

      event.preventDefault();
      eyebrowEl.textContent = doc.eyebrow;
      titleEl.textContent = doc.title;
      bodyEl.innerHTML = doc.html;
      bodyEl.scrollTop = 0;
      extLink.href = doc.url;
      dialog.showModal();
    });
  });

  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    dialog.returnValue = '';
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e)) dialog.close();
    });
  }
}

/**
 * Validación accesible tras interacción (:user-invalid + fallback y aria-live),
 * dos casillas de consentimiento independientes y registro trazable.
 */
function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const termsCheckbox = document.getElementById('accept-terms');
  const privacyCheckbox = document.getElementById('accept-privacy');
  const submitBtn = document.getElementById('waitlist-submit');
  const feedback = document.getElementById('waitlist-feedback');
  if (!form || !emailInput || !termsCheckbox || !privacyCheckbox || !submitBtn || !feedback) return;

  const controls = [emailInput, termsCheckbox, privacyCheckbox];
  const dirtyState = new WeakMap();
  let termsAcceptedAt = null;
  let privacyAcceptedAt = null;

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'visually-hidden';
  document.body.append(announcer);

  const linkError = (el, shown) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const syncControl = (el, announce = false) => {
    const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
    const state = dirtyState.get(el) || { interacted: false, blurred: false };
    const isInvalid = supportsUserInvalid
      ? el.matches(':user-invalid') || el.classList.contains('user-invalid-fallback')
      : (state.interacted && state.blurred && !el.validity.valid);

    if (el.validity.valid) {
      el.classList.remove('user-invalid-fallback');
    } else if (!supportsUserInvalid && state.interacted && state.blurred) {
      el.classList.add('user-invalid-fallback');
    }

    const actuallyInvalid = !el.validity.valid && isInvalid;
    el.setAttribute('aria-invalid', actuallyInvalid ? 'true' : 'false');
    linkError(el, actuallyInvalid);

    if (announce && actuallyInvalid) {
      const errNode = document.getElementById(el.dataset.error);
      if (errNode) announcer.textContent = errNode.textContent.trim();
    }
  };

  emailInput.addEventListener('input', () => {
    const state = dirtyState.get(emailInput) || { interacted: false, blurred: false };
    state.interacted = true;
    dirtyState.set(emailInput, state);
    if (state.blurred) syncControl(emailInput, false);
  });

  emailInput.addEventListener('blur', () => {
    const state = dirtyState.get(emailInput) || { interacted: false, blurred: false };
    state.blurred = true;
    dirtyState.set(emailInput, state);
    if (state.interacted) syncControl(emailInput, true);
  });

  termsCheckbox.addEventListener('change', () => {
    termsAcceptedAt = termsCheckbox.checked ? new Date().toISOString() : null;
    dirtyState.set(termsCheckbox, { interacted: true, blurred: true });
    syncControl(termsCheckbox, true);
  });

  privacyCheckbox.addEventListener('change', () => {
    privacyAcceptedAt = privacyCheckbox.checked ? new Date().toISOString() : null;
    dirtyState.set(privacyCheckbox, { interacted: true, blurred: true });
    syncControl(privacyCheckbox, true);
  });

  const createConsentId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `sl-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let firstInvalid = null;
    controls.forEach((el) => {
      dirtyState.set(el, { interacted: true, blurred: true });
      if (!el.checkValidity()) {
        el.classList.add('user-invalid-fallback');
        syncControl(el, !firstInvalid);
        if (!firstInvalid) firstInvalid = el;
      } else {
        syncControl(el, false);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const email = emailInput.value.trim();
    const submittedAt = new Date().toISOString();
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    const consentRecord = {
      consent_id: createConsentId(),
      email,
      terms_accepted: true,
      terms_version: LEGAL_VERSIONS.terms,
      terms_url: `${baseUrl}terminos.html`,
      terms_accepted_at: termsAcceptedAt || submittedAt,
      privacy_accepted: true,
      privacy_version: LEGAL_VERSIONS.privacy,
      privacy_url: `${baseUrl}privacidad.html`,
      privacy_accepted_at: privacyAcceptedAt || submittedAt,
      submitted_at: submittedAt,
      page_url: window.location.href,
      consent_method: 'explicit_unchecked_separate_checkboxes',
      user_agent: navigator.userAgent,
      source: 'sweetlab.github.io',
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    feedback.hidden = true;
    feedback.classList.remove('is-error');

    try {
      if (APPS_SCRIPT_WAITLIST_URL) {
        await fetch(APPS_SCRIPT_WAITLIST_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(consentRecord),
        });
      } else {
        console.info('Registro trazable de consentimiento (configura APPS_SCRIPT_WAITLIST_URL en app.js para persistirlo en Google Sheets):', consentRecord);
      }

      form.reset();
      termsAcceptedAt = null;
      privacyAcceptedAt = null;
      controls.forEach((el) => {
        dirtyState.delete(el);
        el.classList.remove('user-invalid-fallback');
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
      });

      feedback.textContent = `¡Listo! Registramos ${email} en la lista de espera (Ref. de consentimiento: ${consentRecord.consent_id.slice(0, 8)}).`;
      feedback.hidden = false;
      announcer.textContent = feedback.textContent;
    } catch {
      feedback.textContent = 'No pudimos registrar tu correo en este momento. Intenta de nuevo.';
      feedback.classList.add('is-error');
      feedback.hidden = false;
      announcer.textContent = feedback.textContent;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar acceso';
    }
  });
}
