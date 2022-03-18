import axios from "axios";
import { CF_API_URL } from "../config/constants";

async function sleep(timeInMilliSeconds) {
  return new Promise((resolve) => setTimeout(resolve, timeInMilliSeconds));
}

// Make a Codeforces API request.
const makeCodeforcesRequest = async (config) => {
  let tries = 0;
  while (tries < 5) {
    tries += 1;
    try {
      const data = await axios
        .request(config)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      if (data.status && data.status === "OK") return data;
      await sleep(1000);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    status: "FAILED",
    comment: "Codeforces request failed.",
    result: {
      problems: [],
    },
  };
};

// Fetches user's x submissions.
const fetchUserSubmissions = async (handle, from = 1, count = 100000) => {
  return await makeCodeforcesRequest({
    method: "get",
    url: `${CF_API_URL}/user.status/`,
    params: {
      handle: handle,
      from: from,
      count: count,
    },
  });
};

// Fetch problems of a specific rating.
const fetchProblems = async () => {
  const response = await makeCodeforcesRequest({
    method: "get",
    url: `${CF_API_URL}/problemset.problems/`,
  });
  if (response.result.problems) return response.result.problems;
  return [];
};

// Determine the first person to solve each problem.
const findWinnerForEachProblem = async (handles, problemNames) => {
  const winners = {};
  for (const handle of handles) {
    const response = await fetchUserSubmissions(handle, 1, 100);
    if (response.result) {
      for (const submission of response.result) {
        if (submission.verdict !== "OK") continue;
        for (const problemName of problemNames) {
          if (submission.problem.name === problemName) {
            if (
              !winners[problemName] ||
              winners[problemName].timeStamp > submission.creationTimeSeconds
            ) {
              winners[problemName] = {
                handle,
                timeStamp: submission.creationTimeSeconds,
              };
            }
          }
        }
      }
    }
  }
  return winners;
};

const codeforcesService = {
  fetchUserSubmissions,
  fetchProblems,
  findWinnerForEachProblem,
};

export default codeforcesService;
