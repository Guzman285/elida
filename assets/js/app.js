/* ═══════════════════════════════════════════════════════════════
   INVITACIÓN BODA — CARLOS & ELIDA — app.js
   ═══════════════════════════════════════════════════════════════ */

const WHATSAPP = '50236043284'; // ← cambia al número real si es necesario

/* ─── MÚSICA ─── */
(function () {
  const btn      = document.getElementById('playMusicBtn');
  const audio    = document.getElementById('weddingSong');
  const bar      = document.querySelector('.music-bar');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause= document.getElementById('iconPause');
  if (!btn || !audio) return;
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        bar.classList.add('playing');
        iconPlay.style.display  = 'none';
        iconPause.style.display = '';
      }).catch(() => {});
    } else {
      audio.pause();
      bar.classList.remove('playing');
      iconPlay.style.display  = '';
      iconPause.style.display = 'none';
    }
  });
})();

/* ─── MODALES ─── */
function abrirModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('activo');
  document.body.style.overflow = 'hidden';
}
function cerrarModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('activo');
  document.body.style.overflow = '';
}
function cerrarModalOverlay(e, id) {
  if (e.target === e.currentTarget) cerrarModal(id);
}

/* ─── COPIAR CUENTA BANCARIA ─── */
function copiarCuenta(spanId, btn) {
  const el = document.getElementById(spanId);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    btn.classList.add('copiado');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><path d="M20 6L9 17l-5-5"/></svg>';
    setTimeout(() => { btn.classList.remove('copiado'); btn.innerHTML = orig; }, 2000);
  });
}

/* ─── RSVP: contador de personas ─── */
let rsvpCantidadVal = 1;
function cambiarCantidad(delta) {
  rsvpCantidadVal = Math.max(1, Math.min(20, rsvpCantidadVal + delta));
  const el = document.getElementById('rsvpCantidad');
  if (el) el.textContent = rsvpCantidadVal;
}

/* ─── RSVP: toggle asistencia ─── */
let rsvpAsistencia = 'si';
function seleccionarAsistencia(tipo) {
  rsvpAsistencia = tipo;
  const si = document.getElementById('btnSi');
  const no = document.getElementById('btnNo');
  if (!si || !no) return;
  si.classList.toggle('activo', tipo === 'si');
  si.setAttribute('aria-pressed', tipo === 'si');
  no.classList.toggle('activo', tipo === 'no');
  no.setAttribute('aria-pressed', tipo === 'no');
}

/* ─── RSVP: enviar confirmación por WhatsApp ─── */
function enviarConfirmacion(e) {
  e.preventDefault();
  const nombreEl = document.getElementById('rsvpNombre');
  const errorEl  = document.getElementById('rsvpNombreError');
  const nombre   = nombreEl ? nombreEl.value.trim() : '';
  if (!nombre) {
    nombreEl.classList.add('rsvp-input-error');
    if (errorEl) errorEl.style.display = '';
    setTimeout(() => nombreEl.classList.remove('rsvp-input-error'), 800);
    return;
  }
  if (errorEl) errorEl.style.display = 'none';
  const asiste = rsvpAsistencia === 'si'
    ? `✅ Sí asistiré (${rsvpCantidadVal} persona${rsvpCantidadVal > 1 ? 's' : ''})`
    : '❌ No podré asistir';
  const msg = encodeURIComponent(
    `Hola! Soy ${nombre}.\n${asiste}\nBoda de Carlos & Elida — 13 de Junio 2026 🌸`
  );
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
  cerrarModal('modal-confirmar');
}

/* ─── MENSAJE: enviar por WhatsApp ─── */
function enviarMensaje(e) {
  e.preventDefault();
  const nombreEl = document.getElementById('msgNombre');
  const textoEl  = document.getElementById('msgTexto');
  const nombre   = nombreEl ? nombreEl.value.trim() : '';
  const texto    = textoEl  ? textoEl.value.trim()  : '';
  const errores  = e.target.querySelectorAll('.rsvp-error');
  let ok = true;
  if (!nombre) {
    nombreEl.classList.add('rsvp-input-error');
    if (errores[0]) errores[0].style.display = '';
    setTimeout(() => nombreEl.classList.remove('rsvp-input-error'), 800);
    ok = false;
  } else { if (errores[0]) errores[0].style.display = 'none'; }
  if (!texto) {
    textoEl.classList.add('rsvp-input-error');
    if (errores[1]) errores[1].style.display = '';
    setTimeout(() => textoEl.classList.remove('rsvp-input-error'), 800);
    ok = false;
  } else { if (errores[1]) errores[1].style.display = 'none'; }
  if (!ok) return;
  const msg = encodeURIComponent(`Hola Carlos & Elida!\nSoy ${nombre}. 💌\n\n"${texto}"`);
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
  const form = document.getElementById('modalMensajeForm');
  const conf = document.getElementById('modalMensajeConfirmado');
  if (form) form.style.display = 'none';
  if (conf) { conf.style.display = ''; conf.style.animation = 'fadeInUp 0.5s ease'; }
  setTimeout(() => cerrarModal('modal-mensaje'), 3000);
}

/* ─── COUNTDOWN ─── */
(function () {
  const boda = new Date('2026-06-13T10:30:00');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const diff = boda - Date.now();
    const vals = diff > 0
      ? [Math.floor(diff/86400000), Math.floor((diff%86400000)/3600000), Math.floor((diff%3600000)/60000), Math.floor((diff%60000)/1000)]
      : [0, 0, 0, 0];
    ['cnt-dias','cnt-horas','cnt-min','cnt-seg'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const next = pad(vals[i]);
      if (el.textContent !== next) {
        el.classList.add('cnt-tick');
        el.textContent = next;
        el.addEventListener('animationend', () => el.classList.remove('cnt-tick'), { once: true });
      }
    });
  }
  tick();
  setInterval(tick, 1000);
})();

/* ─── CARRUSEL CONTINUO ─── */
(function () {
  const track = document.getElementById('carruselTrack');
  if (!track) return;
  let pos = 0, raf = null;
  function animate() {
    pos += 0.45;
    const half = track.scrollWidth / 2;
    if (pos >= half) pos -= half;
    track.style.transform = `translateX(-${pos}px)`;
    raf = requestAnimationFrame(animate);
  }
  const wrap = document.getElementById('carruselWrap');
  if (wrap) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(animate); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }).observe(wrap);
  } else {
    raf = requestAnimationFrame(animate);
  }
})();

/* ─── TIMELINE ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('tl-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.tl-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    obs.observe(el);
  });
})();

/* ─── NOTAS (bloom) ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('nota-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.nota-item').forEach(el => obs.observe(el));
})();

/* ─── FECHA: animación de entrada ─── */
(function () {
  const display = document.querySelector('.fecha-display');
  if (!display) return;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { display.classList.add('fecha-visible'); }
    });
  }, { threshold: 0.3 }).observe(display);
})();

/* ─── CONTADOR: animación de entrada ─── */
(function () {
  const wrap = document.querySelector('.contador-wrap');
  if (!wrap) return;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { wrap.classList.add('contador-visible'); }
    });
  }, { threshold: 0.25 }).observe(wrap);
})();

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN PADRES
   Efecto 1: nombres escalonados izq/der al hacer scroll
   Efecto 2: flores entrando desde las esquinas
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const section = document.querySelector('.padres-section');
  if (!section) return;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('padres-visible');
      }
    });
  }, { threshold: 0.12 }).observe(section);
})();
