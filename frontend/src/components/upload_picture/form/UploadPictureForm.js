import React, { Component } from "react";
import { Styles } from "./styles";
import ImagePicker from "../../image_picker/ImagePicker";
import PropTypes from "prop-types";

export class UploadPictureForm extends Component {
  state = {
    image: this.props.image || null
  };

  // data is a File object, base64string of the same data file
  handleData = (data, base64string) => {
    this.props.handleData(data, base64string);
    this.setState({ image: base64string });
  };

  /**
   * Renders the image obtained
   */
  showImageContainer() {
    if (this.state.image && this.state.image !== "") {
      return (
        <div>
          <img src={this.state.image} height="200" />
        </div>
      );
    } else {
      return <div>No image selected</div>;
    }
  }

  render() {
    return (
      <div>
        <div style={Styles.horizontal}>
          <div style={Styles.marginRight}>
            Select a picture for your new drug:
          </div>

          <ImagePicker handleData={this.handleData} />
        </div>
        <div style={Styles.thirdWidth}>{this.showImageContainer()}</div>
      </div>
    );
  }
}

UploadPictureForm.propTypes = {
  handleData: PropTypes.func.isRequired
};

export default UploadPictureForm;
