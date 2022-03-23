import React, { useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import DrawerComp from "./Drawer";
import { Link, useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

const NavBar = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const handleValue = (index) => {
    setValue(index);
  };

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          {isMatch ? (
            <>
              <DrawerComp handleValue={handleValue} />
              <Typography
                sx={{
                  fontSize: "2rem",
                  paddingLeft: "1%",
                  paddingRight: "10%",
                }}
              >
                CfLockOut
              </Typography>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: "2rem",
                  paddingLeft: "1%",
                  paddingRight: "2%",
                }}
              >
                CfLockOut
              </Typography>
              <Tabs
                sx={{ marginRight: "auto" }}
                indicatorColor="secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                <Tab
                  label="Home"
                  onClick={() => {
                    navigate("/");
                  }}
                />
                <Tab
                  label="Dashboard"
                  onClick={() => {
                    if (user) {
                      navigate("/dashboard");
                    } else {
                      navigate("/login");
                      setValue(0);
                    }
                  }}
                />
                <Tab
                  label="My Contests"
                  onClick={() => {
                    if (user) {
                      navigate("/");
                    } else {
                      navigate("/login");
                      setValue(0);
                    }
                  }}
                />
              </Tabs>
            </>
          )}

          {user ? (
            <>
              <ProfileAvatar handleValue={handleValue} />
            </>
          ) : (
            <>
              <Button
                sx={{ marginLeft: "auto" }}
                variant="contained"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>

              <Button
                sx={{ marginLeft: "10px" }}
                variant="contained"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                SignUp
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
export default NavBar;
