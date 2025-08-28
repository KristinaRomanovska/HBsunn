
(function() {
  const STORAGE_KEY = 'site_unlocked_2025_08_29';
  const overlay = document.getElementById('countdown-overlay');
  const timerEl = document.getElementById('countdown-timer');
  if (!overlay || !timerEl) return;

  // If already unlocked, never show timer again
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      overlay.remove();
      return;
    }
  } catch (e) {
    // localStorage might be disabled; ignore
  }

  // Parse target from data attribute as local time
  const targetStr = timerEl.getAttribute('data-target'); // e.g. "2025-08-29T00:00:00"
  let target = new Date(targetStr); // Interpreted as local time by browsers

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      // Unlock: hide overlay and remember permanently
      overlay.classList.remove('show');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (e) {}
      // Remove overlay to avoid accidental re-display by CSS/JS
      setTimeout(() => overlay.remove(), 100);
      return true;
    }

    // Calculate remaining
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Render "DD дн HH:MM:SS"
    const parts = [];
    if (days > 0) parts.push(days + ' дн');
    parts.push(pad(hours) + ':' + pad(minutes) + ':' + pad(seconds));
    timerEl.textContent = parts.join(' ');
    return false;
  }

  function showOverlay() {
    overlay.classList.add('show');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
  }

  // Decide to show overlay now
  const shouldShow = (new Date()).getTime() < target.getTime();
  if (shouldShow) {
    showOverlay();
    update();
    setInterval(update, 1000);
  } else {
    // Already past: unlock permanently
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (e) {}
    overlay.remove();
  }
})();
