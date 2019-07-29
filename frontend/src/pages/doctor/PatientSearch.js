import React from "react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Fab from "@material-ui/core/Fab";
import { getPatient } from "../../services/patient";
import Alert from "../../components/Alert/Alert";
import PropTypes from "prop-types";

export default class PatientSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAlert: false,
      alertMessage: "",
      alertType: "",
      searchQuery: "",
      patient: {},
    };
  }

  async searchPatient() {
    const sessionId = this.props.sessionId;
    const insuranceNumber = this.state.searchQuery;
    const patient = await getPatient(sessionId, insuranceNumber);

    if (!patient.success) {
      this.displayAlert("error", patient.result);
      return;
    }

    this.setState({ patient: patient.result }, () =>
      this.displayAlert("success", "We found the patient!")
    );

    this.props.onPatientFound(patient.result);
  }

  displayAlert(type, message) {
    this.setState({
      displayAlert: true,
      alertMessage: message,
      alertType: type,
    });
  }

  render() {
    return (
      <div>
        {this.renderPatientSearch()}
        {this.renderAlert()}
      </div>
    );
  }

  renderPatientSearch() {
    return (
      <div style={{ display: "flex", margin: 10, marginLeft: 0 }}>
        <TextField
          style={{ width: "80%", marginRight: 10 }}
          label="Search for a patient"
          placeholder="Enter insurance number..."
          variant="outlined"
          onChange={e => this.setState({ searchQuery: e.target.value })}
        />
        <Fab color="primary" onClick={e => this.searchPatient()}>
          <SearchIcon />
        </Fab>
      </div>
    );
  }

  renderAlert() {
    if (!this.state.displayAlert) {
      return null;
    }

    return (
      <Alert
        type={this.state.alertType}
        message={this.state.alertMessage}
        open={this.state.displayAlert}
        onClose={(e, r) => this.setState({ displayAlert: false })}
      />
    );
  }
}

PatientSearch.propTypes = {
  sessionId: PropTypes.string.isRequired,
  onPatientFound: PropTypes.func.isRequired,
};
