(function (root) {
  const ANSWER_TOLERANCE = 0.000001;

  /*
   * Converts a user-entered answer into a valid number or null.
   */
  function parseAnswer(value) {
    const normalizedValue = String(value).trim();

    if (normalizedValue === '') {
      return null;
    }

    if (!/^-?\d+(?:\.\d+)?$/.test(normalizedValue)) {
      return null;
    }

    return Number(normalizedValue);
  }

  /*
   * Checks a parsed user answer against the expected problem answer.
   */
  function isCorrectAnswer(userAnswer, expectedAnswer) {
    const parsedAnswer = parseAnswer(userAnswer);

    if (parsedAnswer === null) {
      return false;
    }

    return Math.abs(parsedAnswer - Number(expectedAnswer)) < ANSWER_TOLERANCE;
  }

  const validation = {
    parseAnswer,
    isCorrectAnswer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = validation;
  }

  root.QuestiMathValidation = validation;
}(typeof globalThis !== 'undefined' ? globalThis : window));
