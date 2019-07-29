import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import PropTypes from "prop-types";
import { Styles } from "./styles";

export default class Alert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open || false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.open) {
      this.setState({ open: props.open });
    }
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
    this.props.onClose();
  }

  render() {
    return (
      <Snackbar
        style={Styles.alertBox}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={this.state.open}
        autoHideDuration={3000}
        onClose={(e, r) => this.handleClose(e, r)}
      >
        <SnackbarContent
          style={
            this.props.type === "success"
              ? Styles.successBackground
              : Styles.errorBackground
          }
          message={
            <span style={Styles.message}>
              {this.props.type === "success" ? (
                <CheckCircleIcon style={Styles.leftIcon} />
              ) : (
                <ErrorIcon style={Styles.leftIcon} />
              )}
              {this.props.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              color="inherit"
              onClick={(e, r) => this.handleClose(e, r)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

Alert.propTypes = {
  // "success" or "error"
  type: PropTypes.string.isRequired,

  // alert message
  message: PropTypes.string.isRequired,

  // controls alert visibility
  open: PropTypes.bool,

  // Callback called when the alert closes.
  onClose: PropTypes.func.isRequired,
};
