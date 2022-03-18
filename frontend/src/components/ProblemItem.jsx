import { Grid, Link, Paper } from "@mui/material";
import React from "react";

const ProblemItem = ({ problem }) => {
  return (
    <Grid item xs={12}>
      <Paper variant="elevation">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Link
              href={problem.problemLink}
              target="_blank"
              rel="noopener"
            >
              {problem.name}
            </Link>
          </Grid>
          <Grid item xs={4}>
            <h3>{problem.rating}</h3>
          </Grid>
          <Grid item xs={4}>
            <h3>{problem.points}</h3>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ProblemItem;
