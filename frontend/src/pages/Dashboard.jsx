import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const Dashboard = () => {
  
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
        <Grid container spacing={2} direction='row' alignItems='center' justify='center'>
          <Grid item xs={8}>
            <TextField
              id="joinContest"
              label="Enter room code"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained">Join Room</Button>
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
