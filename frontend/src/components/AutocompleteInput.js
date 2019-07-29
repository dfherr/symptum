import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

export default class AutocompleteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
    };
  }

  componentWillReceiveProps(props) {
    if (props.value === null) {
      this.setState({ selectedItem: null });
    } else {
      const selectedItem = this.props.items.find(i => i.value === props.value);
      this.setState({ selectedItem });
    }
  }

  onItemSelected(selectedItem) {
    this.setState({ selectedItem });

    // Call callback
    this.props.onItemSelected(selectedItem);
  }

  render() {
    const resultLimit = 6;
    let i = 0;
    return (
      <Select
        filterOption={({ label }, query) =>
          label.indexOf(query) >= 0 && i++ < resultLimit
        }
        onInputChange={() => {
          i = 0;
        }}
        value={this.state.selectedItem}
        onChange={s => this.onItemSelected(s)}
        options={this.props.items}
        placeholder={this.props.placeholder}
      />
    );
    // return (
    //   <Select
    //     value={this.state.selectedItem}
    //     onChange={s => this.onItemSelected(s)}
    //     options={this.props.items}
    //     placeholder={this.props.placeholder}
    //   />
    // );
  }
}

AutocompleteInput.propTypes = {
  // Autocomplete suggestions
  items: PropTypes.arrayOf(
    PropTypes.shape(
      {
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }.isRequired
    )
  ),

  value: PropTypes.string,

  placeholder: PropTypes.string,

  // Callback called when the selected items have
  // changed. Passes an array of selected items.
  onItemSelected: PropTypes.func.isRequired,
};
