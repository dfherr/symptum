import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Styles } from "./styles";
import IngredientsTable from "../tables/IngredientsTable";
import DiseaseTable from "../tables/DiseaseTable";
import Button from "@material-ui/core/Button";
import DiseaseAutocomplete from "../../medical_history/form/DiseaseAutocomplete";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Alert from "../../Alert/Alert";
import { getIngredients, getDiseases } from "../../../services/drug";
import { LayoutContext } from "../../layout/Layout";

export class DrugInfoForm extends Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.drug.name || "",
      price: this.props.drug.price || "",
      dosage: this.props.drug.dosage || "",
      selectedIngredients: this.props.drug.selectedIngredients || [],
      selectedDiseases: this.props.drug.selectedDiseases || [],
      ingredient: "",
      concentration: "",

      ingredients: this.props.ingredients || null,
      diseases: this.props.diseases || null
    };

    this.getDiseases();
  }

  state = {
    name: this.props.drug.name || "",
    price: this.props.drug.price || "",
    dosage: this.props.drug.dosage || "",
    selectedIngredients: this.props.drug.selectedIngredients || [],
    selectedDiseases: this.props.drug.selectedDiseases || [],
    ingredient: "",
    concentration: "",

    diseases: this.props.diseases || null
  };

  addIngredientToSelected = () => {
    if (this.state.ingredient === "" || this.state.concentration === "" ) {
      this.displayAlert("Error", "Please make sure you enter the Ingrendient name and its concentration")
    } else {
      const ingredient = {
        name: this.state.ingredient,
        concentration: this.state.concentration
      }

      this.setState({
        selectedIngredients: [...this.state.selectedIngredients, ingredient]
      });
      this.setState({ingredient: ""})
      this.setState({concentration: ""})
    }
  }

  /**
   * Add a disease in the list of selectedDiseases
   */
  onDiseaseSelected = disease => {
    if (!this.contains(disease, this.state.selectedDiseases)) {
      this.setState({
        selectedDiseases: [...this.state.selectedDiseases, disease]
      });
    } else {
      this.displayAlert(
        "error",
        `You have already selected ${disease.name}. Please chose another one.`
      );
    }
  };

  /**
   * Checks whether the element is contained in array
   */
  contains(element, array) {
    var contains = false;
    if (!array || array.length === 0) {
      return contains;
    }

    array.forEach(el => {
      if (el.id === element.id) {
        contains = true;
      }
    });

    return contains;
  }

  /**
   * Updates the states when the user types in the text fields
   */
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /**
   * Removes a disease from the list of selected diseases
   */
  onDiseaseRemoved = disease => {
    const index = this.state.selectedDiseases.indexOf(disease);
    let selectedDiseases = this.state.selectedDiseases;
    selectedDiseases.splice(index, 1);
    this.setState({ selectedDiseases });
  };

  /**
   * Renders the table of ingredients
   */
  showIngredientsTable = () => {
    if (this.state.selectedIngredients) {
      if (this.state.selectedIngredients.length > 0) {
        return (
          <div style={Styles.halfWidth}>
            <IngredientsTable
              ingredients={this.state.selectedIngredients}
              onIngredientRemoved={this.onIngredientRemoved}
            />
          </div>
        );
      }
    }
  };

  /**
   * Called when save button is pressed. Creates a drug object with the infor
   */
  onFormSubmit = () => {
    const {
      name,
      price,
      dosage,
      selectedIngredients,
      selectedDiseases
    } = this.state;

    const createdDrug = {
      name,
      price,
      dosage,
      selectedDiseases,
      selectedIngredients,
      picture: ""
    };

    this.props.onFormSubmit(createdDrug);
  };

  /**
   * Async call to backend to get all the ingredients in db. They are assigned to selectedIngredients and used in the autocompletion
   */
  async getAllIngredients() {
    if (this.props.user) {
      const result = await getIngredients(this.props.user.sessionId);
      if (result.success) {
        this.setState({ ingredients: result.result.data.data });
      } else {
        this.displayAlert("error", "Cant load ingredients")
      }
    } else {
      console.log("no user");
    }
  }

  /**
   * Async call to backend to get all the diseases in db. They are assigned to selectedIngredients and used in the autocompletion
   */
  async getDiseases() {
    if (this.props.user) {
      // this.context.setLoading(true);
      const result = await getDiseases(this.props.user.sessionId);
      if (result.success) {
        // this.context.setLoading(false);
        this.setState({ diseases: result.result.data.data });
      } else {
        this.displayAlert("error", "Cant load diseases")
      }
      
    } else {
      console.log("no user");
    }
  }

  /**
   * Shows the table of selected diseases
   */
  showDiseaseTable = () => {
    if (this.state.selectedDiseases) {
      if (this.state.selectedDiseases.length > 0) {
        return (
          <DiseaseTable
            diseases={this.state.selectedDiseases}
            onDiseaseRemoved={this.onDiseaseRemoved}
          />
        );
      }
    }
  };

  /**
   * Adds an ingredient to the list of selected ingredients
   */
  onIngredientSelected = i => {
    if (!this.contains(i, this.state.selectedIngredients)) {
      this.setState({
        selectedIngredients: [...this.state.selectedIngredients, i]
      });
    } else {
      this.displayAlert(
        "error",
        `You have already selected ${i.name}. Please chose another one.`
      );
    }
  };

  /**
   * Removes the ingredients from the list of selected ingredients
   */
  onIngredientRemoved = ingredient => {
    const index = this.state.selectedIngredients.indexOf(ingredient);
    let selectedIngredients = this.state.selectedIngredients;
    selectedIngredients.splice(index, 1);
    this.setState({ selectedIngredients });
  };


  render() {
    return (
      <form>
        <div style={Styles.horizontal}>
          <TextField
            style={Styles.halfWidth}
            required
            name="name"
            label="Drug name"
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            style={Styles.quarterWidth}
            required
            label="Price"
            name="price"
            value={this.state.price}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            style={Styles.quarterWidth}
            required
            label="Dosage"
            name="dosage"
            value={this.state.dosage}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>

        <div style = {Styles.horizontal}>
        <TextField
            style={Styles.fourthWidth}
            required
            name="ingredient"
            label="Ingredient name"
            value={this.state.ingredient}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
           <TextField
            style={Styles.fourthWidth}
            required
            name="concentration"
            label="Concentration"
            value={this.state.concentration}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
          />
          <Fab
            style={Styles.addButton}
            color="primary"
            onClick={() => this.addIngredientToSelected()}
          >
            <AddIcon />
          </Fab>
        </div>
        {this.showIngredientsTable()}

        <div style={Styles.halfWidth}>
          <div style={{ marginBottom: 20, marginTop: 20 }}>Diseases</div>
          <DiseaseAutocomplete
            diseases={this.state.diseases || []}
            onDiseaseSelected={s => this.onDiseaseSelected(s)}
            placeholder={"What diseases does it treat?"}
          />
        </div>
        <div style={Styles.halfWidth}>{this.showDiseaseTable()}</div>
        <Button
          style={Styles.button}
          onClick={this.onFormSubmit}
          variant="contained"
          color="secondary"
        >
          Save
        </Button>
        {this.renderAlert()}
      </form>
    );
  }


  /**
   * Renders the alert with a message
   */
  renderAlert() {
    if (!this.state.displayAlert) {
      return null;
    }

    return (
      <Alert
        type={this.state.alertType}
        message={this.state.alertMessage}
        open={this.state.displayAlert}
        onClose={(e, r) => this.setState({ displayAlert: false })}
      />
    );
  }

  displayAlert(type, message) {
    this.setState({
      displayAlert: true,
      alertMessage: message,
      alertType: type
    });
  }
}

DrugInfoForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired
};

export default DrugInfoForm;
