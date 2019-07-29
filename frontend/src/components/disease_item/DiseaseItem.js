import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import { Styles } from "./styles";
import PropTypes from "prop-types";

export default class DiseaseItem extends React.Component {
  render() {
    const rounded = Math.round(this.props.likelihood * 100) / 100;

    return (
      <div style={Styles.container}>
        <p style={Styles.text}>{this.props.name}</p>
        <div style={Styles.progressContainer}>
          <LinearProgress
            style={Styles.progress}
            variant="determinate"
            value={rounded}
          />
          <div style={Styles.percentage}>{rounded + "%"}</div>
        </div>
        <div style={Styles.button}>
          <Button
            color="secondary"
            onClick={e => this.props.onOpenDrugs(this.props.diseaseId)}
          >
            Suggested Drugs
          </Button>
        </div>
      </div>
    );
  }
}

DiseaseItem.propTypes = {
  diseaseId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  likelihood: PropTypes.number.isRequired,

  // Called when the "Suggessted Drugs" button
  // has been pressed. The id of the diease is passed.
  onOpenDrugs: PropTypes.func.isRequired,
};
