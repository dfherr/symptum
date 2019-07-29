import React, { Component } from "react";
import DrugInfo from "../../components/promote_drug/main/DrugInfo";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import Alert from "../../components/Alert/Alert";

export class AddInfoPage extends Component {
  state = {
    drug: this.props.drug || {}
  };

  /**
   * Checks whether all the required drug information is obtained and passes it to the parent component
   */
  onFormSubmit = state => {
    if (!this.drugInputValidation(state)) {
      this.displayAlert(
        "error",
        "Please make sure to enter all the required drug information"
      );
    } else {
      this.props.handleDrug(state);
    }
  };

  /**
   * Navigates to the next page if all the required drug information is obtained
   * @param {} href 
   */
  onNextButtonClick(href) {
    if (!this.drugInputValidation(this.state.drug)) {
      this.displayAlert(
        "error",
        "Please make sure you have entered all the required drug information and pressed Save"
      );
    } else {
      navigate(href);
    }
  }

  componentWillReceiveProps(props) {
    if (props.drug !== this.state.name) {
      this.setState({ drug: props.drug || {} });
    }
  }

  /**
   * Checks whether the drug is given in the required form
   */
  drugInputValidation = drug => {
    if (!drug.hasOwnProperty("name")) {
      return false;
    }

    const { name, price, dosage, selectedIngredients, selectedDiseases } = drug;

    if (
      name === "" ||
      price === "" ||
      dosage === "" ||
      selectedDiseases.length === 0 ||
      selectedIngredients.length === 0
    ) {
      return false;
    }
    return true;
  };

  onPrevButtonClick(href) {
    // There are no screen.
  }

  render() {
    return (
      <div>
        <DrugInfo
          user={this.props.user}
          drug={this.state.drug}
          onFormSubmit={this.onFormSubmit}
        />
        <ProgressButtons
          hrefNext={`/marketer/1`}
          onNextButtonClick={href => this.onNextButtonClick(href)}
          onPrevButtonClick={href => this.onPrevButtonClick(href)}
        />
        {this.renderAlert()}
      </div>
    );
  }

  renderAlert() {
    if (!this.state.displayAlert) {
      return null;
    }

    return (
      <Alert
        type={this.state.alertType}
        message={this.state.alertMessage}
        open={this.state.displayAlert}
        onClose={(e, r) => this.setState({ displayAlert: false })}
      />
    );
  }

  displayAlert(type, message) {
    this.setState({
      displayAlert: true,
      alertMessage: message,
      alertType: type
    });
  }
}

AddInfoPage.propTypes = {
  handleDrug: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default AddInfoPage;
