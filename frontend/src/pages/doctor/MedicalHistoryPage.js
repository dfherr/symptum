import React from "react";
import MedicalHistory from "../../components/medical_history/main/MedicalHistory";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import { navigate } from "@reach/router";
import { getDiseases } from "../../services/diseases";
import { getSessionUser, getSessionExtra } from "../../services/session";
import Alert from "../../components/Alert/Alert";
import {
  getDiseaseHistory,
  addDiseaseHistory,
  deleteDiseaseHistory,
} from "../../services/patient";
import { LayoutContext } from "../../components/layout/Layout";

export default class MedicalHistoryPage extends React.Component {

  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    this.state = {
      session: getSessionUser(),
      patient: getSessionExtra("patient") || {},
      diseaseSuggestions: [],
      diseaseHistory: [],
    };
  }

  /**
   * Initializes disease autocomplete and disease history
   * of the patient.
   */
  componentDidMount() {
    this.context.setLoading(true);
    this.getAllDiseases().then(diseaseSuggestions =>
      this.getDiseaseHistory(diseaseSuggestions).then(diseaseHistory =>
        {
          this.context.setLoading(false);
          this.setState({ diseaseSuggestions, diseaseHistory });
        }
      )
    );
  }

  /**
   * Gets all diseases used for the autocomplete
   * textbox.
   */
  async getAllDiseases() {
    const diseases = await getDiseases(this.state.session.sessionId);
    if (!diseases.success) {
      this.displayAlert("error", diseases.result);
      return [];
    }
    return diseases.result;
  }

  /**
   * Gets the disease history. We need to pass the disease definitions
   * from the autocomplete suggestions because the disease history from
   * the backend does not return disease names. Only the ids.
   *
   * @param {*} diseaseDefs
   */
  async getDiseaseHistory(diseaseDefs) {
    if (!this.state.patient.hasOwnProperty("id")) {
      this.displayAlert("error", "You did not select a patient.");
      return [];
    }

    const sessionId = this.state.session.sessionId;
    const patientId = this.state.patient.id;
    const diseaseHistory = await getDiseaseHistory(sessionId, patientId);

    if (!diseaseHistory.success) {
      this.displayAlert("error", diseaseHistory.result);
      return [];
    }

    // Insert disease names into the disease history.
    const d = diseaseHistory.result;
    return d.map(d => {
      d["name"] = diseaseDefs.find(x => x.id === d.diseaseId).name;
      return d;
    });
  }

  /**
   * Disease history table has been updated. Synchronize these
   * changes to the backend.
   * @param {*} diseases
   */
  async onDiseaseHistoryUpdated(diseases) {
    // Check if we have a target patient
    if (!this.state.patient.hasOwnProperty("id")) {
      this.displayAlert("error", "You did not select a patient.");
      return;
    }

    const sessionId = this.state.session.sessionId;
    const patientId = this.state.patient.id;

    // Construct diseases to a backend representation and
    // try to update disease history.
    let diseaseHistory = this.convertToDbDiseases(diseases);

    let success = await this.tryUpdateDiseaseHistory(
      sessionId,
      patientId,
      diseaseHistory
    );

    if (success) {
      this.displayAlert("success", "Patient disease history updated!");
      this.setState({ diseaseHistory: diseases });
      return;
    }

    this.displayAlert("error", "Diseases cannot be added more than once.");

    // Fallback to previous disease history
    diseaseHistory = this.convertToDbDiseases(this.state.diseaseHistory);
    success = await this.tryUpdateDiseaseHistory(
      sessionId,
      patientId,
      diseaseHistory
    );
    if (success) {
      return;
    }

    this.displayAlert("error", "Something terrible happened.");
  }

  /**
   * Converts an array of diseases into an array
   * of diseases that is valid for the backend database.
   *
   * @param {*} diseases must have id, when, active properties
   */
  convertToDbDiseases(diseases) {
    return diseases.map(d => {
      if (d.hasOwnProperty("id")) {
        return { diseaseId: d.id, when: d.when, active: d.active.toString() };
      } else {
        return {
          diseaseId: d.diseaseId,
          when: d.when,
          active: d.active.toString(),
        };
      }
    });
  }

  async tryUpdateDiseaseHistory(sessionId, patientId, diseaseHistory) {
    // Delete old disease history before adding the new updated one
    const del = await deleteDiseaseHistory(sessionId, patientId);
    if (!del.success) {
      return false;
    }

    // Attempt to add updated disease history
    const post = await addDiseaseHistory(sessionId, patientId, diseaseHistory);
    return post.success;
  }

  onNextButtonClick(href) {
    navigate(href);
  }

  onPrevButtonClick(href) {
    navigate(href);
  }

  render() {
    return (
      <div>
        <MedicalHistory
          diseaseSuggestions={this.state.diseaseSuggestions}
          diseaseHistory={this.state.diseaseHistory}
          onDiseaseHistoryUpdated={d => this.onDiseaseHistoryUpdated(d)}
        />
        <ProgressButtons
          hrefNext={`/doctor/2`}
          hrefPrev={`/doctor/0`}
          onNextButtonClick={h => this.onNextButtonClick(h)}
          onPrevButtonClick={h => this.onPrevButtonClick(h)}
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

  displayAlert(type, message) {
    this.setState({
      displayAlert: true,
      alertMessage: message,
      alertType: type,
    });
  }
}
