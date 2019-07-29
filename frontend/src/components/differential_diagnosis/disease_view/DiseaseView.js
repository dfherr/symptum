import React from "react";
import DiseaseItem from "../../disease_item/DiseaseItem";
import PropTypes from "prop-types";
import { Styles } from "./styles";

export default class DiseaseView extends React.Component {
  render() {
    return (
      <div style={Styles.list}>
        {this.props.diseases.map((disease, i) => (
          <div key={i} style={Styles.disease}>
            <DiseaseItem
              diseaseId={disease.diseaseId}
              name={disease.name}
              likelihood={disease.likelihood}
              onOpenDrugs={id => this.props.onOpenDrugs(id)}
            />
          </div>
        ))}
      </div>
    );
  }
}

DiseaseView.propTypes = {
  diseases: PropTypes.arrayOf(
    PropTypes.shape(
      {
        diseaseId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        likelihood: PropTypes.number.isRequired,
      }.isRequired
    )
  ),

  // Called when the "Suggessted Drugs" button
  // has been pressed. The id of the diease is passed.
  onOpenDrugs: PropTypes.func.isRequired,
};
