import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import DrugInfoForm from "../form/DrugInfoForm";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import PropTypes from "prop-types";

export class DrugInfo extends Component {
  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Drug information
        </Typography>
        <DrugInfoForm
          user={this.props.user}
          drug={this.props.drug}
          onFormSubmit={this.props.onFormSubmit}
        />
      </Paper>
    );
  }
}

DrugInfo.propTypes = {
  onFormSubmit: PropTypes.func.isRequired
};

export default DrugInfo;
