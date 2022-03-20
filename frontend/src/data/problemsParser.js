import codeforcesService from "./codeforcesService";

const getSolvedProblemsByAllUsers = async (handles) => {
  const solvedProblems = new Set();
  for (const handle of handles) {
    const submissions = await codeforcesService.fetchUserSubmissions(handle);
    for (const submission of submissions.result) {
      if (submission.verdict === "OK")
        solvedProblems.add(submission.problem.name);
    }
  }
  return solvedProblems;
};

const getUnsolvedProblemsWithRating = async (handles, requirements) => {
  const solvedProblems = await getSolvedProblemsByAllUsers(handles);
  const allProblems = await codeforcesService.fetchProblems();
  const problems = {};
  for (const rating of Object.keys(requirements)) problems[rating] = [];
  for (const problem of allProblems) {
    if (solvedProblems.has(problem.name) || !problem.rating) continue;
    for (const [rating, required] of Object.entries(requirements)) {
      if (
        rating === problem.rating.toString() &&
        problems[rating].length < required
      ) {
        problems[rating].push(problem);
      }
    }
    let fetchedAllProblems = true;
    for (const [rating, required] of Object.entries(requirements)) {
      if (problems[rating].length < required) {
        fetchedAllProblems = false;
      }
    }
    if (fetchedAllProblems) break;
  }
  return problems;
};

export { getUnsolvedProblemsWithRating, getSolvedProblemsByAllUsers };
