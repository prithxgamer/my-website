/* Pattern Game — browser port
   Memorize digit sequences and type them to advance levels. */

const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn');
const display = document.getElementById('display');
const inputEl = document.getElementById('answerInput');
const levelEl = document.getElementById('level');
const messageEl = document.getElementById('message');
const musicToggle = document.getElementById('musicToggle');

let sequence = [];
let showing = false;
let currentLevel = 0;
let musicEnabled = true;
let audioContext = null;

const LEVELS = [
  {len: 3, time: 1000},
  {len: 4, time: 700},
  {len: 5, time: 600},
  {len: 6, time: 500},
  {len: 7, time: 400},
  {len: 8, time: 350},
  {len: 8, time: 300},
  {len: 8, time: 300}
];

function randDigitNotEqual(prev) {
  let d;
  do {
    d = Math.floor(Math.random() * 10);
  } while (d === prev);
  return d;
}

function makeSequence(len) {
  const seq = [];
  let prev = null;
  for (let i = 0; i < len; i++) {
    const d = randDigitNotEqual(prev);
    seq.push(d);
    prev = d;
  }
  return seq;
}

async function showSequence(seq, perDigitMs) {
  showing = true;
  inputEl.value = '';
  inputEl.disabled = true;
  submitBtn.disabled = true;
  startBtn.disabled = true;
  messageEl.textContent = '';

  for (let d of seq) {
    display.textContent = d;
    await new Promise(r => setTimeout(r, perDigitMs));
    display.textContent = '';
    await new Promise(r => setTimeout(r, 200));
  }

  display.textContent = '';
  inputEl.disabled = false;
  submitBtn.disabled = false;
  startBtn.disabled = false;
  inputEl.focus();
  showing = false;
}

function startLevel(idx) {
  if (idx >= LEVELS.length) {
    messageEl.textContent = 'You WIN! Pattern Master! 🎉';
    display.textContent = '🎉';
    return;
  }

  currentLevel = idx;
  const level = LEVELS[idx];
  sequence = makeSequence(level.len);
  levelEl.textContent = `Level: ${idx + 1} of ${LEVELS.length}`;
  messageEl.textContent = '';
  display.textContent = 'Ready?';

  setTimeout(() => {
    showSequence(sequence, level.time);
  }, 500);
}

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(freq, duration, time) {
  if (!musicEnabled) return;
  const ctx = initAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.start(time);
  osc.stop(time + duration);
}

function playRetroMelody() {
  if (!musicEnabled) return;
  const ctx = initAudio();
  const now = ctx.currentTime;
  const notes = [220, 246, 277, 311, 349, 392, 440];
  const seq = [2, 4, 5, 4, 2, 0, 1, 2, 0];
  let time = now;
  seq.forEach(idx => {
    playTone(notes[idx], 0.15, time);
    time += 0.18;
  });
}

function playSuccessTone() {
  if (!musicEnabled) return;
  const ctx = initAudio();
  const now = ctx.currentTime;
  playTone(523, 0.1, now);
  playTone(659, 0.1, now + 0.12);
  playTone(784, 0.15, now + 0.24);
}

function playFailTone() {
  if (!musicEnabled) return;
  const ctx = initAudio();
  const now = ctx.currentTime;
  playTone(200, 0.15, now);
  playTone(150, 0.2, now + 0.17);
}

startBtn.addEventListener('click', () => {
  playRetroMelody();
  startLevel(0);
});

submitBtn.addEventListener('click', () => {
  if (showing) return;
  const val = inputEl.value.trim();
  if (!/^[0-9]+$/.test(val)) {
    messageEl.textContent = 'Type only digits (0-9).';
    return;
  }

  const correct = sequence.join('');
  if (val === correct) {
    playSuccessTone();
    messageEl.textContent = '✓ Correct! Next level...';
    const next = currentLevel + 1;
    setTimeout(() => {
      startLevel(next);
    }, 800);
  } else {
    playFailTone();
    messageEl.textContent = `✗ Wrong. Answer: ${correct}. Start over.`;
    display.textContent = '😵';
    setTimeout(() => {
      display.textContent = 'Ready?';
      startBtn.disabled = false;
    }, 1200);
  }
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitBtn.click();
  }
});

musicToggle.addEventListener('click', () => {
  musicEnabled = !musicEnabled;
  musicToggle.textContent = musicEnabled ? '🔊' : '🔇';
});
