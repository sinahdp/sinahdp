document.getElementById('year').textContent = new Date().getFullYear();

// Inverted pendulum (torque-actuated) stabilized by a PD controller.
(function () {
  const cv = document.getElementById('pendulum');
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const g = 9.81, L = 1.0, m = 1.0, b = 0.05;
  const Kp = 40, Kd = 9, uMax = 30;
  let th = 0.35, w = 0, hist = [];
  const dt = 1 / 240;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  document.getElementById('kick').addEventListener('click', () => {
    w += (Math.random() < .5 ? -1 : 1) * (2 + Math.random() * 2);
  });

  function step() {
    const u = Math.max(-uMax, Math.min(uMax, -Kp * th - Kd * w));
    const a = (g / L) * Math.sin(th) + u / (m * L * L) - b * w;
    w += a * dt; th += w * dt;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d121a'; ctx.fillRect(0, 0, W, H);
    const px = 34, pw = W - 2 * px, ph = 90, py = H - ph - 14;
    // trace of theta(t)
    ctx.strokeStyle = '#1f2733'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py + ph / 2); ctx.lineTo(px + pw, py + ph / 2); ctx.stroke();
    ctx.strokeStyle = css('--accent2'); ctx.lineWidth = 1.6; ctx.beginPath();
    hist.forEach((v, i) => {
      const x = px + (i / 300) * pw, y = py + ph / 2 - (v / 0.8) * (ph / 2);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#8593a6'; ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('θ(t)', px, py - 4);
    // pendulum
    const ox = W / 2, oy = 230, len = 150;
    ctx.strokeStyle = '#2a3547'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ox - 60, oy); ctx.lineTo(ox + 60, oy); ctx.stroke();
    const bx = ox + len * Math.sin(th), by = oy - len * Math.cos(th);
    ctx.strokeStyle = css('--accent'); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = css('--accent'); ctx.beginPath(); ctx.arc(bx, by, 11, 0, 7); ctx.fill();
    ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.arc(ox, oy, 5, 0, 7); ctx.fill();
  }

  const label = document.getElementById('simState');
  let n = 0;
  function frame() {
    for (let i = 0; i < 4; i++) step();
    if (++n % 2 === 0) { hist.push(th); if (hist.length > 300) hist.shift(); }
    label.textContent = 'θ = ' + (th * 180 / Math.PI).toFixed(2) + '°';
    draw();
    requestAnimationFrame(frame);
  }
  frame();
})();
