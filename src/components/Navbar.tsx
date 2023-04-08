import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  Toolbar,
  Tooltip,
  styled,
} from "@mui/material";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import zIndex from "@mui/material/styles/zIndex";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { alignProperty } from "@mui/material/styles/cssUtils";

const pages = ["About", "Projects"];
const settings = ["Login", "Register"];

const StyledToolBar = styled(Toolbar)({
  height: "75px",
  padding: '2px 10%',
  display: "flex",
  justifyContent: "space-between",
  color: "black",
  
});

const NavButtons = styled(Button)({
  color: "black",
  display: "block",
  fontSize: 20,
  fontFamily: "Inter",
  fontWeight: 400,
  letterSpacing: 2,
  textTransform: "capitalize",
  '&:hover': {
  

    
  }

});
{/*Navigation Bar*/}
function ResponsiveAppBar() {
  {/*Functionality for opening/closing sidebar*/}
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  {/*Navigation Functionality + Routing*/}
  const navigate = useNavigate();
  const goToPage = (pageName: any) => {
    navigate("/" + pageName);
  };
  {/*App Bar*/}
  return (
    <AppBar position="static" sx={{bgcolor: "white", zIndex: "100"}}>
      <Container maxWidth={false} disableGutters>
        <StyledToolBar disableGutters>
          {/*Desktop Logo*/}
          <Box display="flex" gap="25px">
            <Link to="/">
              <Box
                component="img"
                src={Logo}
                alt="logo"
                
                sx={{
                  width: '200px',
                  height: 'auto',
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              ></Box>
            </Link>
            {/*This is the side bar for mobile*/}
            <Box
              gap="25px"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
                      goToPage(page);
                    }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/*Mobile Logo*/}
            <Link to="/">
              <Box
                component="img"
                src={Logo}
                alt="logo"
                sx={{
                  flexGrow: 1,
                  width: '200px',
                  height: 'auto',
                  display: { xs: "flex", md: "none" },
                  boxSizing: "border-box"
                }}
              ></Box>
            </Link>

            {/* The nav barpage links*/}
            <Box
              gap="15px"
              sx={{
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <NavButtons
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    goToPage(page);
                  }}
                >
                  {page}
                </NavButtons>
              ))}
            </Box>
          </Box>
          {/* This is for the right hand side of the Nav Bar*/}
          <Box
            gap="20px"
            sx={{

              display: { xs: "none", md: "flex" },
            }}
          >
            <SearchBar />
            <Button variant="outlined">Log in</Button>
            <Button variant="contained">Sign up</Button>
          </Box>
          {/*RHS for Mobile/Smaller Screens*/}
          <Box sx={{flexGrow: 1, display: { xs: "flex", md: "none"}, justifyContent: 'flex-end'}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Not Logged In" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </StyledToolBar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
