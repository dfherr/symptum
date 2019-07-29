import React from "react";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import MedicalHistoryTable from "../table/MedicalHistoryTable";
import MedicalHistoryForm from "../form/MedicalHistoryForm";
import PropTypes from "prop-types";

export default class MedicalHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diseases: this.props.diseaseHistory || [],
    };
  }

  componentWillReceiveProps(props) {
    if (props.diseaseHistory) {
      this.setState({ diseases: props.diseaseHistory });
    }
  }

  addDisease(disease) {
    this.setState(
      prevState => ({
        diseases: [...prevState.diseases, disease],
      }),
      () => this.props.onDiseaseHistoryUpdated(this.state.diseases)
    );
  }

  removeDisease(disease, index) {
    let diseases = this.state.diseases;
    diseases.splice(index, 1);
    this.setState({ diseases }, () =>
      this.props.onDiseaseHistoryUpdated(diseases)
    );
  }

  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Medical History
        </Typography>
        <MedicalHistoryForm
          diseaseSuggestions={this.props.diseaseSuggestions}
          onFormSubmit={x => this.addDisease(x)}
        />
        <MedicalHistoryTable
          diseases={this.state.diseases}
          onDiseaseRemoved={(d, i) => this.removeDisease(d, i)}
        />
      </Paper>
    );
  }
}

MedicalHistory.propTypes = {
  // Array of diseases for the autocomplete
  diseaseSuggestions: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Disease history of the patient.
  diseaseHistory: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        when: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
      }.isRequired
    )
  ),

  onDiseaseHistoryUpdated: PropTypes.func.isRequired,
};
