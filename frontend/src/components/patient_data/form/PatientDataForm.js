import React from "react";
import TextField from "@material-ui/core/TextField";
import { Styles } from "./styles";
import PropTypes from "prop-types";
import Dropdown from "../../Dropdown";
import Button from "@material-ui/core/Button";

export default class PatientDataForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.patient.id || "",
      name: this.props.patient.name || "",
      gender: this.props.patient.gender || "",
      age: this.props.patient.age || 1,
      insuranceName: this.props.patient.insuranceName || "",
      insuranceNumber: this.props.patient.insuranceNumber || "",
    };

    // Because the gender dropdown only understands
    // 0 = "Male", 1 = "Female"
    this.state.gender = this.convertGenderToDropdown(this.state.gender);
  }

  componentWillReceiveProps(props) {
    if (Object.keys(props.patient).length > 0) {
      let {
        id,
        name,
        gender,
        age,
        insuranceName,
        insuranceNumber,
      } = props.patient;

      // Because the gender dropdown only understands
      // 0 = "Male", 1 = "Female"
      gender = this.convertGenderToDropdown(gender);

      this.setState({ id, name, gender, age, insuranceName, insuranceNumber });
    }
  }

  convertGenderToDropdown(gender) {
    if (gender === "") {
      return gender;
    }
    return gender === "male" ? 0 : 1;
  }

  onFormSubmit(event) {
    event.preventDefault();

    const p = this.state;
    p.gender = p.gender === 0 ? "male" : "female";
    this.props.onFormSubmit(p);
  }

  render() {
    return (
      <form onSubmit={e => this.onFormSubmit(e)}>
        <div style={Styles.horizontal}>
          <TextField
            style={Styles.verticle}
            fullWidth
            required
            label="Name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div style={Styles.horizontal}>
          <Dropdown
            containerStyle={Styles.halfWidth}
            required
            label="Gender"
            items={[{ id: 0, name: "Male" }, { id: 1, name: "Female" }]}
            onItemPress={i => this.setState({ gender: i.id })}
            value={this.state.gender.toString()}
          />
          <TextField
            style={Styles.halfWidth}
            required
            label="Age"
            value={this.state.age}
            onChange={e => this.setState({ age: e.target.value })}
            type="number"
            inputProps={{ min: "0", step: "1" }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </div>
        <div style={Styles.verticle}>
          <TextField
            style={Styles.fullWidth}
            required
            label="Insurance company"
            value={this.state.insuranceName}
            onChange={e => this.setState({ insuranceName: e.target.value })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            style={Styles.fullWidth}
            required
            label="Insurance number"
            value={this.state.insuranceNumber}
            onChange={e => this.setState({ insuranceNumber: e.target.value })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            style={Styles.button}
            type="submit"
            variant="contained"
            color="secondary"
          >
            Save
          </Button>
        </div>
      </form>
    );
  }
}

PatientDataForm.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
  insuranceName: PropTypes.string,
  insuranceNumber: PropTypes.string,

  onFormSubmit: PropTypes.func.isRequired,
};
