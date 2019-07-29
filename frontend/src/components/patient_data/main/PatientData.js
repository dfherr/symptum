import React from "react";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import PatientDataForm from "../form/PatientDataForm";
import PropTypes from "prop-types";

export default class PatientData extends React.Component {
  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Patient Data
        </Typography>
        <PatientDataForm
          patient={this.props.patient}
          onFormSubmit={this.props.onFormSubmit}
        />
      </Paper>
    );
  }
}

PatientData.propTypes = {
  patient: PropTypes.shape(
    {
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      insuranceName: PropTypes.string.isRequired,
      insuranceNumber: PropTypes.string.isRequired,
    }.isRequired
  ),
  onFormSubmit: PropTypes.func.isRequired,
};
