import { mascot, mascotSrc, sceneSvg, icon, landmarkIcon, stampSvg } from './scenes.js';
import { stages, freshState, restoreState, totalFound, discover, nextUnvisited } from './game.js';

const $ = id => document.getElementById(id);
// Keep the previous colour-hunt prototype's save untouched.
const storageKey = 'duszek-lubuszek-trail-v2';
let state;
try { state = restoreState(localStorage.getItem(storageKey)); } catch { state = freshState(); }
let hints = 0;
let reading = false;
let confettiTimer;
const canSpeak = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance === 'function';
const speakerIcon = () => icon(`<path d="M12 7 7 11H3v7h4l5 4Z"/>${reading ? '<path d="M17 9q6 5 0 11m4-15q10 9 0 19"/>' : '<path d="m18 11 7 7m0-7-7 7"/>'}`);

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { /* The game also works when browser storage is disabled. */ }
}
function say(text) {
  if (!reading || !canSpeak) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pl-PL';
  utterance.rate = .88;
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('pl'));
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
function feedback(text, success = false) {
  $('feedback').textContent = text;
  $('feedback').classList.toggle('success', success);
}
function render() {
  const stage = stages[state.stage];
  const solved = state.progress[state.stage] === 1;
  const total = totalFound(state);
  $('stage-nav').innerHTML = stages.map((s, i) => `
    <button class="stage-button ${i === state.stage ? 'active' : ''} ${state.progress[i] ? 'visited' : ''}" data-stage="${i}"
      ${i === state.stage ? 'aria-current="step"' : ''} aria-label="${s.short}${state.progress[i] ? ' — pieczątka zebrana' : ' — czeka zagadka'}">
      <span class="stage-icon">${landmarkIcon(s.type)}<small class="stop-number">${state.progress[i] ? '✓' : i + 1}</small></span>
      <span class="stage-meta"><strong>${s.short}</strong></span>
    </button>`).join('');
  $('total-count').textContent = `${total} z ${stages.length}`;
  $('total-bar').style.width = `${total / stages.length * 100}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', total);
  $('scene-title').textContent = stage.name;
  $('scene-subtitle').textContent = stage.short;
  $('scene-chapter').textContent = `PRZYSTANEK ${String(state.stage + 1).padStart(2, '0')} / 08`;
  $('scene').innerHTML = sceneSvg(state.stage);
  $('scene').style.filter = `saturate(${solved ? 1.12 : .82})`;
  $('scene').classList.toggle('solved', solved);
  if (solved) {
    const found = document.querySelector(`[data-item="${stage.object.id}"]`);
    found.classList.add('found');
    found.setAttribute('aria-label', `${stage.object.name} — odnaleziono`);
    document.querySelectorAll('.findable').forEach(node => {
      node.setAttribute('aria-disabled', 'true');
      node.setAttribute('tabindex', '-1');
    });
  }
  $('riddle-number').textContent = solved ? 'PIECZĄTKA DO PASZPORTU!' : `ZAGADKA · ${stage.short.toLocaleUpperCase('pl')}`;
  $('riddle').textContent = solved
    ? total === stages.length ? 'Paszport pełny! Znasz już wszystkie osiem przystanków mojego szlaku.' : `Brawo! ${stage.short} ma już swoje miejsce w Twoim paszporcie. Dokąd ruszamy dalej?`
    : stage.object.riddle;
  $('riddle-instruction').textContent = solved ? 'Wirtualna pieczątka jest już w Twojej kolekcji.' : 'Znajdź odpowiedź na obrazku i kliknij ją.';
  $('ghost-message').textContent = solved ? 'Ale masz oko! Bardzo lubię odkrywać Lubuskie razem z Tobą.' : stage.intro;
  $('hint-button').hidden = solved;
  $('hint-button').innerHTML = '<span aria-hidden="true">☀</span> Mała podpowiedź <span class="hint-arrow" aria-hidden="true">→</span>';
  $('next-button').hidden = !solved;
  const next = nextUnvisited(state);
  $('next-button').textContent = next === null ? 'Odbierz swoją odznakę ✦' : `Dalej: ${stages[next].short} →`;
  $('collection').innerHTML = stages.map((s, i) => `
    <button class="passport-stamp ${state.progress[i] ? 'earned' : ''} ${i === state.stage ? 'selected' : ''}" data-stage="${i}"
      ${i === state.stage ? 'aria-current="step"' : ''} aria-label="${s.short} — ${state.progress[i] ? 'pieczątka zebrana' : 'jeszcze bez pieczątki'}" title="${s.name}, ${s.short}">
      ${stampSvg(i, Boolean(state.progress[i]))}<span>${s.short}</span>
    </button>`).join('');
  $('fun-fact').textContent = stage.fact;
  $('scene-note').textContent = solved ? 'Nowa wirtualna pieczątka w Twoim paszporcie!' : 'Rozejrzyj się. Odpowiedź jest gdzieś na obrazku…';
  feedback('');
  resizeTargets();
}

// Transparent hit areas keep little details easy to tap without enlarging art.
function resizeTargets() {
  const width = $('scene').getBoundingClientRect().width;
  if (!width) return;
  const minSize = 44 * 900 / width;
  document.querySelectorAll('.hit-area').forEach(rect => {
    if (!rect.dataset.originalWidth) {
      rect.dataset.originalWidth = rect.getAttribute('width');
      rect.dataset.originalHeight = rect.getAttribute('height');
    }
    const w = Math.max(Number(rect.dataset.originalWidth), minSize);
    const h = Math.max(Number(rect.dataset.originalHeight), minSize);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('x', -w / 2);
    rect.setAttribute('y', -h / 2);
  });
}
new ResizeObserver(resizeTargets).observe($('scene'));

function celebrate() {
  clearTimeout(confettiTimer);
  $('celebration').innerHTML = Array.from({ length: 22 }, (_, i) => `<i class="confetti" style="--confetti:${['#d9c846', '#a8c83c', '#f9efc6', '#79b6cf', '#ce946e'][i % 5]};--x:${Math.cos(i * 2.4) * (100 + i * 6)}px;--y:${60 + Math.sin(i * 1.7) * 90 + i * 7}px;--rotation:${i * 67}deg"></i>`).join('');
  confettiTimer = setTimeout(() => $('celebration').replaceChildren(), 1700);
}
function selectItem(id) {
  if (state.progress[state.stage]) return;
  if (!discover(state, id)) {
    const message = 'Szukamy czegoś innego. Spróbuj jeszcze raz — mogę Ci też podpowiedzieć!';
    feedback(message);
    say(message);
    $('riddle').classList.remove('shake');
    requestAnimationFrame(() => $('riddle').classList.add('shake'));
    return;
  }
  const stage = stages[state.stage];
  hints = 0;
  save(); render(); celebrate();
  const message = `Tak! ${stage.object.name}. Zdobywasz wirtualną pieczątkę: ${stage.short}!`;
  feedback(message, true);
  say(`${message} ${$('riddle').textContent}`);
  $('riddle').focus({ preventScroll: true });
}
function visit(index) {
  if (!Number.isInteger(index) || index < 0 || index >= stages.length || index === state.stage) return;
  state.stage = index;
  hints = 0;
  save(); render();
  say(`${stages[index].short}. ${$('riddle').textContent}`);
  $('riddle').focus({ preventScroll: true });
  if (window.matchMedia('(max-width:620px)').matches) {
    document.querySelector('.guide-card').scrollIntoView({ block: 'start' });
  }
}
$('scene').addEventListener('click', event => {
  const target = event.target.closest('[data-item]');
  if (target) selectItem(target.dataset.item);
  else if (!state.progress[state.stage]) feedback('Przyjrzyj się szczegółom obrazka. Duszek chętnie Ci podpowie.');
});
$('scene').addEventListener('keydown', event => {
  const target = event.target.closest('[data-item]');
  if (target && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    selectItem(target.dataset.item);
  }
});
for (const id of ['stage-nav', 'collection']) {
  $(id).addEventListener('click', event => {
    const button = event.target.closest('[data-stage]');
    if (button) visit(Number(button.dataset.stage));
  });
}
$('hint-button').addEventListener('click', () => {
  if (state.progress[state.stage]) return;
  const current = stages[state.stage].object;
  hints++;
  feedback(hints === 1 ? current.hint : 'Spójrz na migoczącą obwódkę na obrazku. Tam czeka odpowiedź!');
  if (hints >= 2) document.querySelector(`[data-item="${current.id}"]`).classList.add('hinted');
  $('hint-button').innerHTML = `<span aria-hidden="true">☀</span> ${hints === 1 ? 'Pokaż, gdzie szukać' : 'Podpowiedź jest na obrazku'} <span class="hint-arrow" aria-hidden="true">→</span>`;
  say($('feedback').textContent);
});
$('next-button').addEventListener('click', () => {
  if (!state.progress[state.stage]) return;
  const next = nextUnvisited(state);
  if (next === null) {
    $('finish-dialog').showModal();
    say('Brawo! Osiem wirtualnych pieczątek. Jesteś Odkrywcą Szlaku Duszka Lubuszka!');
  } else visit(next);
});
$('sound-button').innerHTML = speakerIcon();
$('sound-button').addEventListener('click', () => {
  if (!canSpeak) {
    feedback('Ta przeglądarka nie obsługuje czytania. Wszystkie zagadki są w ramce obok Duszka.');
    return;
  }
  reading = !reading;
  $('sound-button').innerHTML = speakerIcon();
  $('sound-button').setAttribute('aria-pressed', String(reading));
  $('sound-button').setAttribute('aria-label', reading ? 'Wyłącz czytanie zagadek' : 'Włącz czytanie zagadek');
  if (reading) say($('riddle').textContent);
  else speechSynthesis.cancel();
});
for (const [button, dialog] of [['help-button', 'help-dialog'], ['trail-button', 'trail-dialog'], ['restart-button', 'restart-dialog']]) {
  $(button).addEventListener('click', () => $(dialog).showModal());
}
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));
$('confirm-restart').addEventListener('click', () => {
  state = freshState(); hints = 0;
  save(); render();
  $('restart-dialog').close();
  if (canSpeak) speechSynthesis.cancel();
  $('riddle').focus({ preventScroll: true });
});

function badgeSvg(download = false, mascotHref = mascotSrc) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${download ? '480' : '400'}"><path d="m145 275-33 110 69-25 35 40 15-110m15-15 43 110-67-25-34 40-25-110" fill="#bd9b52"/><path d="m145 275-24 93 54-24 27 36 14-90m30-15 33 93-55-24-25 36-20-90" fill="#e2c374"/><circle cx="200" cy="177" r="155" fill="#e6e9b4" stroke="#a9b559" stroke-width="3"/><circle cx="200" cy="177" r="139" fill="#f9f8df" stroke="#a9b559" stroke-width="2" stroke-dasharray="3 7"/><image href="${mascotHref}" x="103" y="45" width="194" height="183"/><text x="200" y="263" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="#3d6046">ODKRYWCA SZLAKU</text><text x="200" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="#3d6046">DUSZKA LUBUSZKA</text><g fill="#a6b44c"><path d="m64 163 4-11 4 11 11 4-11 4-4 11-4-11-11-4Zm264 0 4-11 4 11 11 4-11 4-4 11-4-11-11-4Z"/></g>${download ? '<text x="200" y="440" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#45664b">8 miejsc. 8 zagadek. Paszport pełen przygód!</text><text x="200" y="465" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#6b7a62">Wirtualna odznaka — pamiątka z gry</text>' : ''}</svg>`;
}
let mascotData;
async function embeddedMascot() {
  if (mascotSrc.startsWith('data:')) return mascotSrc;
  if (mascotData) return mascotData;
  const response = await fetch(mascotSrc);
  if (!response.ok) throw new Error('Mascot unavailable');
  const blob = await response.blob();
  mascotData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return mascotData;
}
$('download-badge').addEventListener('click', async () => {
  const button = $('download-badge');
  button.disabled = true;
  $('download-feedback').textContent = '';
  try {
    const artwork = await embeddedMascot();
    const url = URL.createObjectURL(new Blob([badgeSvg(true, artwork)], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'odznaka-odkrywcy-szlaku-duszka.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    $('download-feedback').textContent = 'Nie udało się zapisać odznaki. Spróbuj ponownie za chwilę.';
  } finally { button.disabled = false; }
});
$('brand-mark').innerHTML = mascot();
$('ghost-portrait').innerHTML = mascot('Duszek Lubuszek w zielonej czapce z literą L i niebieskim daszkiem');
$('final-badge').innerHTML = badgeSvg();
render();
