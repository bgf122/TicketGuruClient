import React, { useContext } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from "@material-ui/icons/List";
import EventIcon from "@material-ui/icons/Event";
import HomeIcon from "@material-ui/icons/Home";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import LipunTarkastus from "../Lippu/Lipuntarkastus";
import Koti from "../Koti/Koti";
import Lipunmyynti from "../Lippu/Lipunmyynti";
import { AuthContext } from "../../App";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TilausLista from "../Tilaus/Tilauslista";
import RaporttiLista from "../Raportti/RaporttiLista";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Navigator() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { state, dispatch } = useContext(AuthContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <BrowserRouter>
        <CssBaseline />

        <AppBar
          style={{ background: "#121212" }}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" noWrap>
              TicketGuru
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>

          <List component="nav">
            <nav>
              <ListItem button={true} {...{ component: NavLink, to: "/" }}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Koti"> </ListItemText>
              </ListItem>
              <ListItem
                button={true}
                {...{ component: NavLink, to: "/tilaukset" }}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="Tilaukset"></ListItemText>
              </ListItem>

              <ListItem
                button={true}
                {...{ component: NavLink, to: "/lipunmyynti" }}
              >
                <ListItemIcon>
                  <ShoppingBasket />
                </ListItemIcon>
                <ListItemText primary="Lipunmyynti"></ListItemText>
              </ListItem>
              <ListItem
                button={true}
                {...{ component: NavLink, to: "/raportit" }}
              >
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Myyntiraportit"></ListItemText>
              </ListItem>
              <ListItem
                button={true}
                {...{ component: NavLink, to: "/tarkastus" }}
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon />
                </ListItemIcon>
                <ListItemText primary="Lipuntarkastus"></ListItemText>
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  dispatch({
                    type: "LOGOUT",
                  })
                }
                {...{ component: NavLink, to: "/" }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Kirjaudu ulos"></ListItemText>
              </ListItem>
            </nav>
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />

          <Switch>
            <Route exact path="/" component={Koti} />
            <Route path="/raportit" component={RaporttiLista} />
            <Route path="/tilaukset" component={TilausLista} />
            <Route path="/tarkastus" component={LipunTarkastus} />
            <Route path="/lipunmyynti" component={Lipunmyynti} />
            <Route render={() => <h1>Sivua ei löydy!</h1>} /> <br />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}
