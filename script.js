// scripts.js

const player = document.querySelector('.player');
const video = player.querySelector('.viewer'); // video element
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Toggle play/pause
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Update play/pause button icon
function updateButton() {
  const icon = video.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

// Skip forward/backward
function skip() {
  const skipValue = parseFloat(this.dataset.skip);
  // clamp between 0 and duration
  let newTime = video.currentTime + skipValue;
  if (newTime < 0) newTime = 0;
  if (video.duration && newTime > video.duration) newTime = video.duration;
  video.currentTime = newTime;
}

// Handle range updates (volume / playbackRate)
function handleRangeUpdate() {
  // this.name -> "volume" or "playbackRate"
  video[this.name] = parseFloat(this.value);
}

// Update progress bar as video plays
function handleProgress() {
  if (!video.duration || isNaN(video.duration)) return;
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

// Scrub to a position when clicking/dragging on progress bar
function scrub(e) {
  const rect = progress.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, offsetX / rect.width));
  if (video.duration) {
    video.currentTime = ratio * video.duration;
  }
}

// Basic error handling if video fails to load
function handleError() {
  // graceful message in UI (falls back to alert)
  console.error('Video failed to load or playback error.');
  alert('Error: Video failed to load. Please check download.mp4 is available.');
}

// Event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('error', handleError);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', handleRangeUpdate);
});

// Scrubbing - support click + drag
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseleave', () => mousedown = false);

// Initialize UI state (button icon, progress)
updateButton();
handleProgress();
