import React from "react";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import SymptomsView from "../symptoms_view/SymptomsView";
import PropTypes from "prop-types";
import DiseaseView from "../disease_view/DiseaseView";
import DrugModal from "../../drug_modal/DrugModal";
import { LayoutContext } from "../../../components/layout/Layout";

export default class DifferentialDiagnosis extends React.Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    this.state = {
      symptoms: this.props.symptoms || [],
      diseases: this.props.diseases || [],

      drugs: [],
      isDrugModalOpen: false,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      symptoms: props.symptoms,
      diseases: props.diseases,
    });
  }

  async onOpenDrugModal(diseaseId) {
    this.context.setLoading(true);
    const drugs = await this.props.drugsForDisease(diseaseId);
    drugs.forEach((drug) => {
      drug.imageUrl = `/api/images/drug/${drug.id}`
    });
    this.context.setLoading(false);
    this.setState({ isDrugModalOpen: true, drugs: drugs });
  }

  onCloseDrugModal() {
    this.setState({ isDrugModalOpen: false, drugs: [] });
  }

  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Differential Diagnosis
        </Typography>
        <div style={Styles.contentContainer}>
          <div style={Styles.leftContainer}>
            <SymptomsView
              symptoms={this.state.symptoms}
              onSelectedSymptomsChanged={s =>
                this.props.onSelectedSymptomsChanged(s)
              }
            />
          </div>
          <div style={Styles.rightContainer}>
            <DiseaseView
              diseases={this.state.diseases}
              onOpenDrugs={id => this.onOpenDrugModal(id)}
            />
          </div>
        </div>
        <DrugModal
          isOpen={this.state.isDrugModalOpen}
          onCloseButtonPress={() => this.onCloseDrugModal()}
          drugs={this.state.drugs}
        />
      </Paper>
    );
  }
}

DifferentialDiagnosis.propTypes = {
  // Array of symptoms for the autocomplete
  symptoms: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Array of diseases with their likelihoods
  diseases: PropTypes.arrayOf(
    PropTypes.shape(
      {
        diseaseId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        likelihood: PropTypes.number.isRequired,
      }.isRequired
    )
  ),

  // Called when the user added or removed symptoms.
  onSelectedSymptomsChanged: PropTypes.func.isRequired,

  // Called when the drug modal is loaded. Must return
  // an array of drugs based on the passed disease id.
  drugsForDisease: PropTypes.func.isRequired,
};
