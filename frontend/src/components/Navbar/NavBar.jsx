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
import { useNavigate, useLocation } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

const NavBar = () => {
  const location = useLocation();

  let defaultValue = 0;

  if (location.pathname === "/") defaultValue = 0;
  else if (location.pathname === "/dashboard") defaultValue = 1;
  else defaultValue = 1;

  const [value, setValue] = useState(defaultValue);
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
              >
                <Tab
                  label="Home"
                  onClick={() => {
                    navigate("/");
                    setValue(0);
                  }}
                />
                <Tab
                  label="Dashboard"
                  onClick={() => {
                    if (user) {
                      navigate("/dashboard");
                      setValue(1);
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
                      setValue(2);
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
