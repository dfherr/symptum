import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import StartCampaignForm from "../form/StartCampaignForm";

export class StartCampaign extends Component {
  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Start Campaign
        </Typography>
        <StartCampaignForm startCampaign={this.props.startCampaign} />
      </Paper>
    );
  }
}

export default StartCampaign;
