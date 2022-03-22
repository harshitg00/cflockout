import { Container, Grid, Button } from "@mui/material";
import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerItem from "../components/PlayerItem";
import ProblemItem from "../components/ProblemItem";
import Timer from "../components/Timer";
import codeforcesService from "../data/codeforcesService";
import { getUnsolvedProblemsWithRating } from "../data/problemsParser";
import {
  getOngoingContest,
  solveProblem,
  startContest,
} from "../features/contest/contestSlice";
import { useSearchParams } from "react-router-dom";
import { SocketContext } from "../context/socket";


const ContestArena = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("contestId");
  const socket = useContext(SocketContext);

  const { ongoingContest, isSuccess, isError, isLoading, message, update } =
    useSelector((state) => state.contest);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getOngoingContest());
  }, [isError, message, dispatch]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    return () => {
      socket.emit('leaveRoom', roomId);
    }
  }, []);

  useEffect(() => {
    if (update) {
      console.log(`The update number is ${update}`);
      socket.emit("updateContest", roomId);
    }
  }, [socket, update, roomId]);

  useEffect(() => {
    socket.on("contestUpdated", (roomId) => {
      console.log("contestUpdated was emitted!", roomId);
      dispatch(getOngoingContest());
    });
    return () => {
      socket.off("contestUpdated");
    };
  }, []);

  if (isLoading) {
    return <></>;
  }

  const handleStartContest = async () => {
    const handles = [];
    const requirements = {};
    for (const contestant of ongoingContest.contestants) {
      handles.push(contestant.username);
    }
    for (const problem of ongoingContest.problems) {
      requirements[problem.rating] = requirements[problem.rating] || 0;
      requirements[problem.rating]++;
    }
    const cfProblems = await getUnsolvedProblemsWithRating(
      handles,
      requirements
    );
    let problems = [];
    for (let problem of ongoingContest.problems) {
      const cfProblem = cfProblems[problem.rating].pop();
      const newProblem = {
        ...problem,
        name: cfProblem.name,
        problemLink: `https://codeforces.com/problemset/problem/${cfProblem.contestId}/${cfProblem.index}`,
      };
      problems.push(newProblem);
    }
    dispatch(
      startContest({
        id: ongoingContest._id,
        problems: problems,
      })
    );
  };

  const updateRankList = async () => {
    // Fetch last 100 submissions for each user.
    // Determine if any user solved the problem.
    dispatch(getOngoingContest());
    const unsolvedProblems = [];
    const handles = [];
    if (ongoingContest) {
      for (const contestant of ongoingContest.contestants) {
        handles.push(contestant.username);
      }
      for (const problem of ongoingContest.problems) {
        if (!problem.isSolved) {
          unsolvedProblems.push(problem.name);
        }
      }
      const winners = await codeforcesService.findWinnerForEachProblem(
        handles,
        unsolvedProblems
      );
      for (const [problem, winner] of Object.entries(winners)) {
        dispatch(
          solveProblem({
            contestId: ongoingContest._id,
            timeStamp: winner.timeStamp,
            problemName: problem,
            username: winner.handle,
          })
        );
      }
    }
  };

  if (!ongoingContest) {
    return <h1>No ongoing contests found!!</h1>;
  }

  const getRemainingTime = () => {
    const date = new Date(ongoingContest.startedAt);
    return date.getTime() + ongoingContest.duration * 60 * 1000;
  };

  return (
    <Container>
      <Timer countDownTimestampInMs={getRemainingTime()}></Timer>
      <h1>Problems</h1>
      {ongoingContest.isStarted ? (
        <Grid container spacing={3}>
          {ongoingContest.problems.map((problem) => {
            return <ProblemItem key={problem.name} problem={problem} />;
          })}
        </Grid>
      ) : user && ongoingContest.admin === user._id ? (
        <Button variant="outlined" onClick={handleStartContest}>
          Start Contest
        </Button>
      ) : (
        <></>
      )}
      <h3>Room Code</h3>
      <h4>{ongoingContest._id}</h4>
      <h1>Participants</h1>
      {ongoingContest ? (
        <Grid container spacing={2}>
          {ongoingContest.contestants.map((contestant) => {
            return (
              <PlayerItem
                key={contestant.username}
                username={contestant.username}
                points={contestant.points}
                rank={contestant.rank}
              />
            );
          })}
          <Button variant="contained" onClick={updateRankList}>
            Refresh Ranklist
          </Button>
        </Grid>
      ) : (
        <h1>Failed</h1>
      )}
    </Container>
  );
};

export default ContestArena;
