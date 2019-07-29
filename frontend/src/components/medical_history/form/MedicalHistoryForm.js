import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Styles } from "./styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import PropTypes from "prop-types";
import moment from "moment";
import DiseaseAutocomplete from "./DiseaseAutocomplete";

export default class MedicalHistoryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: null,
      when: null,
      active: false,
    };
  }

  /**
   * Called when the user selected a disease from the
   * autocomplete control.
   * @param {*} disease
   */
  onDiseaseSelected(disease) {
    this.setState({ name: disease.name, id: disease.id });
  }

  onFormSubmit() {
    const formInput = {
      id: this.state.id,
      name: this.state.name,
      when: this.formatPeriod(this.state.when),
      active: this.state.active,
    };

    // Validate input, reset form, and call callback function
    // for parent component.
    const isValid = this.validateFormInput(formInput);
    if (isValid) {
      this.setState({ id: null, name: null, when: null, active: false });
      this.props.onFormSubmit(formInput);
    }
  }

  formatPeriod(when) {
    if (when instanceof moment) {
      return when.isValid() ? when.format("YYYY-MM-DD") : false;
    }
    return false;
  }

  validateFormInput(formInput) {
    return formInput.name && formInput.name.length > 0 && formInput.when;
  }

  render() {
    return (
      <div>
        <DiseaseAutocomplete
          value={this.state.name}
          diseases={this.props.diseaseSuggestions || []}
          onDiseaseSelected={d => this.onDiseaseSelected(d)}
          placeholder={"Add a disease"}
        />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            clearable
            label="Since / On (DD.MM.YYYY)"
            style={Styles.date}
            value={this.state.when}
            emptyLabel=""
            onChange={date => this.setState({ when: date })}
            format="DD.MM.YYYY"
          />
        </MuiPickersUtilsProvider>
        <div style={Styles.horizontalContainer}>
          <FormControlLabel
            control={<Checkbox checked={this.state.active} />}
            label="Chronic disease"
            onChange={e => this.setState({ active: e.target.checked })}
          />
          <Fab
            style={Styles.addButton}
            color="primary"
            onClick={() => this.onFormSubmit()}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
    );
  }
}

MedicalHistoryForm.propTypes = {
  // Array of diseases for the autocomplete
  diseaseSuggestions: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Called when user presses the "+" button.
  // Returns an object containing the form input.
  onFormSubmit: PropTypes.func.isRequired,
};
