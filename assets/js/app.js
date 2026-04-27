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
function confirmarAsistencia(respuesta) {
  const opciones    = document.getElementById('rsvpOpciones');
  const confirmado  = document.getElementById('rsvpConfirmado');
  const declinado   = document.getElementById('rsvpDeclinado');
  const mensaje     = document.getElementById('rsvpMensaje');

  opciones.style.display = 'none';

  if (respuesta === 'si') {
    mensaje.textContent = 'Con mucho amor los esperamos el 13 de Junio. ¡Será un día inolvidable!';
    confirmado.style.display = 'flex';
  } else {
    declinado.style.display = 'block';
  }
}
