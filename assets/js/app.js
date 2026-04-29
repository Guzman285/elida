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

// ─── RSVP ───
var _rsvpStatus = '';

function confirmarAsistencia(respuesta) {
  _rsvpStatus = respuesta === 'si' ? 'Asistirá' : 'No Asistirá';
  document.getElementById('rsvpOpciones').style.display = 'none';
  document.getElementById('rsvpFormWrap').style.display = 'block';
  var lp = document.getElementById('rsvpLabelPersonas');
  lp.textContent = respuesta === 'si' ? '¿Cuántas personas asistirán?' : 'Número de personas (referencia)';
}

function marcarError(input, mostrar) {
  var field = input.closest('.rsvp-field');
  if (!field) return;
  var error = field.querySelector('.rsvp-error');
  if (mostrar) { input.classList.add('rsvp-input-error'); if (error) error.style.display = 'block'; }
  else { input.classList.remove('rsvp-input-error'); if (error) error.style.display = 'none'; }
}

function enviarRSVP(e) {
  e.preventDefault();
  var inputNombre   = document.getElementById('rsvpNombre');
  var inputPersonas = document.getElementById('rsvpPersonas');
  var nombre   = inputNombre.value.trim();
  var personas = inputPersonas.value.trim();
  var mensaje  = document.getElementById('rsvpMensajeInput').value.trim();
  var btn      = document.getElementById('rsvpSubmitBtn');
  marcarError(inputNombre, false); marcarError(inputPersonas, false);
  var valido = true;
  if (!nombre) { marcarError(inputNombre, true); valido = false; }
  if (!personas || parseInt(personas) < 1) { marcarError(inputPersonas, true); valido = false; }
  if (!valido) return;
  btn.disabled = true; btn.textContent = 'Enviando...';
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLO6QmRbU2CvTxuK3wDIglsfMPBR4TwaxOq0lBIIy-eEbuQa94s6nsuirZFau1gGbZ/exec';
  var params = new URLSearchParams({ nama: nombre, jumlah: personas, status: _rsvpStatus, mensaje: mensaje });
  fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() })
    .then(function() { mostrarMensajeFinal(); })
    .catch(function() { mostrarMensajeFinal(); });
}

function mostrarMensajeFinal() {
  document.getElementById('rsvpFormWrap').style.display = 'none';
  var confirmado = document.getElementById('rsvpConfirmado');
  var msgTexto   = document.getElementById('rsvpMensaje');
  msgTexto.textContent = _rsvpStatus === 'Asistirá'
    ? 'Con mucho amor los esperamos el 13 de Junio. ¡Será un día inolvidable!'
    : 'Los tendremos en el corazón ese día. ♥';
  confirmado.style.display = 'flex';
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
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
  secciones.forEach(function(el) { obs.observe(el); });
})();


// ─── FECHA: ANIMACIÓN DE ENTRADA (zoom + slide + fade escalonado) ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var display = document.querySelector('.fecha-display');
  if (!display) return;
  if (!('IntersectionObserver' in window)) {
    display.classList.add('fecha-visible');
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fecha-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -30px 0px' });
  obs.observe(display);
})();


// ─── PARALLAX FOTOS ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fotos = document.querySelectorAll('.foto-novios-img');
  if (!fotos.length) return;
  var ticking = false;
  function aplicarParallax() {
    var wh = window.innerHeight;
    fotos.forEach(function(img) {
      var seccion = img.closest('.foto-novios-section');
      if (!seccion) return;
      var rect = seccion.getBoundingClientRect();
      var progreso = (rect.top + rect.height / 2 - wh / 2) / wh;
      var offset = progreso * 45;
      img.style.transform = 'scale(1.08) translateY(' + offset + 'px)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function() {
    if (!ticking) { requestAnimationFrame(aplicarParallax); ticking = true; }
  }, { passive: true });
  aplicarParallax();
})();


// ─── ITINERARIO: ANIMACIÓN POR SCROLL (slide izq/der) ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.tl-item').forEach(function(el) { el.classList.add('tl-visible'); });
    return;
  }
  var items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  var obsTimeline = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-visible');
        obsTimeline.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(item) { obsTimeline.observe(item); });
})();


// ─── NOTAS: ANIMACIÓN POR SCROLL (bloom escalonado) ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.nota-item').forEach(function(el) { el.classList.add('nota-visible'); });
    return;
  }
  var notaItems = document.querySelectorAll('.nota-item');
  if (!notaItems.length) return;

  notaItems.forEach(function(item, i) {
    item.setAttribute('data-nota-idx', i);
  });

  var obsNotas = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = parseInt(entry.target.getAttribute('data-nota-idx') || 0);
        entry.target.style.transitionDelay = (idx * 0.12) + 's';
        entry.target.classList.add('nota-visible');
        obsNotas.unobserve(entry.target);
      }
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -30px 0px' });

  notaItems.forEach(function(item) { obsNotas.observe(item); });
})();
