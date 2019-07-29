import React from "react";
import Typography from "@material-ui/core/Typography";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PropTypes from "prop-types";

import { Styles } from "./styles";

class ProgressStepper extends React.Component {
  render() {
    return (
      <div style={Styles.container}>
        <Typography variant="h5" component="h5">
          Progress
        </Typography>
        {this.renderStepper()}
      </div>
    );
  }

  renderStepper() {
    if (!this.props.steps) {
      return;
    }

    return (
      <Stepper activeStep={this.props.currentStep || 0} orientation="vertical">
        {this.props.steps.map(step => {
          return (
            <Step key={"step-" + this.props.steps.indexOf(step)}>
              <StepLabel>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    );
  }
}

export default ProgressStepper;

ProgressStepper.propTypes = {
  // Title of the different steps
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Index of the current step
  currentStep: PropTypes.number.isRequired,
};
