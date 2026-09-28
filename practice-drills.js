(function (root) {
  const TABLE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

  /*
   * Builds a multiplication or division fact using one selected table number.
   */
  function buildTargetedProblem(op, targetNumbers, random = Math.random) {
    if (!['*', '/'].includes(op) || targetNumbers.length === 0) {
      return null;
    }

    const target = targetNumbers[Math.floor(random() * targetNumbers.length)];
    const partner = TABLE_NUMBERS[Math.floor(random() * TABLE_NUMBERS.length)];

    if (op === '*') {
      return { num1: target, num2: partner, answer: target * partner };
    }

    return { num1: target * partner, num2: target, answer: partner };
  }

  const practiceDrills = { TABLE_NUMBERS, buildTargetedProblem };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = practiceDrills;
  }

  root.QuestiMathPracticeDrills = practiceDrills;
}(typeof globalThis !== 'undefined' ? globalThis : window));
