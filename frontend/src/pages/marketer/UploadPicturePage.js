import React, { Component } from "react";
import ProgressButtons from "../../components/progress_buttons/ProgressButtons";
import UploadPicture from "../../components/upload_picture/main/UploadPicture";
import PropTypes from "prop-types";
import { dataFormat } from "../../utils/blob";
import { navigate } from "@reach/router";
import Alert from "../../components/Alert/Alert";
import { getSessionExtra } from "../../services/session";

export class UploadPicturePage extends Component {
  state = {
    image: getSessionExtra("drug").picture || ""
  };

  // Prepares the data file as a blob object, and gives it to the parent component
  handleData(data, base64String) {
    const format = dataFormat(base64String);
    const file = new Blob([data], { type: "image/" + format });

    this.props.handlePicture(file, base64String);
    this.setState({ image: file });
  }

  onNextButtonClick = href => {
    if (this.nextStepValidator()) {
      navigate(href);
    } else {
      this.displayAlert("error", "Please make sure to upload a picture!");
    }
  };

  nextStepValidator = () => {
    if (!this.state.image) {
      return false;
    }
    return true;
  };

  onPrevButtonClick(href) {
    navigate(href);
  }

  render() {
    return (
      <div>
        <UploadPicture
          image={this.props.drug.picture}
          handleData={this.handleData.bind(this)}
        />
        <ProgressButtons
          hrefNext={`/marketer/2`}
          hrefPrev={`/marketer/0`}
          onNextButtonClick={h => this.onNextButtonClick(h)}
          onPrevButtonClick={h => this.onPrevButtonClick(h)}
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

UploadPicturePage.propTypes = {
  image: PropTypes.string.isRequired,
  handlePicture: PropTypes.func.isRequired
};

export default UploadPicturePage;
