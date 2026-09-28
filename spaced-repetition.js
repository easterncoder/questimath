(function (root) {
  const FIRST_REVIEW_GAP = 3;
  const SECOND_REVIEW_GAP = 7;

  /*
   * Returns the first missed problem ready for another quest.
   */
  function getDueReview(problems, answeredCount) {
    return problems.find(problem => (problem.nextReviewAt ?? 0) <= answeredCount) || null;
  }

  /*
   * Records a miss and schedules its next review after three other answers.
   */
  function recordMiss(problems, currentProblem, answeredCount, id) {
    if (currentProblem.reviewId) {
      return problems.map(problem => problem.id === currentProblem.reviewId
        ? { ...problem, correctReviews: 0, nextReviewAt: answeredCount + FIRST_REVIEW_GAP }
        : problem);
    }

    const missedProblem = {
      id,
      num1: currentProblem.num1,
      num2: currentProblem.num2,
      op: currentProblem.op,
      answer: currentProblem.answer,
      missingOperand: currentProblem.missingOperand,
      result: currentProblem.result,
      correctReviews: 0,
      nextReviewAt: answeredCount + FIRST_REVIEW_GAP
    };

    return [missedProblem, ...problems];
  }

  /*
   * Retires a problem after two correct reviews or schedules the second review.
   */
  function recordCorrectReview(problems, reviewId, answeredCount) {
    if (!reviewId) {
      return problems;
    }

    return problems.flatMap(problem => {
      if (problem.id !== reviewId) {
        return [problem];
      }

      const correctReviews = (problem.correctReviews || 0) + 1;

      return correctReviews >= 2
        ? []
        : [{ ...problem, correctReviews, nextReviewAt: answeredCount + SECOND_REVIEW_GAP }];
    });
  }

  const spacedRepetition = {
    getDueReview,
    recordMiss,
    recordCorrectReview
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = spacedRepetition;
  }

  root.QuestiMathSpacedRepetition = spacedRepetition;
}(typeof globalThis !== 'undefined' ? globalThis : window));
