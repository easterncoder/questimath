(function (root) {
  const RANKS = [
    { level: 1, name: "Arithmetic Squire", color: "from-amber-400 to-orange-500", desc: "Embarking on the math odyssey" },
    { level: 2, name: "Number Warrior", color: "from-teal-400 to-emerald-500", desc: "Commanding multi-digit forces" },
    { level: 3, name: "Equation Knight", color: "from-blue-400 to-indigo-500", desc: "Slaying the carrying & borrowing beasts" },
    { level: 4, name: "Math Sorcerer", color: "from-fuchsia-400 to-purple-600", desc: "Unlocking advanced calculation spells" },
    { level: 5, name: "Grandmaster Alchemist", color: "from-rose-400 to-rose-600", desc: "Master of ultimate arithmetic magic" },
    { level: 6, name: "Prime Pathfinder", color: "from-cyan-400 to-sky-600", desc: "Finding patterns in advanced arithmetic" },
    { level: 7, name: "Factor Champion", color: "from-lime-400 to-green-600", desc: "Turning hard products into familiar facts" },
    { level: 8, name: "Decimal Voyager", color: "from-violet-400 to-indigo-600", desc: "Navigating precise decimal challenges" },
    { level: 9, name: "Pattern Oracle", color: "from-pink-400 to-rose-600", desc: "Recognizing structure across every operation" },
    { level: 10, name: "Infinity Archmage", color: "from-yellow-300 to-amber-600", desc: "Opening the endless rank ladder" }
  ];
  const GENERATED_COLORS = [
    "from-cyan-400 to-blue-600",
    "from-emerald-400 to-teal-600",
    "from-violet-400 to-fuchsia-600",
    "from-rose-400 to-orange-600",
    "from-sky-300 to-indigo-600"
  ];
  const GENERATED_PREFIXES = ["Prime", "Radiant", "Vector", "Stellar", "Mythic"];
  const GENERATED_ROLES = ["Solver", "Strategist", "Sage", "Architect", "Virtuoso"];

  /*
   * Converts a saved rank level into a positive whole number.
   */
  function normalizeLevel(level) {
    const parsedLevel = Number.parseInt(level, 10);

    if (!Number.isFinite(parsedLevel) || parsedLevel < 1) {
      return 1;
    }

    return parsedLevel;
  }

  /*
   * Returns the rank metadata for any positive level.
   */
  function getRank(level) {
    const normalizedLevel = normalizeLevel(level);
    const curatedRank = RANKS[normalizedLevel - 1];

    if (curatedRank) {
      return curatedRank;
    }

    const generatedIndex = normalizedLevel - RANKS.length - 1;
    const prefix = GENERATED_PREFIXES[generatedIndex % GENERATED_PREFIXES.length];
    const role = GENERATED_ROLES[Math.floor(generatedIndex / GENERATED_PREFIXES.length) % GENERATED_ROLES.length];
    const cycle = Math.floor(generatedIndex / (GENERATED_PREFIXES.length * GENERATED_ROLES.length)) + 1;

    return {
      level: normalizedLevel,
      name: `${prefix} ${role} ${cycle}`,
      color: GENERATED_COLORS[generatedIndex % GENERATED_COLORS.length],
      desc: `Endless arithmetic rank ${normalizedLevel}`
    };
  }

  /*
   * Returns the total XP needed to start a rank.
   */
  function getRankXpStart(level) {
    return (normalizeLevel(level) - 1) * 100;
  }

  /*
   * Returns the total XP needed to unlock the next rank.
   */
  function getRankXpGoal(level) {
    return normalizeLevel(level) * 100;
  }

  /*
   * Calculates progress toward the next rank as a bounded percentage.
   */
  function getRankProgressPercent(level, xp) {
    const rankStart = getRankXpStart(level);
    const relativeXP = Number(xp) - rankStart;

    return Math.min(Math.max((relativeXP / 100) * 100, 0), 100);
  }

  const progression = {
    RANKS,
    getRank,
    getRankProgressPercent,
    getRankXpGoal,
    getRankXpStart,
    normalizeLevel
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = progression;
  }

  root.QuestiMathRanks = progression;
}(typeof globalThis !== 'undefined' ? globalThis : window));
