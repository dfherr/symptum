import React from "react";
import AutocompleteInput from "../../AutocompleteInput";
import PropTypes from "prop-types";

export default class DiseaseAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diseases: this.props.diseases.map(s => this.toInputObj(s)) || [],
    };
  }

  componentWillReceiveProps(props) {
    if (props.diseases) {
      const disease = props.diseases.map(s => this.toInputObj(s));
      this.setState({ diseases: disease });
    }

    if (props.value) {
      this.setState({ value: props.value });
    }
  }

  onDiseaseSelected(disease) {
    const s = this.toDiseaseObj(disease);
    this.props.onDiseaseSelected(s);
  }

  /**
   * Converts a disease object into an object that is
   * readable by the autocomplete component.
   * @param {*} diseaseObj
   */
  toInputObj(diseaseObj) {
    return { label: diseaseObj.name, value: diseaseObj.id };
  }

  /**
   * Converts an autocomplete suggestion object into a disease.
   * @param {*} inputObj
   */
  toDiseaseObj(inputObj) {
    return { id: inputObj.value, name: inputObj.label };
  }

  render() {
    return (
      <AutocompleteInput
        value={this.props.value}
        items={this.state.diseases}
        onItemSelected={s => this.onDiseaseSelected(s)}
        placeholder={this.props.placeholder}
      />
    );
  }
}

DiseaseAutocomplete.propTypes = {
  diseases: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  value: PropTypes.string,

  onDiseaseSelected: PropTypes.func.isRequired,
};
