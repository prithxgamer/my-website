/* Pattern Game — browser port
   Behavior mirrors the Python version: sequences of digits shown one-by-one (no immediate repeats),
   player types the whole sequence (digits only) to pass the level. */

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

// levels: length and per-digit display time (ms)
const LEVELS = [
  {len:3, time:1000},
  {len:4, time:700},
  {len:5, time:600},
  {len:6, time:500},
  {len:7, time:400},
  {len:8, time:300}
];

function randDigitNotEqual(prev) {
  let d = Math.floor(Math.random()*9)+1; // 1..9
  while (d === prev) d = Math.floor(Math.random()*9)+1;
  return d;
}

function makeSequence(len) {
  const seq = [];
  let prev = null;
  for (let i=0;i<len;i++){
    const d = randDigitNotEqual(prev);
    seq.push(d);
    prev = d;
  }
  return seq;
}

async function showSequence(seq, perDigitMs){
  showing = true;
  inputEl.value = '';
  inputEl.disabled = true;
  submitBtn.disabled = true;
  startBtn.disabled = true;
  messageEl.textContent = '';
  for (let d of seq){
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

function startLevel(idx){
  currentLevel = idx;
  const level = LEVELS[idx];
  sequence = makeSequence(level.len);
  levelEl.textContent = `Level: ${idx+1} (${level.len} digits)`;
  showSequence(sequence, level.time);
}

startBtn.addEventListener('click', ()=>{
  // start at level 0
  playRetroMelody();
  startLevel(0);
});

submitBtn.addEventListener('click', ()=>{
  if (showing) return;
  const val = inputEl.value.trim();
  if (!/^[0-9]+$/.test(val)){
    messageEl.textContent = 'Please type only digits.';
    return;
  }
  // compare as digits
  const userDigits = val.split('').map(Number);
  const correct = sequence.join('');
  if (val === correct){
    // success
    playSuccessTone();
    messageEl.textContent = 'Correct — advancing!';
    const next = currentLevel + 1;
    if (next < LEVELS.length){
      // small delay then start next
      setTimeout(()=> startLevel(next), 900);
    } else {
      messageEl.textContent = 'You WIN! You are officially a Pattern Master!';
      display.textContent = '🎉';
    }
  } else {
    playFailTone();
    messageEl.textContent = `Wrong — the answer was ${correct}. Try again from level 1.`;
    display.textContent = '😵';
    // reset after short delay
    setTimeout(()=>{
      display.textContent = 'Ready?';
      startBtn.disabled = false;
    }, 900);
  }
});

// allow Enter key in input to submit
inputEl.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter'){
    e.preventDefault();
    submitBtn.click();
  }
});

/* Retro 8-bit music using Web Audio API */
function initAudio(){
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(freq, duration, time){
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

function playRetroMelody(){
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

function playSuccessTone(){
  if (!musicEnabled) return;
  const ctx = initAudio();
  const now = ctx.currentTime;
  playTone(523, 0.1, now);
  playTone(659, 0.1, now + 0.12);
  playTone(784, 0.2, now + 0.24);
}

function playFailTone(){
  if (!musicEnabled) return;
  const ctx = initAudio();
  const now = ctx.currentTime;
  playTone(200, 0.15, now);
  playTone(150, 0.25, now + 0.17);
}

musicToggle.addEventListener('click', ()=>{
  musicEnabled = !musicEnabled;
  musicToggle.textContent = musicEnabled ? '🔊' : '🔇';
  if (musicEnabled) playRetroMelody();
});
