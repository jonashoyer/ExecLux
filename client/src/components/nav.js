import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';

import {Store} from '../components/context';

import DialogProjectMenu from '../components/dialogs/projectMenu';
import { Icon } from '@material-ui/core';
import IconViewCol from '@material-ui/icons/ViewCarousel';
import IconSettings from '@material-ui/icons/SettingsApplications';
import IconTimeline from '@material-ui/icons/Timeline';
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    padding: '0 16px',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  projectSelecter: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing.unit * 2,
    marginRight: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawer:{
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    paddingTop: theme.mixins.toolbar.minHeight,
  },
  drawerRoot:{
    zIndex:1000
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  link:{
    textDecoration:'none',
    color:'inherit',
    outline:'none'
  }
}));

const Nav = props => {

  const classes = useStyles();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isDrawerOpen,setIsDrawerOpen] = React.useState(false);
  const store = React.useContext(Store);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  function projectMenuHandleClick(event) {
    store.setDialog(DialogProjectMenu);
  }

  function handleDrawerOpen(){
    setIsDrawerOpen(true);
  }

  function handleDrawerClose(){
    setIsDrawerOpen(false);
  }


  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link className={classes.link} to="/account">
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Link>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton className={classes.menuButton} onClick={handleDrawerOpen} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Link to='/' className={`${classes.link} ${classes.title}`}>
            <Typography variant="h6" color="inherit" noWrap>
              Exec Lux
            </Typography>
          </Link>
          {store.hasAuth && <div
            className={classes.projectSelecter}
            >
            <Button 
              variant="outlined"
              color="inherit"
              onClick={projectMenuHandleClick}>
                {store.projectName || "No project"}
                <ArrowDropDown />
              </Button>
          </div>}
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div> */}


          <div className={classes.grow} />
          {store.hasAuth && <div className={classes.sectionDesktop}>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              aria-owns={isMenuOpen ? 'material-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>}
          {store.hasAuth && <div className={classes.sectionMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawer,
          root: classes.drawerRoot
        }}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <div />
        <Divider />
        <List>
          
          {[{title:'Project',to:'/',icon:<IconViewCol />},{title:'Settings',to:'/project/settings',icon:<IconSettings />}].map((e, i) => (
            <Link key={i} className={classes.link} to={e.to} onClick={handleDrawerClose}>
              <ListItem button>
                <ListItemIcon>
                  {e.icon}
                </ListItemIcon>
                <ListItemText primary={e.title} />
              </ListItem>
            </Link>
          ))}

        </List>
        <Divider />
        <List>

          {[{title:'Performance',to:'/performance',icon:<IconTimeline />}].map((e, i) => (
            <Link key={i} className={classes.link} to={e.to} onClick={handleDrawerClose}>
              <ListItem button>
                <ListItemIcon>
                  {e.icon}
                </ListItemIcon>
                <ListItemText primary={e.title} />
              </ListItem>
            </Link>
          ))}

        </List>
      </Drawer>
        
      {renderMenu}
      {renderMobileMenu}
    </div>
  );
}

export default Nav;
