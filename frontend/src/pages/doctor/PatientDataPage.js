import React from "react";
import PatientData from "../../components/patient_data/main/PatientData";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import { createOrUpdatePatient } from "../../services/patient";
import Alert from "../../components/Alert/Alert";
import PatientSearch from "./PatientSearch";
import { navigate } from "@reach/router";
import {
  getSessionUser,
  setSessionExtra,
  getSessionExtra,
} from "../../services/session";

export default class PatientDataPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAlert: false,
      alertMessage: "",
      alertType: "",
      patient: getSessionExtra("patient") || {},
      session: getSessionUser(),
    };
  }

  /**
   * When the user wants to go to the patient's
   * disease history screen.
   *
   * @param {*} href
   */
  onNextButtonClick(href) {
    // Allow to go to next page if we have data of
    // the patient to manipulate.
    const patient = this.state.patient;
    if (!patient.hasOwnProperty("id")) {
      this.displayAlert(
        "error",
        "You need to specify a patient (press the save button)!"
      );
      return;
    }

    setSessionExtra("patient", patient);
    navigate(href);
  }

  /**
   * When the user wants to go to the previous
   * screen.
   *
   * @param {} href
   */
  onPrevButtonClick(href) {
    // There are no screen.
  }

  /**
   * Creates a new patient or updates an existing patient with the
   * specified patient data.
   *
   * @param {*} patientData
   */
  async savePatient(patientData) {
    // Check if session is valid
    if (!this.state.session) {
      navigate("/login");
      return;
    }

    // Check if user is a doctor.
    const userType = this.state.session.profile.type;
    if (userType !== "doctor") {
      this.displayAlert("error", "You can't do that since you're not a doctor");
      return;
    }

    const sessionId = this.state.session.sessionId;
    const doctorId = this.state.session.id;

    // Create or update patient
    const patient = await createOrUpdatePatient(
      sessionId,
      doctorId,
      patientData
    );

    if (!patient.success) {
      this.displayAlert("error", patient.result);
      return;
    }

    // Save patient to local session
    this.setState({ patient: patient.result || patientData });

    this.displayAlert("success", "Patient data saved!");
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
        <PatientSearch
          sessionId={this.state.session.sessionId}
          onPatientFound={patient => this.setState({ patient })}
        />
        <PatientData
          patient={this.state.patient}
          onFormSubmit={x => this.savePatient(x)}
        />
        <ProgressButtons
          hrefNext={`/doctor/1`}
          onNextButtonClick={href => this.onNextButtonClick(href)}
          onPrevButtonClick={href => this.onPrevButtonClick(href)}
        />
        {this.renderAlert()}
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
