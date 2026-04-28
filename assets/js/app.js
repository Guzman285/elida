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

  // Limpiar errores previos
  marcarError(inputNombre, false);
  marcarError(inputPersonas, false);

  var valido = true;
  if (!nombre) {
    marcarError(inputNombre, true);
    valido = false;
  }
  if (!personas || parseInt(personas) < 1) {
    marcarError(inputPersonas, true);
    valido = false;
  }
  if (!valido) return;

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLO6QmRbU2CvTxuK3wDIglsfMPBR4TwaxOq0lBIIy-eEbuQa94s6nsuirZFau1gGbZ/exec';

  const params = new URLSearchParams({
    nama:    nombre,
    jumlah:  personas,
    status:  _rsvpStatus,
    mensaje: mensaje
  });

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
