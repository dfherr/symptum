import React from "react";
import SymptonAutocomplete from "../autocomplete/SymptomAutocomplete";
import { Styles } from "./styles";
import SymptomList from "../symptom_list/SymptomList";
import PropTypes from "prop-types";
import { Divider } from "@material-ui/core";

export default class SymptomsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symptoms: this.props.symptoms || [],
      selectedSymptoms: [],
    };
  }

  componentWillReceiveProps(props) {
    if (props.symptoms && this.state.symptoms.length === 0) {
      this.setState({ symptoms: props.symptoms });
    }
  }

  onSymptomSelected(symptom) {
    // Remove the selected symptom from the autosuggestion
    let symptoms = this.state.symptoms;
    symptoms = symptoms.filter(s => s.id !== symptom.id);

    // Add symptom to list
    const selectedSymptoms = this.state.selectedSymptoms;
    selectedSymptoms.push(symptom);

    this.setState({ symptoms, selectedSymptoms });

    // Call callback
    this.props.onSelectedSymptomsChanged(selectedSymptoms);
  }

  onSymptomDeleted(symptom) {
    // Remove the symptom from the list
    const selectedSymptoms = this.state.selectedSymptoms.filter(
      s => s.id !== symptom.id
    );

    // Re-add symptom to suggestion
    const symptoms = this.state.symptoms;
    symptoms.push(symptom);

    this.setState({ symptoms, selectedSymptoms });

    // Call callback
    this.props.onSelectedSymptomsChanged(selectedSymptoms);
  }

  render() {
    return (
      <div>
        <SymptonAutocomplete
          symptoms={this.state.symptoms}
          onSymptomSelected={s => this.onSymptomSelected(s)}
        />
        <Divider style={Styles.divider} />
        <div style={Styles.list}>
          <SymptomList
            symptoms={this.state.selectedSymptoms}
            onSymptomDeleted={s => this.onSymptomDeleted(s)}
          />
        </div>
      </div>
    );
  }
}

SymptomsView.propTypes = {
  // Symptom list for the autocomplete control.
  symptoms: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Called when the user added or removed symptoms.
  onSelectedSymptomsChanged: PropTypes.func.isRequired,
};
