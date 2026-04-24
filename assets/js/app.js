const playBtn = document.getElementById("playMusicBtn");
const song = document.getElementById("weddingSong");

playBtn.addEventListener("click", () => {
  if (song.paused) {
    song.play();
    playBtn.innerHTML = `
      <span class="play-icon">⏸</span>
      <span class="play-text">Pausar canción</span>
    `;
  } else {
    song.pause();
    playBtn.innerHTML = `
      <span class="play-icon">▶</span>
      <span class="play-text">Reproducir canción</span>
    `;
  }
});