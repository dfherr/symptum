import React from "react";
import AutocompleteInput from "../../AutocompleteInput";
import PropTypes from "prop-types";

export default class SymptomAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symptoms: this.props.symptoms.map(s => this.toInputObj(s)) || [],
      value: null,
    };
  }

  componentWillReceiveProps(props) {
    if (props.symptoms) {
      const symptom = props.symptoms.map(s => this.toInputObj(s));
      this.setState({ symptoms: symptom });
    }
  }

  onSymptomSelected(symptom) {
    const s = this.toSymptomObj(symptom);
    this.props.onSymptomSelected(s);
  }

  /**
   * Converts a Symptom object into an object that is
   * readable by the autocomplete component.
   * @param {*} symptomObj
   */
  toInputObj(symptomObj) {
    return { label: symptomObj.name, value: symptomObj.id };
  }

  /**
   * Converts an autocomplete suggestion object into a symptom.
   * @param {*} inputObj
   */
  toSymptomObj(inputObj) {
    return { id: inputObj.value, name: inputObj.label };
  }

  render() {
    return (
      <AutocompleteInput
        items={this.state.symptoms}
        onItemSelected={s => this.onSymptomSelected(s)}
        placeholder={"Search for symptoms"}
      />
    );
  }
}

SymptomAutocomplete.propTypes = {
  symptoms: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  onSymptomSelected: PropTypes.func.isRequired,
};
