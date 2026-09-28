(function (root) {
  const FLAME_TIERS = [
    { minimum: 15, name: 'Blue flame', color: 'text-sky-300', border: 'border-sky-400/40', glow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]' },
    { minimum: 10, name: 'Purple flame', color: 'text-purple-300', border: 'border-purple-400/40', glow: 'shadow-[0_0_18px_rgba(192,132,252,0.25)]' },
    { minimum: 5, name: 'Orange flame', color: 'text-orange-300', border: 'border-orange-400/40', glow: 'shadow-[0_0_16px_rgba(251,146,60,0.2)]' },
    { minimum: 0, name: 'Streak', color: 'text-orange-400', border: 'border-orange-500/20', glow: '' }
  ];

  /*
   * Returns the visual treatment for the current streak.
   */
  function getFlameTier(streak) {
    return FLAME_TIERS.find(tier => streak >= tier.minimum);
  }

  /*
   * Gives a brief touch response when supported by the device.
   */
  function vibrateForAnswer(correct, previousStreak, navigatorOverride) {
    const device = navigatorOverride || (typeof navigator !== 'undefined' ? navigator : null);

    if (!device || typeof device.vibrate !== 'function' || (!correct && previousStreak < 1)) {
      return false;
    }

    return device.vibrate(correct ? 15 : [25, 35, 25]);
  }

  const feedback = { getFlameTier, vibrateForAnswer };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = feedback;
  }

  root.QuestiMathStreakFeedback = feedback;
}(typeof globalThis !== 'undefined' ? globalThis : window));
