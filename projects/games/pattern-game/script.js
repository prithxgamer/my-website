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
    /* Retro 8-bit music using Web Audio API */
    function initAudio(){
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioContext;
    }

    // Background audio (user-provided track) support.
    const TRACK_CANDIDATES = ['gameboy-rocker.mp3', 'gameboy-rocker.ogg'];
    let bgAudio = null; // HTMLAudioElement
    let bgSource = null; // MediaElementSourceNode
    let bgGain = null;

    function tryLoadTrack(){
      // create audio element and try candidates in order
      return new Promise((resolve) => {
        let tried = 0;
        function tryNext(){
          if (tried >= TRACK_CANDIDATES.length){
            resolve(false);
            return;
          }
          const name = TRACK_CANDIDATES[tried++];
          const a = new Audio();
          a.src = name;
          a.preload = 'auto';
          a.loop = true;
          a.crossOrigin = 'anonymous';
          // canplaythrough indicates the file is available and decoded enough to play
          function onCan(){
            a.removeEventListener('canplaythrough', onCan);
            a.removeEventListener('error', onErr);
            bgAudio = a;
            resolve(true);
          }
          function onErr(){
            a.removeEventListener('canplaythrough', onCan);
            a.removeEventListener('error', onErr);
            tryNext();
          }
          a.addEventListener('canplaythrough', onCan, {once:true});
          a.addEventListener('error', onErr, {once:true});
          // start loading
          a.load();
        }
        tryNext();
      });
    }

    async function setupBackgroundTrack(){
      const ok = await tryLoadTrack();
      if (!ok) return false;
      const ctx = initAudio();
      try{
        bgSource = ctx.createMediaElementSource(bgAudio);
        bgGain = ctx.createGain();
        bgGain.gain.value = 0.55; // reasonable loudness
        bgSource.connect(bgGain).connect(ctx.destination);
      } catch(e){
        // some browsers disallow MediaElementSource until audio is playing; still try fallback
        console.warn('MediaElementSource setup failed', e);
      }
      return true;
    }

    function playBackground(){
      if (!bgAudio) return false;
      initAudio();
      // resume context on user gesture
      audioContext.resume().catch(()=>{});
      bgAudio.loop = true;
      bgAudio.currentTime = 0;
      bgAudio.play().catch((e)=>{console.warn('Background audio play failed', e);});
      return true;
    }

    function stopBackground(){
      if (!bgAudio) return;
      try{ bgAudio.pause(); bgAudio.currentTime = 0; }catch(e){}
    }

    // simple synth fallback (kept for short melodies when no file is present)
    function playTone(freq, duration, time){
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.start(time);
      osc.stop(time + duration);
    }

    function playRetroMelody(){
      if (!musicEnabled) return;
      // if a background track is available and playing, prefer it
      if (bgAudio){
        if (bgAudio.paused) playBackground();
        return;
      }
      const ctx = initAudio();
      const now = ctx.currentTime;
      const notes = [220, 246, 277, 311, 349, 392, 440, 494];
      const seq = [2,4,5,4,2,0,1,2,0];
      let time = now;
      seq.forEach(idx => {
        playTone(notes[idx % notes.length], 0.15, time);
        time += 0.18;
      });
    }

    function playSuccessTone(){
      if (!musicEnabled) return;
      if (bgAudio) { /* small flourish using synth on top */ }
      const ctx = initAudio();
      const now = ctx.currentTime;
      playTone(523, 0.09, now);
      playTone(659, 0.09, now + 0.11);
      playTone(784, 0.16, now + 0.22);
    }

    function playFailTone(){
      if (!musicEnabled) return;
      const ctx = initAudio();
      const now = ctx.currentTime;
      playTone(200, 0.14, now);
      playTone(150, 0.22, now + 0.16);
    }

    // wire up music toggle: attempt to load the provided track if present, otherwise fallback to synth
    musicToggle.addEventListener('click', async ()=>{
      musicEnabled = !musicEnabled;
      musicToggle.textContent = musicEnabled ? '🔊' : '🔇';
      if (musicEnabled){
        // ensure context resumed on click
        initAudio();
        await audioContext.resume().catch(()=>{});
        const loaded = await setupBackgroundTrack();
        if (loaded){
          playBackground();
        } else {
          // fallback to short melody
          playRetroMelody();
        }
      } else {
        stopBackground();
      }
    });
