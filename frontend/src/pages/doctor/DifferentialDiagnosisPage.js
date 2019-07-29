import React from "react";
import DifferentialDiagnosis from "../../components/differential_diagnosis/main/DifferentialDiagnosis";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import { navigate } from "@reach/router";
import { getSessionUser, getSessionExtra } from "../../services/session";
import { getSymptoms, getDiseasesForSymptoms } from "../../services/symptoms";
import Alert from "../../components/Alert/Alert";
import { getDrugsForDisease } from "../../services/drug";
import { LayoutContext } from "../../components/layout/Layout";

export default class DifferentialDiagnosisPage extends React.Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    this.state = {
      session: getSessionUser(),
      patient: getSessionExtra("patient") || {},
      symptoms: [],
      diseases: [],
    };
  }

  componentDidMount() {
    this.context.setLoading(true);
    this.getAllSymptoms().then(symptoms => {
      this.setState({ symptoms: symptoms});
      this.context.setLoading(false);
    });
  }

  async getAllSymptoms() {
    const symptoms = await getSymptoms(this.state.session.sessionId);
    if (!symptoms.success) {
      this.displayAlert("error", symptoms.result);
      return;
    }

    return symptoms.result;
  }

  async getDiseases(symptoms) {
    const sessionId = this.state.session.sessionId;
    const patientId = this.state.patient.id;
    const symptomIds = symptoms.map(s => s.id);

    const diseases = await getDiseasesForSymptoms(
      sessionId,
      patientId,
      symptomIds
    );

    if (!diseases.success) {
      this.displayAlert("error", diseases.result);
      return [];
    }

    return diseases.result;
  }

  onSelectedSymptomsChanged(symptoms) {
    this.context.setLoading(true);
    // Send request to backend and update disease results.
    this.getDiseases(symptoms).then(diseases => {
      this.setState({ diseases });
      this.context.setLoading(false);
    });
  }

  /**
   * Called when the "Suggested drugs" button has been clicked
   * for a particular diease. Open the modal window with the
   * list of drugs that treat that disease.
   * @param {*} diseaseId
   */
  async getDrugsForDisease(diseaseId) {
    const sessionId = this.state.session.sessionId;

    const drugs = await getDrugsForDisease(sessionId, diseaseId);
    if (!drugs.success) {
      this.displayAlert("error", drugs);
      return [];
    }

    return drugs.result;
  }

  onNextButtonClick(href) {
    // Nothing
  }

  onPrevButtonClick(href) {
    navigate(href);
  }

  render() {
    return (
      <div>
        <DifferentialDiagnosis
          symptoms={this.state.symptoms}
          diseases={this.state.diseases}
          onSelectedSymptomsChanged={s => this.onSelectedSymptomsChanged(s)}
          drugsForDisease={id => this.getDrugsForDisease(id)}
        />
        <ProgressButtons
          hrefPrev={`/doctor/1`}
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
