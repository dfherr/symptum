import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { Styles } from "./styles";
import DrugList from "../drug_list/DrugList";

export default class DrugModal extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          onClose={e => this.props.onCloseButtonPress()}
          open={this.props.isOpen}
        >
          <DialogTitle>
            Helpful drugs
            <IconButton
              style={Styles.closeButton}
              onClick={e => this.props.onCloseButtonPress()}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DrugList drugs={this.props.drugs} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

DrugModal.propTypes = {
  // Array of symptoms for the autocomplete
  drugs: PropTypes.arrayOf(
    PropTypes.shape(
      {
        imageUrl: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  isOpen: PropTypes.bool,

  onCloseButtonPress: PropTypes.func.isRequired,
};
