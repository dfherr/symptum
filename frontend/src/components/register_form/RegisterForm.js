import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from "prop-types";

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      type: "doctor",
    };

    this.onUserTypeChange = this.onUserTypeChange.bind(this);
  }

  onUserTypeChange(event) {
    this.setState({ type: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.onFormSubmit(this.state);
  }

  render() {
    return (
      <form onSubmit={e => this.onFormSubmit(e)}>
        <TextField
          required
          label="First Name"
          margin="normal"
          style={{ marginRight: "15px" }}
          onChange={e => this.setState({ firstName: e.target.value })}
        />
        <TextField
          required
          label="Last Name"
          margin="normal"
          onChange={e => this.setState({ lastName: e.target.value })}
        />

        <TextField
          required
          fullWidth
          label="E-Mail"
          margin="normal"
          onChange={e => this.setState({ email: e.target.value })}
        />

        <TextField
          required
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          onChange={e => this.setState({ password: e.target.value })}
        />

        <FormControl
          component="fieldset"
          style={{ marginTop: "15px", marginBottom: "15px" }}
        >
          <FormLabel component="legend" style={{ marginBottom: "5px" }}>
            Are you a doctor or pharma marketer?
          </FormLabel>
          <RadioGroup
            aria-label="User type"
            name="User Type"
            value={this.state.type}
            onChange={this.onUserTypeChange}
          >
            <FormControlLabel
              value="doctor"
              control={<Radio />}
              label="Doctor"
            />
            <FormControlLabel
              value="marketer"
              control={<Radio />}
              label="Marketer"
            />
          </RadioGroup>
        </FormControl>
        <Button
          fullWidth
          type="submit"
          text="Password"
          variant="contained"
          color="secondary"
        >
          Register
        </Button>
      </form>
    );
  }
}

RegisterForm.propTypes = {
  // Triggered when the user presses the register button.
  // The function passes an object with the form contents.
  onFormSubmit: PropTypes.func.isRequired,
};
