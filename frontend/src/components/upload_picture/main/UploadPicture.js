import React, { Component } from "react";
import UploadPictureForm from "../form/UploadPictureForm";

import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";
import { Paper } from "@material-ui/core";
import PropTypes from "prop-types";

export class UploadPicture extends Component {
  render() {
    return (
      <Paper style={Styles.container}>
        <Typography style={Styles.title} variant="h4" component="h4">
          Upload picture
        </Typography>
        <UploadPictureForm
          image={this.props.image}
          handleData={this.props.handleData}
        />
      </Paper>
    );
  }
}

UploadPicture.propTypes = {
  image: PropTypes.string.isRequired,
  handleData: PropTypes.func.isRequired
};

export default UploadPicture;
