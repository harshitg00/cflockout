import { Grid, Paper } from "@mui/material";
import React from "react";

const PlayerItem = (props) => {
  return (
    <Grid item xs={12}>
      <Paper variant="elevation">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <h3>{props.rank}</h3>
          </Grid>
          <Grid item xs={4}>
            <h3>{props.username}</h3>
          </Grid>
          <Grid item xs={4}>
            <h3>{props.points}</h3>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default PlayerItem;
