import React from "react";
import Button from "@material-ui/core/Button";
import { navigate } from "@reach/router";

import PropTypes from "prop-types";
import { Styles } from "./styles";

export default class ProgressButtons extends React.Component {
  render() {
    return (
      <div style={Styles.container}>
        {this.renderButton(
          "Go back",
          this.props.hrefPrev,
          this.props.onPrevButtonClick
        )}
        {this.renderButton(
          "Next",
          this.props.hrefNext,
          this.props.onNextButtonClick
        )}
      </div>
    );
  }

  renderButton(text, href, f) {
    return href ? (
      <Button
        onClick={() => f(href)}
        style={Styles.button}
        variant="contained"
        color="primary"
      >
        {text}
      </Button>
    ) : null;
  }
}

ProgressButtons.propTypes = {
  // Path to previous screen. If empty, button is not rendered
  hrefPrev: PropTypes.string,

  // Path to next screen. If empty, button is not rendered
  hrefNext: PropTypes.string,

  onNextButtonClick: PropTypes.func.isRequired,
  onPrevButtonClick: PropTypes.func.isRequired,
};
