/* ============================================================
   SNEKA BIRTHDAY SURPRISE — app.js
   Pure Vanilla JavaScript — No dependencies
   ============================================================ */

"use strict";

// ===================== CONFIG =====================
const SECRET = {
  name: "sneka",
  month: "06",
  day: "17",
  year: "2002",
  birthDate: new Date(2002, 5, 17) // June = month 5 (0-indexed)
};

// ===================== STATE =====================
let confettiRunning = false;
let confettiInterval = null;
let countdownInterval = null;
let audioCtx = null;
let musicPlaying = false;
let musicOscillators = [];
let cakeBlown = false;

// ===================== DOM READY =====================
document.addEventListener("DOMContentLoaded", () => {
  populateDays();
  populateYears();
  setupEvents();
  createParticles();
  setupWishesLoop();
});

// ===================== PAGE NAVIGATION =====================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }
}

// ===================== EVENTS =====================
function setupEvents() {
  document.getElementById("btn-open").addEventListener("click", () => {
    showPage("page-verify");
  });

  document.getElementById("btn-verify").addEventListener("click", verify);

  document.getElementById("btn-retry").addEventListener("click", () => {
    document.getElementById("error-msg").textContent = "";
    document.getElementById("input-name").value = "";
    document.getElementById("dob-month").value = "";
    document.getElementById("dob-day").value = "";
    document.getElementById("dob-year").value = "";
    showPage("page-verify");
  });

  document.getElementById("input-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") verify();
  });

  document.getElementById("music-btn").addEventListener("click", toggleMusic);

  const cake = document.getElementById("cake-container");
  if (cake) {
    cake.addEventListener("click", blowCandles);
    cake.addEventListener("touchstart", blowCandles, { passive: true });
  }
}

// ===================== POPULATE DROPDOWNS =====================
function populateDays() {
  const sel = document.getElementById("dob-day");
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = String(d).padStart(2, "0");
    opt.textContent = d;
    sel.appendChild(opt);
  }
}

function populateYears() {
  const sel = document.getElementById("dob-year");
  const now = new Date().getFullYear();
  for (let y = now; y >= 1920; y--) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = y;
    sel.appendChild(opt);
  }
}

// ===================== VERIFY =====================
function verify() {
  const name = document.getElementById("input-name").value.trim().toLowerCase();
  const month = document.getElementById("dob-month").value;
  const day = document.getElementById("dob-day").value;
  const year = document.getElementById("dob-year").value;
  const errEl = document.getElementById("error-msg");

  errEl.textContent = "";

  if (!name || !month || !day || !year) {
    errEl.textContent = "⚠️ Please fill in all fields!";
    return;
  }

  const nameMatch = name === SECRET.name || name.includes(SECRET.name);
  const dobMatch = month === SECRET.month && day === SECRET.day && year === SECRET.year;

  if (nameMatch && dobMatch) {
    launchSurprise();
  } else {
    showPage("page-wrong");
  }
}

// ===================== LAUNCH SURPRISE =====================
function launchSurprise() {
  showPage("page-surprise");

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - SECRET.birthDate.getFullYear();
  const mDiff = today.getMonth() - SECRET.birthDate.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < SECRET.birthDate.getDate())) age--;
  document.getElementById("age-display").textContent = age;

  // Start confetti
  setTimeout(() => startConfetti(), 400);
  setTimeout(() => stopConfetti(), 8000);

  // Start countdown
  startCountdown();

  // Auto-play music
  setTimeout(() => {
    startMusic();
  }, 1000);

  // Animate love cards
  animateLoveCards();
}

// ===================== CAKE BLOW =====================
function blowCandles() {
  if (cakeBlown) {
    // Re-light
    document.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
    cakeBlown = false;
    return;
  }
  const candles = document.querySelectorAll(".candle");
  candles.forEach((c, i) => {
    setTimeout(() => c.classList.add("blown"), i * 150);
  });
  cakeBlown = true;
  startConfetti();
  setTimeout(() => stopConfetti(), 4000);
}

