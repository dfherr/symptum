import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import moment from "moment";
import Button from "@material-ui/core/Button";

/**
 * This component is shown after a drug and its campaing have been posted.
 */
export class Confirmation extends Component {
  addNewDrug = () => {
    this.props.addNewDrug();
  };

  render() {
    if (this.props.campaign && this.props.drug) {
      return (
        <Paper style={Styles.container}>
          <Typography style={Styles.title} variant="h4" component="h4">
            Confirmation
          </Typography>
          <div style={{ marginBottom: 20 }}>
            {" "}
            Thank you for your subscription! You successfully submitted the new
            drug <b>{this.props.drug.name}</b>.{" "}
          </div>
          <div>
            {" "}
            Your advertisement campaign will last until{" "}
            <b>{moment(this.props.campaign.to).format("MMMM Do YYYY")}</b>.{" "}
          </div>
          <Button
            style={{ marginTop: 30 }}
            variant="contained"
            color="primary"
            onClick={this.addNewDrug}
          >
            Add new drug
          </Button>
        </Paper>
      );
    } else {
      return null;
    }
  }
}

export default Confirmation;
