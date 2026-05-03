// ─── CONTADOR REGRESIVO con COUNT-UP animado ───
(function() {
  var boda = new Date('2026-06-13T11:00:00');
  var intervaloActivo = false;
  var contadorAnimado = false;

  function getValores() {
    var diff = boda - new Date();
    if (diff <= 0) return { dias: 0, horas: 0, min: 0, seg: 0 };
    return {
      dias:  Math.floor(diff / 86400000),
      horas: Math.floor((diff % 86400000) / 3600000),
      min:   Math.floor((diff % 3600000) / 60000),
      seg:   Math.floor((diff % 60000) / 1000)
    };
  }

  function actualizarReloj() {
    var v = getValores();
    document.getElementById('cnt-dias').textContent  = String(v.dias).padStart(2,'0');
    document.getElementById('cnt-horas').textContent = String(v.horas).padStart(2,'0');
    document.getElementById('cnt-min').textContent   = String(v.min).padStart(2,'0');
    var segEl = document.getElementById('cnt-seg');
    var segNuevo = String(v.seg).padStart(2,'0');
    if (segEl.textContent !== segNuevo) {
      segEl.textContent = segNuevo;
      segEl.classList.remove('cnt-tick');
      void segEl.offsetWidth;
      segEl.classList.add('cnt-tick');
      segEl.addEventListener('animationend', function() {
        segEl.classList.remove('cnt-tick');
      }, { once: true });
    }
  }

  function countUp(id, target, duration, delay) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        var el = document.getElementById(id);
        if (!el) { resolve(); return; }
        var start = performance.now();
        function frame(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(eased * target)).padStart(2, '0');
          if (progress < 1) { requestAnimationFrame(frame); }
          else { el.textContent = String(target).padStart(2, '0'); resolve(); }
        }
        requestAnimationFrame(frame);
      }, delay);
    });
  }

  function iniciarCountUp() {
    if (contadorAnimado) return;
    contadorAnimado = true;
    var v = getValores();
    var wrap = document.querySelector('.contador-wrap');
    if (wrap) wrap.classList.add('contador-visible');
    Promise.all([
      countUp('cnt-dias',  v.dias,  1100, 80),
      countUp('cnt-horas', v.horas, 950,  230),
      countUp('cnt-min',   v.min,   820,  380),
      countUp('cnt-seg',   v.seg,   680,  530)
    ]).then(function() {
      if (!intervaloActivo) {
        intervaloActivo = true;
        setInterval(actualizarReloj, 1000);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var wrap = document.querySelector('.contador-wrap');
    if (wrap) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) { iniciarCountUp(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.35 });
      obs.observe(wrap);
    }
  } else {
    iniciarCountUp();
  }
})();

// ─── MÚSICA ───
(function() {
  var btn  = document.getElementById('playMusicBtn');
  var song = document.getElementById('weddingSong');
  var bar  = document.querySelector('.music-bar');
  var iconPlay  = document.getElementById('iconPlay');
  var iconPause = document.getElementById('iconPause');
  if (!btn || !song) return;
  btn.addEventListener('click', function() {
    if (song.paused) {
      song.play();
      iconPlay.style.display  = 'none';
      iconPause.style.display = 'block';
      bar.classList.add('playing');
    } else {
      song.pause();
      iconPlay.style.display  = 'block';
      iconPause.style.display = 'none';
      bar.classList.remove('playing');
    }
  });
})();

// ─── MODALES ───
function abrirModal(id) {
  var modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
  var modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('activo');
  document.body.style.overflow = '';
}

function cerrarModalOverlay(event, id) {
  if (event.target === event.currentTarget) cerrarModal(id);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.activo').forEach(function(m) {
      m.classList.remove('activo');
    });
    document.body.style.overflow = '';
  }
});

