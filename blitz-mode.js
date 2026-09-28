(function (root) {
  const HIGH_SCORE_KEY = 'questimath.blitz.highScore.v1';
  const ROUND_SECONDS = 60;
  const BONUS_SECONDS = 2;
  const RAPID_ANSWER_SECONDS = 5;

  /*
   * Returns whole seconds left using the actual deadline, even after a tab sleeps.
   */
  function secondsRemaining(deadline, now) {
    return Math.max(0, Math.ceil((deadline - now) / 1000));
  }

  /*
   * Adds bonus time only for a correct answer submitted within the rapid window.
   */
  function awardBonus(deadline, correct, elapsedSeconds) {
    return correct && elapsedSeconds <= RAPID_ANSWER_SECONDS
      ? deadline + BONUS_SECONDS * 1000
      : deadline;
  }

  /*
   * Reads the device's best completed Blitz score.
   */
  function loadHighScore(storage) {
    try {
      const score = Number(storage.getItem(HIGH_SCORE_KEY));
      return Number.isSafeInteger(score) && score > 0 ? score : 0;
    } catch (error) {
      return 0;
    }
  }

  /*
   * Persists and returns the best completed Blitz score.
   */
  function saveHighScore(storage, score, currentBest) {
    const best = Math.max(currentBest, score);

    if (best > currentBest) {
      try {
        storage.setItem(HIGH_SCORE_KEY, String(best));
      } catch (error) {
        console.warn('Blitz high score could not be saved.', error);
      }
    }

    return best;
  }

  const blitzMode = {
    ROUND_SECONDS,
    BONUS_SECONDS,
    RAPID_ANSWER_SECONDS,
    secondsRemaining,
    awardBonus,
    loadHighScore,
    saveHighScore
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = blitzMode;
  }

  root.QuestiMathBlitz = blitzMode;
}(typeof globalThis !== 'undefined' ? globalThis : window));
