import React from "react";
import PropTypes from "prop-types";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default class Dropdown extends React.Component {
  onItemPress(event) {
    const pressedId = event.target.value;
    const item = this.props.items.find(i => i.id === pressedId);
    this.props.onItemPress(item);
  }

  render() {
    return (
      <FormControl style={this.props.containerStyle}>
        <InputLabel>{this.props.label}</InputLabel>
        <Select value={this.props.value} onChange={e => this.onItemPress(e)}>
          {this.props.items.map(i => (
            <MenuItem key={i.id} value={i.id}>
              {i.name}{" "}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

Dropdown.propTypes = {
  // Style outer component
  containerStyle: PropTypes.object,

  // Title of the dropdown
  label: PropTypes.string.isRequired,

  // Array of items for the dropdown
  items: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  // Optional default selected value (must be an id)
  value: PropTypes.string,

  // Called when a dropdown item has been pressed.
  // Returns the item that was pressed.
  onItemPress: PropTypes.func.isRequired,
};
