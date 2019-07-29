import React, { Component } from "react";
import AutocompleteInput from "../../AutocompleteInput";

export class IngredientsAutocomplete extends Component {
  onIngredientSelected(ingredient) {
    const s = this.toIngredientObj(ingredient);
    this.props.onItemSelected(s);
  }

  /**
   * Converts a ingredient object into an object that is
   * readable by the autocomplete component.
   * @param {*} ingredient
   */
  toInputObj = ingredient => {
    const label = ingredient.name + " " + ingredient.concentration + "mg";
    return { label: label, value: ingredient.id };
  };

  /**
   * Converts an autocomplete suggestion object into a ingredient.
   * @param {*} inputObj
   */
  toIngredientObj(inputObj) {
    var values = inputObj.label.split(" ");
    var name = "";

    for (var i = 0; i < values.length - 1; i++) {
      name += values[i] + " ";
    }
    var newName = name.slice(0, name.length - 1);
    return {
      id: inputObj.value,
      name: newName,
      concentration: values[values.length - 1].split("mg")[0]
    };
  }

  render() {
    return (
      <AutocompleteInput
        items={this.props.items.map(s => this.toInputObj(s))}
        onItemSelected={s => this.onIngredientSelected(s)}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default IngredientsAutocomplete;