// ===================== CONFETTI =====================
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#ff6b9d", "#ffd700", "#9c27b0", "#4caf50", "#00bcd4", "#ff9800", "#e91e63", "#ffffff"];
  const pieces = [];

  for (let i = 0; i < 180; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 12 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      vAngle: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  confettiRunning = true;

  function draw() {
    if (!confettiRunning) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vAngle;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
        p.alpha = 1;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function stopConfetti() {
  confettiRunning = false;
}

// ===================== COUNTDOWN =====================
function startCountdown() {
  function update() {
    const now = new Date();
    let next = new Date(now.getFullYear(), 5, 17, 0, 0, 0);
    if (now >= next) next = new Date(now.getFullYear() + 1, 5, 17, 0, 0, 0);
    const diff = next - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("cd-days").textContent  = String(days).padStart(3, "0");
    document.getElementById("cd-hours").textContent = String(hrs).padStart(2, "0");
    document.getElementById("cd-mins").textContent  = String(mins).padStart(2, "0");
    document.getElementById("cd-secs").textContent  = String(secs).padStart(2, "0");
  }
  update();
  countdownInterval = setInterval(update, 1000);
}

// ===================== GIFT OPEN =====================
function openGift(n) {
  const box = document.getElementById("gift" + n);
  if (!box) return;
  box.classList.toggle("opened");
  if (box.classList.contains("opened")) {
    startMiniConfetti();
    playPopSound();
  }
}

function startMiniConfetti() {
  confettiRunning = true;
  startConfetti();
  setTimeout(() => stopConfetti(), 3000);
}

// ===================== MUSIC (Web Audio API) =====================
function startMusic() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    playBirthdayMelody();
    musicPlaying = true;
    document.getElementById("music-btn").textContent = "🔊";
  } catch (e) {
    console.log("Audio not supported");
  }
}

function playNote(freq, startTime, duration, vol = 0.3) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playBirthdayMelody() {
  if (!audioCtx) return;
  // Happy Birthday tune: C C D C F E | C C D C G F | C C C5 A F E D | Bb Bb A F G F
  const notes = [
    [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6],
    [349.23, 0.6], [329.63, 1.0],
    [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6],
    [392.00, 0.6], [349.23, 1.0],
    [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6],
    [349.23, 0.6], [329.63, 0.6], [293.66, 1.0],
    [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6],
    [392.00, 0.6], [349.23, 1.5]
  ];
  let t = audioCtx.currentTime + 0.1;
  notes.forEach(([freq, dur]) => {
    playNote(freq, t, dur * 0.9);
    t += dur * 0.95;
  });
  // Loop
  const totalDuration = notes.reduce((s, [, d]) => s + d, 0) * 0.95 * 1000;
  setTimeout(() => { if (musicPlaying && audioCtx) playBirthdayMelody(); }, totalDuration + 500);
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function toggleMusic() {
  const btn = document.getElementById("music-btn");
  if (musicPlaying) {
    musicPlaying = false;
    if (audioCtx) audioCtx.suspend();
    btn.textContent = "🔇";
  } else {
    musicPlaying = true;
    if (audioCtx) {
      audioCtx.resume();
      btn.textContent = "🔊";
    } else {
      startMusic();
    }
  }
}

// ===================== PARTICLES =====================
function createParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;
  const count = 40;
  const emojis = ["✨", "🌸", "⭐", "💫", "🌟", "🎀", "💖", "🌺"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    p.textContent = emoji;
    p.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      font-size:${Math.random()*16+8}px;
      opacity:${Math.random()*0.4+0.1};
      animation: particleFloat ${Math.random()*10+8}s ease-in-out ${Math.random()*5}s infinite alternate;
      pointer-events:none;
      user-select:none;
    `;
    container.appendChild(p);
  }

  const style = document.createElement("style");
  style.textContent = `
    @keyframes particleFloat {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.1; }
      50% { opacity: 0.4; }
      100% { transform: translateY(-60px) translateX(${Math.random()>0.5?'':'-'}${Math.floor(Math.random()*40)}px) scale(1.2); opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);
}

// ===================== LOVE CARDS ANIMATE =====================
function animateLoveCards() {
  const cards = document.querySelectorAll(".love-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = (i * 0.15) + "s";
  });
}

// ===================== WISHES LOOP (duplicate for seamless scroll) =====================
function setupWishesLoop() {
  const scroll = document.querySelector(".wishes-scroll");
  if (!scroll) return;
  const original = scroll.innerHTML;
  scroll.innerHTML = original + original; // duplicate for seamless loop
}

// ===================== RESTART =====================
function restartApp() {
  musicPlaying = false;
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  confettiRunning = false;
  cakeBlown = false;
  clearInterval(countdownInterval);
  document.querySelectorAll(".gift-box").forEach(g => g.classList.remove("opened"));
  document.querySelectorAll(".candle").forEach(c => c.classList.remove("blown"));
  document.getElementById("music-btn").textContent = "🎵";
  document.getElementById("input-name").value = "";
  document.getElementById("dob-month").value = "";
  document.getElementById("dob-day").value = "";
  document.getElementById("dob-year").value = "";
  document.getElementById("error-msg").textContent = "";
  showPage("page-intro");
}
