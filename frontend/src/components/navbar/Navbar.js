import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from '@reach/router';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.handleMenu = this.handleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  closeMenu() {
    this.setState({ anchorEl: null });
  }

  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static" style = {{backgroundColor:"#74BA95"}}>
          <Toolbar>
            <Link component={RouterLink} to="/" style={{ flexGrow: 1 }}>
              <Button style={{ textTransform: "none", color: "#fff" }}>
                <Typography variant="h6">
                  SympTUM
                </Typography>
              </Button>
            </Link>
            {this.renderUserGreeting()}
            {this.renderButtons()}
            {this.renderMenuButtons()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  renderUserGreeting() {
    return this.props.displayName ? (
      <Typography fontWeight="fontWeightLight">
        Welcome {this.props.displayName} |
      </Typography>
    ) : null;
  }

  renderButtons = () => {
    if (!this.props.rightButtons) {
      return;
    }

    return (
      <div>
        {this.props.rightButtons.map(b => {
          if(b.linkTo === undefined){
            return (
              <Button key={b.key} color="inherit" onClick={b.onClick}>
                {b.title}
              </Button>
            );
          }else{
            return (
              <Link key={b.key} component={RouterLink} to={b.linkTo} style={{ flexGrow: 1 }}>
                <Button style={{color: "white"}} onClick={b.onClick}>
                  {b.title}
                </Button>
              </Link>
            );
          }
        })}
      </div>
    );
  };

  renderMenuButtons() {
    if (!this.props.rightMenuButtons) {
      return;
    }

    const open = Boolean(this.state.anchorEl);
    return (
      <div>
        <IconButton onClick={this.handleMenu} color="inherit">
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={this.closeMenu}
        >
          {this.props.rightMenuButtons.map(b => {
            return (
              <MenuItem key={b.key} onClick={b.onClick}>
                {b.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default Navbar;

Navbar.propTypes = {
  // Display name of the currently logged in user
  displayName: PropTypes.string,

  // Button appearing right side of navigation bar.
  rightButtons: PropTypes.arrayOf(
    PropTypes.shape(
      {
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      }.isRequired
    )
  ),

  rightMenuButtons: PropTypes.arrayOf(
    PropTypes.shape(
      {
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      }.isRequired
    )
  ),
};
