import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages, freshState, restoreState, totalFound, discover, nextUnvisited } from '../src/game.js';

test('osiem miejsc z opisu można odwiedzić w dowolnej kolejności', () => {
  assert.deepEqual(stages.map(s => s.short), ['Lubniewice', 'Międzyrzecz', 'Łagów', 'Zabór', 'Zatonie', 'Kożuchów', 'Żagań', 'Iłowa']);
  const state = freshState();
  for (const i of [7, 2, 4, 0, 6, 1, 5, 3]) {
    state.stage = i;
    assert.equal(discover(state, stages[i].object.id), true);
    assert.equal(state.progress[i], 1);
  }
  assert.equal(totalFound(state), 8);
  assert.equal(nextUnvisited(state), null);
  assert.deepEqual(restoreState(JSON.stringify(state)), state);
});

test('błędne odpowiedzi i ponowne kliknięcia nie przyznają pieczątek', () => {
  const state = freshState();
  assert.equal(discover(state, 'frog'), false);
  assert.equal(discover(state, 'key'), false);
  assert.equal(totalFound(state), 0);
  assert.equal(discover(state, 'boat'), true);
  assert.equal(discover(state, 'boat'), false);
  assert.equal(totalFound(state), 1);
  state.stage = 3;
  assert.equal(discover(state, 'boat'), false);
  assert.equal(totalFound(state), 1);
});

test('następny przystanek pomija odwiedzone miejsca i zawija na początek', () => {
  const state = freshState();
  state.stage = 6;
  assert.equal(nextUnvisited(state), 7);
  state.progress[7] = 1;
  assert.equal(nextUnvisited(state), 0);
  state.progress = Array(8).fill(1);
  state.progress[4] = 0;
  assert.equal(nextUnvisited(state), 4);
  state.stage = 4;
  assert.equal(nextUnvisited(state), 4);
  discover(state, stages[4].object.id);
  assert.equal(nextUnvisited(state), null);
});

test('postęp ma osobny format; stare i uszkodzone zapisy są bezpiecznie odrzucane', () => {
  const valid = {version: 2, stage: 5, progress: [0, 1, 0, 1, 0, 1, 0, 0]};
  assert.deepEqual(restoreState(JSON.stringify(valid)), valid);
  const invalid = [null, 'invalid', '{}',
    JSON.stringify({version: 1, stage: 0, progress: [3, 0, 0]}),
    JSON.stringify({...valid, stage: 8}),
    JSON.stringify({...valid, stage: -1}),
    JSON.stringify({...valid, progress: [0, 0, 0]}),
    JSON.stringify({...valid, progress: [0, 1, 2, 1, 0, 0, 0, 0]}),
    JSON.stringify({...valid, progress: [false, 1, 0, 1, 0, 0, 0, 0]})];
  for (const raw of invalid) assert.deepEqual(restoreState(raw), freshState());
});
