import React, { Component } from "react";
import PropTypes from "prop-types";

class ImagePicker extends Component {
  
  handleFileChange(event) {
    const { target } = event;
    const { files } = target;

    if (files && files[0]) {
      var reader = new FileReader();

      reader.onloadstart = () => this.setState({ loading: true });

      reader.onloadend = () => {
        const base64string = reader.result;
        this.props.handleData(files[0], base64string);
      };

      reader.readAsDataURL(files[0]);
    }
  }

  render() {
    return (
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={this.handleFileChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}

ImagePicker.propTypes = {
  handleData: PropTypes.func.isRequired
};

export default ImagePicker;
