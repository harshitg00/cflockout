import { Card, CardContent, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getRemainingTimeUntilTimeStamp } from "./utils/TimerUtils";

const Timer = ({ countDownTimestampInMs }) => {
  const defaultRemainingTime = {
    minutes: 0,
    seconds: 0,
  };

  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(getRemainingTimeUntilTimeStamp(countDownTimestampInMs));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countDownTimestampInMs]);

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, align: "center" }}
          color="text.secondary"
          gutterBottom
        >
          Time remaining
        </Typography>
        <Typography
          sx={{ fontSize: 14, align: "center" }}
          color="text.secondary"
          gutterBottom
        >
          {`Minutes: ${remainingTime.minutes} Seconds: ${remainingTime.seconds}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Timer;
