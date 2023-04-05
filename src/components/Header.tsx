import { FC, useCallback, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderDrawer } from "./HeaderDrawer";

const navItems = ["Dashboard", "About"];
const appName = "Automatic Cloud Resizing Tool";

export const Header: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerOpen = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          {appName}
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navItems.map((item) => (
            <Button key={item} sx={{ color: "#fff" }}>
              {item}
            </Button>
          ))}
        </Box>
      </Toolbar>
      <HeaderDrawer
        navItems={navItems}
        open={mobileOpen}
        onClose={handleDrawerClose}
        title={appName}
      />
    </AppBar>
  );
};
