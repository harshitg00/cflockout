import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinContest } from "../features/contest/contestSlice";

const Dashboard = () => {
  const [contestId, setContestId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ongoingContest, isError, isSuccess, message } = useSelector(
    (state) => state.contest
  );

  const handleJoinRoom = () => {
    dispatch(joinContest(contestId));
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (isSuccess || ongoingContest) {
      navigate("/contest/arena");
    }
  }, [ongoingContest, isSuccess, isError, message, navigate]);

  const onChange = (e) => {
    setContestId(e.target.value);
  };

  return (
    <Container
      component="main"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 8,
          minWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={8}>
            <TextField
              id="joinContest"
              label="Enter room code"
              variant="outlined"
              onChange={onChange}
              value={contestId}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleJoinRoom}>
              Join Room
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained">Create Room</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
