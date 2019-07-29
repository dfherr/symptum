import React from "react";
import { Styles } from "./styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseCircleOutline from "mdi-material-ui/CloseCircleOutline";
import PropTypes from "prop-types";

export default class SymptomList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symptoms: this.props.symptoms || [],
    };
  }

  componentWillReceiveProps(props) {
    if (props.symptoms) {
      this.setState({ symptoms: props.symptoms });
    }
  }

  onDeleteButtonPress(deletedSymptom) {
    const symptoms = this.state.symptoms.filter(
      x => x.id !== deletedSymptom.id
    );
    this.setState({ symptoms });

    this.props.onSymptomDeleted(deletedSymptom);
  }

  render() {
    return (
      <div style={Styles.list}>
        {this.state.symptoms.map(s => (
          <div key={s.id} style={Styles.symptomContainer}>
            <Typography style={Styles.symptomName} variant="h1" component="h1">
              {s.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => this.onDeleteButtonPress(s)}
            >
              <CloseCircleOutline />
            </IconButton>
          </div>
        ))}
      </div>
    );
  }
}

SymptomList.propTypes = {
  symptoms: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Callback returning the deleted symptom.
  onSymptomDeleted: PropTypes.func.isRequired,
};
