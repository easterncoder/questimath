const test = require('node:test');
const assert = require('node:assert/strict');
const audioSynth = require('../audio-synthesizer.js');

test('audio synthesizer returns false when muted', () => {
  const result = audioSynth.playSound('correct', true);
  assert.equal(result, false);
});

test('audio synthesizer handles supported sound types with mock audio context', () => {
  const mockCtx = {
    currentTime: 0,
    destination: {},
    createOscillator: () => ({
      connect: () => {},
      type: '',
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({
      connect: () => {},
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
    })
  };

  assert.equal(audioSynth.playSound('correct', false, mockCtx), true);
  assert.equal(audioSynth.playSound('wrong', false, mockCtx), true);
  assert.equal(audioSynth.playSound('levelUp', false, mockCtx), true);
  assert.equal(audioSynth.playSound('click', false, mockCtx), true);
});
