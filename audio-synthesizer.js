(function (root) {
  /*
   * Synthesizes audio tones using Web Audio API for game events.
   */
  function playSound(type, isMuted, audioContextOverride) {
    if (isMuted) {
      return false;
    }

    try {
      const AudioCtx = audioContextOverride || (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));

      if (!AudioCtx) {
        return false;
      }

      const ctx = typeof AudioCtx === 'function' ? new AudioCtx() : AudioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime || 0;

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'levelUp') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const oscN = ctx.createOscillator();
          const gainN = ctx.createGain();
          oscN.connect(gainN);
          gainN.connect(ctx.destination);
          oscN.type = 'sine';
          oscN.frequency.setValueAtTime(freq, now + idx * 0.08);
          gainN.gain.setValueAtTime(0.04, now + idx * 0.08);
          gainN.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
          oscN.start(now + idx * 0.08);
          oscN.stop(now + idx * 0.08 + 0.5);
        });
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      }

      return true;
    } catch (e) {
      console.warn("Audio context not allowed or unsupported:", e);
      return false;
    }
  }

  const synthesizer = {
    playSound
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = synthesizer;
  }

  root.QuestiMathAudioSynthesizer = synthesizer;
}(typeof globalThis !== 'undefined' ? globalThis : window));
