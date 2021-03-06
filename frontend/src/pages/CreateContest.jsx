import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  MAX_NUMBER_OF_PROBLEMS,
  MIN_DURATION,
  MAX_DURATION,
} from "../config/constants";
import { reset, createContest } from "../features/contest/contestSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";

const CreateContest = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultProblem = {
    name: "Default Problem",
    problemLink: "Problem Link",
    problemId: "0",
    points: 50,
    rating: 1500,
  };

  const [contestProblems, setContestProblems] = useState([defaultProblem]);
  const [duration, setDuration] = useState(100);

  const { ongoingContest, isError, isSuccess, message } = useSelector(
    (state) => state.contest
  );

  useEffect(() => {
    if (isError) {
      // TODO: Display a snackbar that shows `message`.
    }
    // TODO: Restrict opening this page if a contest is already running.
    if (isSuccess || ongoingContest) {
      navigate(`/contest/arena?contestId=${ongoingContest._id}`);
    }
    dispatch(reset());
  }, [ongoingContest, isError, isSuccess, message, navigate, dispatch]);

  const onChangeProblem = (index) => (e) => {
    // console.log("Index changed is ", index)
    let updatedProblems = [...contestProblems];
    updatedProblems[index][e.target.name] = e.target.value;
    setContestProblems(updatedProblems);
  };

  const onChangeDuration = (e) => {
    setDuration(e.target.value);
  };

  const handleAddProblem = () => {
    if (contestProblems.length >= MAX_NUMBER_OF_PROBLEMS) {
      // TODO: Display alert that maximum number of contestProblems is 5.
      return;
    }
    setContestProblems((previousState) => [
      ...previousState,
      {
        problemId: contestProblems.length.toString(),
        points: 50,
        rating: 1500,
        name: "Default Problem",
        problemLink: "Problem Link",
      },
    ]);
  };

  const handleRemoveProblem = (removedProblemIndex) => {
    let newProblems = contestProblems.filter(
      (problem, index) => index !== removedProblemIndex
    );
    setContestProblems(newProblems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      createContest({
        duration,
        problems: contestProblems,
      })
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ mt: "4%", bgcolor: "secondary.main" }}>
          <CodeIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ m: "4%" }}>
          Create a new Lockout Contest
        </Typography>
        <TextField
          name="duration"
          id="duration"
          fullWidth
          margin="normal"
          label="Duration of the contest"
          autoFocus
          variant="outlined"
          type="number"
          value={duration}
          inputProps={{ min: MIN_DURATION, max: MAX_DURATION }}
          onChange={onChangeDuration}
        />

        {contestProblems.map((problem, index) => {
          return (
            <Grid
              key={index}
              container
              spacing={4}
              sx={{ marginY: 2, alignItems: "center" }}
            >
              <Grid item xs={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DeleteRoundedIcon
                    cursor="pointer"
                    className="svg_icons"
                    id="remove"
                    onClick={() => {
                      handleRemoveProblem(index);
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name="points"
                  id="points"
                  label="Points"
                  autoFocus
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={problem.points}
                  inputProps={{ min: 1, max: 100 }}
                  onChange={onChangeProblem(index)}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name="rating"
                  id="rating"
                  fullWidth
                  label="Codeforces Rating"
                  autoFocus
                  variant="outlined"
                  type="number"
                  value={problem.rating}
                  inputProps={{ step: 100, min: 800, max: 2500 }}
                  onChange={onChangeProblem(index)}
                />
              </Grid>
            </Grid>
          );
        })}

        <Button variant="contained" onClick={handleAddProblem} sx={{ mt: 4 }}>
          + Add problem
        </Button>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Create Contest
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CreateContest;
