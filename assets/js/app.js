// ─── CONTADOR REGRESIVO ───
(function() {
  const boda = new Date('2026-06-13T11:00:00');
  function actualizar() {
    const ahora = new Date();
    const diff = boda - ahora;
    if (diff <= 0) {
      document.getElementById('cnt-dias').textContent = '00';
      document.getElementById('cnt-horas').textContent = '00';
      document.getElementById('cnt-min').textContent = '00';
      document.getElementById('cnt-seg').textContent = '00';
      return;
    }
    const dias  = Math.floor(diff / 86400000);
    const horas = Math.floor((diff % 86400000) / 3600000);
    const min   = Math.floor((diff % 3600000) / 60000);
    const seg   = Math.floor((diff % 60000) / 1000);
    document.getElementById('cnt-dias').textContent  = String(dias).padStart(2,'0');
    document.getElementById('cnt-horas').textContent = String(horas).padStart(2,'0');
    document.getElementById('cnt-min').textContent   = String(min).padStart(2,'0');
    document.getElementById('cnt-seg').textContent   = String(seg).padStart(2,'0');
  }
  actualizar();
  setInterval(actualizar, 1000);
})();

// ─── MÚSICA ───
(function() {
  const btn  = document.getElementById('playMusicBtn');
  const song = document.getElementById('weddingSong');
  const bar  = document.querySelector('.music-bar');
  const iconPlay  = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
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
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('activo');
  document.body.style.overflow = '';
}

function cerrarModalOverlay(event, id) {
  if (event.target === event.currentTarget) {
    cerrarModal(id);
  }
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
    navigator.clipboard.writeText(texto).then(function() {
      _feedbackCopiado(btn);
    }).catch(function() {
      _copiarFallback(texto, btn);
    });
  } else {
    _copiarFallback(texto, btn);
  }
}

function _copiarFallback(texto, btn) {
  var ta = document.createElement('textarea');
  ta.value = texto;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
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

  const opciones = document.getElementById('rsvpOpciones');
  const formWrap = document.getElementById('rsvpFormWrap');

  opciones.style.display = 'none';
  formWrap.style.display = 'block';

  const labelPersonas = document.getElementById('rsvpLabelPersonas');
  if (respuesta === 'si') {
    labelPersonas.textContent = '¿Cuántas personas asistirán?';
  } else {
    labelPersonas.textContent = 'Número de personas (referencia)';
  }
}

function marcarError(input, mostrar) {
  var field = input.closest('.rsvp-field');
  if (!field) return;
  var error = field.querySelector('.rsvp-error');
  if (mostrar) {
    input.classList.add('rsvp-input-error');
    if (error) error.style.display = 'block';
  } else {
    input.classList.remove('rsvp-input-error');
    if (error) error.style.display = 'none';
  }
}

function enviarRSVP(e) {
  e.preventDefault();

  var inputNombre   = document.getElementById('rsvpNombre');
  var inputPersonas = document.getElementById('rsvpPersonas');
  var nombre   = inputNombre.value.trim();
  var personas = inputPersonas.value.trim();
  var mensaje  = document.getElementById('rsvpMensajeInput').value.trim();
  var btn      = document.getElementById('rsvpSubmitBtn');

  marcarError(inputNombre, false);
  marcarError(inputPersonas, false);

  var valido = true;
  if (!nombre) { marcarError(inputNombre, true); valido = false; }
  if (!personas || parseInt(personas) < 1) { marcarError(inputPersonas, true); valido = false; }
  if (!valido) return;

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLO6QmRbU2CvTxuK3wDIglsfMPBR4TwaxOq0lBIIy-eEbuQa94s6nsuirZFau1gGbZ/exec';
  const params = new URLSearchParams({ nama: nombre, jumlah: personas, status: _rsvpStatus, mensaje: mensaje });

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  .then(function() { mostrarMensajeFinal(); })
  .catch(function() { mostrarMensajeFinal(); });
}

function mostrarMensajeFinal() {
  var formWrap   = document.getElementById('rsvpFormWrap');
  var confirmado = document.getElementById('rsvpConfirmado');
  var msgTexto   = document.getElementById('rsvpMensaje');

  formWrap.style.display = 'none';

  if (_rsvpStatus === 'Asistirá') {
    msgTexto.textContent = 'Con mucho amor los esperamos el 13 de Junio. ¡Será un día inolvidable!';
  } else {
    msgTexto.textContent = 'Los tendremos en el corazón ese día. ♥';
  }

  confirmado.style.display = 'flex';
}


// ═══════════════════════════════════════════
//   EFECTOS ESPECIALES
// ═══════════════════════════════════════════

// ─── SCROLL REVEAL ───
(function() {
  var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducirMovimiento) return;

  var secciones = document.querySelectorAll(
    '.padres-section, .fecha-section, .evento-section, ' +
    '.itinerario-section, .notas-section, .rsvp-section, .foto-novios-section'
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
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  secciones.forEach(function(el) { obs.observe(el); });
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
      // Progreso: -1 (arriba de vista) a +1 (abajo de vista)
      var progreso = (rect.top + rect.height / 2 - wh / 2) / wh;
      var offset = progreso * 45;
      img.style.transform = 'scale(1.08) translateY(' + offset + 'px)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(aplicarParallax);
      ticking = true;
    }
  }, { passive: true });

  aplicarParallax();
})();


// ─── PÉTALOS CAYENDO ───
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var colores = ['#c97d6a', '#e8b4a0', '#d4856a', '#f0c5b0', '#b86b52', '#dda898'];
  var total = 18;

  for (var i = 0; i < total; i++) {
    var petalo = document.createElement('div');
    petalo.className = 'petalo';

    var color = colores[i % colores.length];
    var w = 7 + Math.random() * 11;
    var h = w * (1.25 + Math.random() * 0.5);
    var cx = (w / 2).toFixed(1);
    var cy = (h / 2).toFixed(1);
    var rx = (w / 2 * 0.88).toFixed(1);
    var ry = (h / 2 * 0.82).toFixed(1);
    var rotSvg = (Math.random() * 50 - 25).toFixed(1);
    var opaSvg = (0.60 + Math.random() * 0.25).toFixed(2);

    petalo.innerHTML =
      '<svg width="' + w.toFixed(0) + '" height="' + h.toFixed(0) +
      '" viewBox="0 0 ' + w.toFixed(1) + ' ' + h.toFixed(1) + '" fill="none">' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
      '" fill="' + color + '" opacity="' + opaSvg + '"' +
      ' transform="rotate(' + rotSvg + ' ' + cx + ' ' + cy + ')"/>' +
      '</svg>';

    var left      = (Math.random() * 96).toFixed(1);
    var delay     = (Math.random() * 10).toFixed(2);
    var duracion  = (6 + Math.random() * 7).toFixed(2);
    var driftMid  = ((Math.random() * 40 - 20)).toFixed(1);
    var driftEnd  = ((Math.random() * 60 - 30)).toFixed(1);

    petalo.style.cssText =
      'left:' + left + '%;' +
      'top:0;' +
      'animation-duration:' + duracion + 's;' +
      'animation-delay:-' + delay + 's;' +
      '--drift-mid:' + driftMid + 'px;' +
      '--drift-end:' + driftEnd + 'px;';

    hero.appendChild(petalo);
  }
})();
