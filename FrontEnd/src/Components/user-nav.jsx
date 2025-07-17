import React from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

export function UserNav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          src="/placeholder.svg"
          alt="Chef Maria"
          sx={{ width: 40, height: 40 }}
        >
          CH
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 220, mt: 1.5 },
        }}
      >
        <div style={{ padding: "10px 16px" }}>
          <Typography variant="subtitle1">Chef Maria</Typography>
          <Typography variant="body2" color="text.secondary">
            chef@restaurant.com
          </Typography>
        </div>
        <Divider />
        <MenuItem>
          <AccountCircleIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem>
          <NotificationsIcon sx={{ mr: 1 }} /> Notifications
        </MenuItem>
        <Divider />
        <MenuItem>
          <LogoutIcon sx={{ mr: 1 }} /> Log out
        </MenuItem>
      </Menu>
    </div>
  );
}
