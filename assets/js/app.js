// Música
const btn = document.getElementById('playMusicBtn');
const song = document.getElementById('weddingSong');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const bar = document.querySelector('.music-bar');

if (btn && song) {
  btn.addEventListener('click', () => {
    if (song.paused) {
      song.play();
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      bar.classList.add('playing');
    } else {
      song.pause();
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      bar.classList.remove('playing');
    }
  });
}

// Contador regresivo — boda 13 junio 2026 11:00am
const bodaFecha = new Date('2026-06-13T11:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

function actualizarContador() {
  const ahora = new Date();
  const diff = bodaFecha - ahora;

  if (diff <= 0) {
    document.getElementById('cnt-dias').textContent  = '00';
    document.getElementById('cnt-horas').textContent = '00';
    document.getElementById('cnt-min').textContent   = '00';
    document.getElementById('cnt-seg').textContent   = '00';
    return;
  }

  const dias  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min   = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seg   = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cnt-dias').textContent  = pad(dias);
  document.getElementById('cnt-horas').textContent = pad(horas);
  document.getElementById('cnt-min').textContent   = pad(min);
  document.getElementById('cnt-seg').textContent   = pad(seg);
}

actualizarContador();
setInterval(actualizarContador, 1000);
