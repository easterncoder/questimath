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

test('correct answer pitch rises with the streak and stops rising after 15', () => {
  const frequencies = [];
  const mockCtx = {
    currentTime: 0,
    destination: {},
    createOscillator: () => ({
      connect: () => {},
      frequency: {
        setValueAtTime: value => frequencies.push(value),
        exponentialRampToValueAtTime: () => {}
      },
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({
      connect: () => {},
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
    })
  };

  [1, 5, 10, 15, 20].forEach(streak => audioSynth.playSound('correct', false, mockCtx, streak));
  assert.equal(frequencies[0], 523.25);
  assert.ok(frequencies[0] < frequencies[1]);
  assert.ok(frequencies[1] < frequencies[2]);
  assert.ok(frequencies[2] < frequencies[3]);
  assert.equal(frequencies[3], frequencies[4]);
});
