import { Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinContest } from "../features/contest/contestSlice";
import Alert from "../components/Alert";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Spinner from "../components/Spinner";
import { SocketContext } from "../context/socket";

const Dashboard = () => {
  const theme = createTheme();

  const [contestId, setContestId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const { ongoingContest, isError, isSuccess, message, isLoading, update } =
    useSelector((state) => state.contest);

  const handleJoinRoom = () => {
    dispatch(joinContest(contestId));
    socket.emit("joinRoom", contestId);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (update && contestId) {
      console.log(`This is udpate - ${update}`);
      socket.emit("updateContest", contestId);
    }
  }, [update, socket, contestId]);

  useEffect(() => {
    if (isError) {
      setSnackbarOpen(true);
      console.log("Dashboard: ", message);
    }
    if (ongoingContest) {
      socket.emit("leaveRoom", ongoingContest._id);
      navigate(`/contest/arena?contestId=${ongoingContest._id}`);
    }
  }, [ongoingContest, isSuccess, isError, message, navigate]);

  const onChange = (e) => {
    setContestId(e.target.value);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Invalid Contest ID
        </Alert>
      </Snackbar>
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
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/contest/create");
                }}
              >
                Create Room
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
