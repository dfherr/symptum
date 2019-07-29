import React from "react";
import Box from "@material-ui/core/Box";
import { Paper } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Navbar from "../../components/navbar/Navbar";
import LoginForm from "../../components/login_form/LoginForm";
import "./LoginPage.css";
import RegisterForm from "../../components/register_form/RegisterForm";
import { signup } from "../../services/user";
import Alert from "../../components/Alert/Alert";
import { navigate } from "@reach/router";
import { startSession } from "../../services/session";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAlert: false,
      alertMessage: "",
      alertType: "",
      expandRegisterForm: false,
    };
  }

  async signupUser(user) {
    try {
      // Call backend.
      const response = await signup(
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.type
      );

      if (!response.success) {
        const errorMsg = response.result.response.data.message;
        this.displayAlert("error", errorMsg);
        return;
      }

      this.displayAlert("success", "Account registered!");
      this.setState({ expandRegisterForm: false });
    } catch (error) {}
  }

  async login(user) {
    try {
      const response = await startSession(user.email, user.password);
      console.log(response);
      if (!response.success) {
        this.displayAlert("error", response.result);
        return;
      }

      navigate("/");
    } catch (error) {
      this.displayAlert("error", error);
    }
  }

  render() {
    return (
      <div>
        {this.renderNavbar()}
        <Box className="LoginPage-container" justify="center">
          <h1 className="Title">Welcome to SympTUM!</h1>
          <Paper>
            <LoginForm onFormSubmit={user => this.login(user)} />
            {this.renderCreateAccount()}
          </Paper>
        </Box>
      </div>
    );
  }

  renderNavbar() {
    return (
      <Navbar
        rightButtons={[
          {
            key: "btn-about-us",
            title: "About Us",
            linkTo: "/about-us",
            onClick: () => console.log("about us clicked"),
          },
        ]}
      />
    );
  }

  renderCreateAccount() {
    return (
      <div>
        <ExpansionPanel
          expanded={this.state.expandRegisterForm}
          onChange={(event, expanded) =>
            this.setState({ expandRegisterForm: expanded })
          }
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>Or create an account!</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RegisterForm onFormSubmit={user => this.signupUser(user)} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {this.state.displayAlert ? (
          <Alert
            type={this.state.alertType}
            message={this.state.alertMessage}
            open={this.state.displayAlert}
            onClose={(e, r) => this.setState({ displayAlert: false })}
          />
        ) : null}
      </div>
    );
  }

  displayAlert(type, message) {
    this.setState({
      displayAlert: true,
      alertMessage: message,
      alertType: type,
    });
  }
}
