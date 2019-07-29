import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

import "./LoginForm.css";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "" };
  }

  /**
   * Callback function called whenever the user writes
   * something inside the "email" TextField.
   * @param {*} event
   */
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  /**
   * Callback function called whenever the user writes
   * something inside the "password" TextField.
   * @param {*} event
   */
  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  /**
   * Called when the user submits the login form.
   *
   * @param {*} event
   */
  onFormSubmit(event) {
    event.preventDefault();
    this.props.onFormSubmit(this.state);
  }

  render() {
    return (
      <form className="Form" onSubmit={e => this.onFormSubmit(e)}>
        <TextField
          required
          fullWidth
          label="E-Mail"
          variant="outlined"
          margin="normal"
          onChange={e => this.handleEmailChange(e)}
        />
        <TextField
          required
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          onChange={e => this.handlePasswordChange(e)}
        />
        <Button
          fullWidth
          type="submit"
          text="Password"
          variant="contained"
          color="primary"
        >
          Login
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  // Triggered when the user presses the login button.
  // The function passes an object with the form contents.
  onFormSubmit: PropTypes.func.isRequired,
};
