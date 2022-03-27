import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
const pages = ["Home", "Dashboard", "My Contests"];

const DrawerComp = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  const handleListItemClick = (index) => {
    if (index === 0) {
      navigate("/");
    } else if (index === 1) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <React.Fragment>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          {pages.map((page, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                handleListItemClick(index);
                props.handleValue(index);
              }}
            >
              <ListItemIcon>
                <ListItemText>{page}</ListItemText>
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <IconButton
        sx={{ color: "white", marginLeft: "10" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon color="white" />
      </IconButton>
    </React.Fragment>
  );
};

export default DrawerComp;
