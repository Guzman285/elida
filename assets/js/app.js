const playBtn = document.getElementById("playMusicBtn");
const song    = document.getElementById("weddingSong");
const musicBar = document.querySelector(".music-bar");
const iconPlay  = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");

playBtn.addEventListener("click", () => {
  if (song.paused) {
    song.play();
    iconPlay.style.display  = "none";
    iconPause.style.display = "block";
    musicBar.classList.add("playing");
  } else {
    song.pause();
    iconPlay.style.display  = "block";
    iconPause.style.display = "none";
    musicBar.classList.remove("playing");
  }
});