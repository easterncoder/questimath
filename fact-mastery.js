(function (root) {
  const GRID_SIZE = 12;
  const MASTERY_ATTEMPTS = 3;
  const MASTERY_ACCURACY = 90;
  const FREQUENT_MISS_ACCURACY = 70;
  const FAST_SECONDS = 5;

  /*
   * Returns the stored key for an ordered multiplication or division fact.
   */
  function getFactKey(op, num1, num2) {
    return `${op}:${num1}:${num2}`;
  }

  /*
   * Maps a grid row and column to the problem shown to the learner.
   */
  function getGridFact(op, row, column) {
    if (op === '*') {
      return { num1: row, num2: column, label: `${row} × ${column}` };
    }

    return { num1: row * column, num2: column, label: `${row * column} ÷ ${column}` };
  }

  /*
   * Builds a random multiplication or division fact from the mastery grid.
   */
  function getRandomPracticeFact(op, random = Math.random) {
    if (!['*', '/'].includes(op)) {
      return null;
    }

    const first = Math.floor(random() * GRID_SIZE) + 1;
    const second = Math.floor(random() * GRID_SIZE) + 1;

    if (op === '*') {
      return { num1: first, num2: second, answer: first * second };
    }

    return { num1: first * second, num2: second, answer: first };
  }

  /*
   * Adds a submitted fact attempt without relying on capped answer history.
   */
  function recordFactAttempt(facts, problem, correct, seconds) {
    if (!problem || !['*', '/'].includes(problem.op) ||
      !Number.isInteger(problem.num1) || !Number.isInteger(problem.num2) ||
      problem.num2 < 1 || problem.num2 > GRID_SIZE ||
      (problem.op === '*' && (problem.num1 < 1 || problem.num1 > GRID_SIZE)) ||
      (problem.op === '/' && (!Number.isInteger(problem.num1 / problem.num2) ||
        problem.num1 / problem.num2 < 1 || problem.num1 / problem.num2 > GRID_SIZE))) {
      return facts || {};
    }

    const key = getFactKey(problem.op, problem.num1, problem.num2);
    const previous = (facts && facts[key]) || {};
    const duration = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;

    return {
      ...(facts || {}),
      [key]: {
        attempts: (previous.attempts || 0) + 1,
        correct: (previous.correct || 0) + (correct ? 1 : 0),
        correctSeconds: (previous.correctSeconds || 0) + (correct ? duration : 0)
      }
    };
  }

  /*
   * Summarizes accuracy, speed, and color for one stored fact.
   */
  function getFactSummary(fact) {
    const attempts = fact && Number.isFinite(fact.attempts) ? fact.attempts : 0;
    const correct = fact && Number.isFinite(fact.correct) ? fact.correct : 0;

    if (attempts < 1) {
      return { attempts: 0, accuracy: 0, averageSeconds: null, status: 'untried' };
    }

    const accuracy = Math.round((correct / attempts) * 100);
    const averageSeconds = correct > 0 ? (fact.correctSeconds || 0) / correct : null;
    let status = 'practicing';

    if (attempts >= 2 && accuracy < FREQUENT_MISS_ACCURACY) {
      status = 'misses';
    } else if (attempts >= MASTERY_ATTEMPTS && accuracy >= MASTERY_ACCURACY &&
      averageSeconds !== null && averageSeconds <= FAST_SECONDS) {
      status = 'mastered';
    }

    return { attempts, accuracy, averageSeconds, status };
  }

  const mastery = {
    GRID_SIZE,
    getFactKey,
    getGridFact,
    getRandomPracticeFact,
    recordFactAttempt,
    getFactSummary
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mastery;
  }

  root.QuestiMathFactMastery = mastery;
}(typeof globalThis !== 'undefined' ? globalThis : window));
