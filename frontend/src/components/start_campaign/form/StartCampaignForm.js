import React, { Component } from "react";
import { Styles } from "./styles";
import Dropdown from "../../Dropdown";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "@material-ui/core";

export class StartCampaignForm extends Component {
  state = {
    items: [
      { id: 999, name: "10 days | 999€", price: "999" },
      { id: 2399, name: "30 days | 2399€", price: "2399" },
      { id: 11990, name: "6 months | 11990€", price: "11990" },
      { id: 17990, name: "1 year | 17990€", price: "17990" }
    ],

    selectedItem: {
      id: 100,
      name: "",
      price: ""
    },
    reminder: false
  };

  /**
   * Sets the selected Item
   */
  onItemPress = i => {
    this.setState({ selectedItem: i });
  };

  /**
   * Prepares the campaign object when start campaign button is pressed and gives it to parent component 
   */
  startCampaign = () => {
    const campaign = {
      price: this.state.selectedItem.price,
      from: new Date(),
      to: this.calculateToDate()
    };

    this.props.startCampaign(campaign);
  };

  /**
   * Makes use of the selected Item duration and calculates to Date property of the campaign object
   */
  calculateToDate = () => {
    var date = new Date();
    switch (this.state.selectedItem.id) {
      case 999:
        date.setDate(date.getDate() + 10);
        break;
      case 2399:
        date.setDate(date.getDate() + 30);
        break;
      case 11990:
        date.setDate(date.getDate() + 180);
        break;
      case 17990:
        date.setDate(date.getDate() + 365);
        break;
      default:
        break;
    }
    return date;
  };

  /**
   * Renders the control form when the user selects the duration of the campaign
   */
  renderControlForm = () => {
    if (this.state.selectedItem.id !== 100) {
      return (
        <div style={Styles.verticle}>
          <FormControlLabel
            control={<Checkbox checked={this.state.reminder} />}
            label="Would you like to be reminded before your campaign expires?"
            onChange={e => this.setState({ reminder: e.target.checked })}
          />
          <Button color="primary" onClick={this.startCampaign}>
            Start Campaign
          </Button>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div style={Styles.verticle}>
          <div style={{ marginBottom: 35 }}>
            Select the duration for the advertisement of your new drug:
          </div>

          <Dropdown
            containerStyle={Styles.halfWidth}
            required
            label="Duration"
            items={this.state.items}
            onItemPress={this.onItemPress}
            value={this.state.selectedItem.id.toString()}
          />
        </div>

        <div style={Styles.horizontal}>{this.renderControlForm()}</div>
        <div style={Styles.horizontal} />
      </div>
    );
  }
}

export default StartCampaignForm;