// ─── COPIAR NÚMERO DE CUENTA ───
function copiarCuenta(elementId, btn) {
  var numero = document.getElementById(elementId);
  if (!numero) return;
  var texto = numero.textContent.trim();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).then(function() { _feedbackCopiado(btn); }).catch(function() { _copiarFallback(texto, btn); });
  } else {
    _copiarFallback(texto, btn);
  }
}
function _copiarFallback(texto, btn) {
  var ta = document.createElement('textarea');
  ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  _feedbackCopiado(btn);
}
function _feedbackCopiado(btn) {
  btn.classList.add('copiado');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><path d="M20 6L9 17l-5-5"/></svg>';
  setTimeout(function() {
    btn.classList.remove('copiado');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  }, 2000);
}

// ─── RSVP — FORMULARIO DE CONFIRMACIÓN ───
var WA_NUMBER = '50235717258';
var _asistencia = 'si';
var _cantidad   = 1;

function seleccionarAsistencia(tipo) {
  _asistencia = tipo;
  var btnSi = document.getElementById('btnSi');
  var btnNo = document.getElementById('btnNo');
  if (!btnSi || !btnNo) return;
  btnSi.classList.toggle('activo', tipo === 'si');
  btnNo.classList.toggle('activo', tipo === 'no');
  btnSi.setAttribute('aria-pressed', String(tipo === 'si'));
  btnNo.setAttribute('aria-pressed', String(tipo === 'no'));
}

function cambiarCantidad(delta) {
  _cantidad = Math.max(1, Math.min(20, _cantidad + delta));
  var el = document.getElementById('rsvpCantidad');
  if (el) el.textContent = _cantidad;
}

function enviarConfirmacion(e) {
  e.preventDefault();
  var inputNombre = document.getElementById('rsvpNombre');
  var nombre      = inputNombre ? inputNombre.value.trim() : '';
  var errorEl     = document.getElementById('rsvpNombreError');

  if (inputNombre) inputNombre.classList.remove('rsvp-input-error');
  if (errorEl)     errorEl.style.display = 'none';

  if (!nombre) {
    if (inputNombre) inputNombre.classList.add('rsvp-input-error');
    if (errorEl)     errorEl.style.display = 'block';
    if (inputNombre) inputNombre.focus();
    return;
  }

  cerrarModal('modal-confirmar');

  var personas = _cantidad === 1 ? '1 persona' : _cantidad + ' personas';
  var msg;

  if (_asistencia === 'si') {
    msg =
      '\u00a1Hola Carlos & Elida! \ud83d\udc8d\ud83c\udf38\n\n' +
      'Con mucha alegr\u00eda les confirmo mi asistencia a su boda el *13 de Junio*. \ud83c\udf89\n\n' +
      '\ud83d\udc64 *Nombre:* ' + nombre + '\n' +
      '\ud83d\udc65 *Personas:* ' + personas + '\n\n' +
      '\u00a1Ser\u00e1 un honor acompa\u00f1arlos en tan especial d\u00eda! \u2728';
  } else {
    msg =
      '\u00a1Hola Carlos & Elida! \ud83d\udc90\n\n' +
      'Lamentablemente no podr\u00e9 acompa\u00f1arlos el *13 de Junio*. \ud83d\ude14\n\n' +
      '\ud83d\udc64 *Nombre:* ' + nombre + '\n\n' +
      'Los tendr\u00e9 en mi coraz\u00f3n ese d\u00eda tan especial.\nCon mucho cari\u00f1o \ud83e\udd0d';
    var rsvpOpciones = document.getElementById('rsvpOpciones');
    var rsvpNoAsiste = document.getElementById('rsvpNoAsiste');
    if (rsvpOpciones) rsvpOpciones.style.display = 'none';
    if (rsvpNoAsiste) rsvpNoAsiste.style.display  = 'flex';
  }

  if (inputNombre) inputNombre.value = '';
  _cantidad = 1;
  var cantEl = document.getElementById('rsvpCantidad');
  if (cantEl) cantEl.textContent = '1';
  seleccionarAsistencia('si');

  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

// ─── MODAL MENSAJE A LOS NOVIOS ───
function enviarMensaje(e) {
  e.preventDefault();
  var inputNombre = document.getElementById('msgNombre');
  var inputTexto  = document.getElementById('msgTexto');
  var nombre  = inputNombre.value.trim();
  var texto   = inputTexto.value.trim();
  var btn     = document.getElementById('msgSubmitBtn');

  var nombreField = inputNombre.closest('.rsvp-field');
  var textoField  = inputTexto.closest('.rsvp-field');
  var nombreError = nombreField.querySelector('.rsvp-error');
  var textoError  = textoField.querySelector('.rsvp-error');

  inputNombre.classList.remove('rsvp-input-error');
  inputTexto.classList.remove('rsvp-input-error');
  nombreError.style.display = 'none';
  textoError.style.display  = 'none';

  var valido = true;
  if (!nombre) { inputNombre.classList.add('rsvp-input-error'); nombreError.style.display = 'block'; valido = false; }
  if (!texto)  { inputTexto.classList.add('rsvp-input-error');  textoError.style.display  = 'block'; valido = false; }
  if (!valido) return;

  btn.disabled = true; btn.textContent = 'Enviando...';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLO6QmRbU2CvTxuK3wDIglsfMPBR4TwaxOq0lBIIy-eEbuQa94s6nsuirZFau1gGbZ/exec';
  var params = new URLSearchParams({ nama: nombre, jumlah: '0', status: 'Mensaje', mensaje: texto });
  fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() })
    .then(function() { _mostrarConfirmacionMensaje(); })
    .catch(function() { _mostrarConfirmacionMensaje(); });
}

