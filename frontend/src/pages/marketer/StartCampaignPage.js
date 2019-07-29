import React, { Component } from "react";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import StartCampaign from "../../components/start_campaign/main/StartCampaign";
import Confirmation from "../../components/Confirmation/Confirmation";
import { navigate } from "@reach/router";

export class StartCampaignPage extends Component {
  onNextButtonClick(href) {
    // Nothing
  }

  onPrevButtonClick(href) {
    navigate(href);
  }

  render() {
    if (!this.props.completed) {
      return (
        <div>
          <StartCampaign startCampaign={this.props.handleCampaign} />
          <ProgressButtons
            hrefPrev={`/marketer/1`}
            onNextButtonClick={h => this.onNextButtonClick(h)}
            onPrevButtonClick={h => this.onPrevButtonClick(h)}
          />
        </div>
      );
    } else {
      return (
        <Confirmation
          drug={this.props.drug}
          campaign={this.props.campaign}
          addNewDrug={this.props.addNewDrug}
        />
      );
    }
  }
}

export default StartCampaignPage;
