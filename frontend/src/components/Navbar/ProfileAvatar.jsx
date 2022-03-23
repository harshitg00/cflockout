import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function ProfileAvatar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <Avatar
        src="/broken-image.jpg"
        sx={{ marginLeft: 2 }}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logout());
            props.handleValue(0);
            navigate("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ProfileAvatar;