function _mostrarConfirmacionMensaje() {
  document.getElementById('modalMensajeForm').style.display = 'none';
  document.getElementById('modalMensajeConfirmado').style.display = 'flex';
}


// ═══════════════════════════════════════════════
//   EFECTOS ESPECIALES
// ═══════════════════════════════════════════════

// ─── SCROLL REVEAL (secciones generales) ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var secciones = document.querySelectorAll(
    '.padres-section, .fecha-section, .evento-section, .notas-section, .rsvp-section, .foto-novios-section'
  );
  secciones.forEach(function(el) { el.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) {
    secciones.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  secciones.forEach(function(el) { obs.observe(el); });
})();

// ─── SCROLL REVEAL — NOMBRES CARLOS & ELIDA ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Sin animación: mostrar todo directamente
    var fraseWrap   = document.querySelector('.padres-frase-wrap');
    var heroNombres = document.querySelector('.hero-nombres');
    if (fraseWrap)   fraseWrap.classList.add('nombres-visible');
    if (heroNombres) heroNombres.classList.add('nombres-visible');
    return;
  }

  if (!('IntersectionObserver' in window)) {
    var fraseWrap   = document.querySelector('.padres-frase-wrap');
    var heroNombres = document.querySelector('.hero-nombres');
    if (fraseWrap)   fraseWrap.classList.add('nombres-visible');
    if (heroNombres) heroNombres.classList.add('nombres-visible');
    return;
  }

  // Observamos .padres-frase-wrap como trigger
  var trigger = document.querySelector('.padres-frase-wrap');
  if (!trigger) return;

  var nombresObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Activar frase + ornamentos
        entry.target.classList.add('nombres-visible');
        // Activar nombres (Carlos, &, Elida) con leve retardo
        var heroNombres = document.querySelector('.hero-nombres');
        if (heroNombres) heroNombres.classList.add('nombres-visible');
        nombresObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  nombresObs.observe(trigger);
})();

// ─── SCROLL REVEAL — TIMELINE ITINERARIO ───
(function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.tl-item').forEach(function(el) { el.classList.add('tl-visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.tl-item').forEach(function(el) { obs.observe(el); });
})();

// ─── SCROLL REVEAL — NOTAS ───
(function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.nota-item').forEach(function(el) { el.classList.add('nota-visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('nota-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.nota-item').forEach(function(el) { obs.observe(el); });
})();

// ─── SCROLL REVEAL — FECHA ───
(function() {
  if (!('IntersectionObserver' in window)) {
    var fd = document.querySelector('.fecha-display');
    if (fd) fd.classList.add('fecha-visible');
    return;
  }
  var fd = document.querySelector('.fecha-display');
  if (!fd) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fecha-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(fd);
})();
