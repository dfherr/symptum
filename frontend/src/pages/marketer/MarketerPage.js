import React, { Component } from "react";
import Navbar from "../../components/navbar/Navbar";
import { Styles } from "./styles";
import ProgressStepper from "../../components/progress_stepper/ProgressStepper";
import { MarketerRoutes } from "../../routes";
import { getLoggedInUser } from "../../services/user";
import { Redirect, navigate } from "@reach/router";
import { stopSession, getSessionUser } from "../../services/session";
import { postDrug } from "../../services/drug";
import {
  getSessionExtra,
  setSessionExtra,
  removeSessionExtra
} from "../../services/session";
import Alert from "../../components/Alert/Alert";
import { postCampaign } from "../../services/campaign";

/**
 * This class handles the actions in the children subpages of the marketer workflow
 * Saves the informations in the localStorage and gives them as props for the subpages
 */
export class MarketerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: parseInt(this.props.pageId) || 0,

      isLoading: true,

      // Drug picture in file form as required in the database
      image: getSessionExtra("drugImage") || null,
      // Base64String of the picture required in Upload Picture page
      base64Image: getSessionExtra("drug").picture || "",
      drug: getSessionExtra("drug") || null,
      completed: getSessionExtra("completed") || false,
      campaign: getSessionExtra("campaign") || null,

      // Currently logged-in user (doctor)
      user: getSessionUser()
    };

    this.getUser();
  }

  /**
   * Handles the drug object obtained from the Add drug info page
   * Checks whether the picture property is set first. If yes, it does not override it because the Upload Picture page is responsible for that
   */
  handleDrug = drug => {
    const picture = this.state.base64Image;
    if (picture === "") {
      setSessionExtra("drug", drug);
      this.setState({ drug: drug });
    } else {
      const newDrug = {
        name: drug.name,
        price: drug.price,
        dosage: drug.dosage,
        selectedDiseases: drug.selectedDiseases,
        selectedIngredients: drug.selectedIngredients,
        picture: picture
      };
      setSessionExtra("drug", newDrug);
      this.setState({ drug: newDrug });
    }
    this.displayAlert("success", "Drug information saved!");
  };

  /**
   * Handles the campaing object obtained from the Start campaign page
   * Afterwards it calls the createDrug method that posts the drug in backend
   * @param {*} camp
   */
  async handleCampaign(camp) {
    this.setState({ campaign: camp });
    setSessionExtra("campaign", camp);
    this.createDrug(camp, this.handleCompletetion);
  }

  /**
   * Callback function given to createDrug method. It handles the post of campaign
   */
  async handleCompletetion(result, token, campaign) {
    if (result.success) {
      const drugId = result.result.data.data.id;
      campaign.drugId = drugId;
      const response = await postCampaign(campaign, token);

      if (response.success) {
        return {
          success: true,
          result: response.result,
          campaign: campaign,
          drug: result.result.data.data
        };
      } else {
        return {
          success: false,
          result: response.result
        };
      }
    } else {
      return {
        success: false,
        result: result.result
      };
    }
  }

  /**
   * Removes duplicates in an int array. Used to removed duplicates from the diseaseIds and ingredientIds since not allowed in db
   */
  removeDuplicates(intArray) {
    return intArray.filter((v, i) => intArray.indexOf(v) === i);
  }

  /**
   * Posts the drug in the state to backend, waits for the response and calls the callback function that posts the associated campaign
   * @param {*} campaign
   * @param {*} callback
   */
  async createDrug(campaign, callback) {
    if (this.state.drug && this.state.image) {
      var { name, price, dosage } = this.state.drug;
      var token = this.state.user.sessionId;
      const diseasesIds = this.removeDuplicates(
        this.state.drug.selectedDiseases.map(s => parseInt(s.id))
      );
      const drugIngredients = this.state.drug.selectedIngredients
       
      var diseaseIdsString = "";

      // The backend expects the list of ids as a string 1,2,3. This is prepared here
      diseasesIds.forEach(s => (diseaseIdsString += s + ","));

      var diseases = diseaseIdsString.slice(0, diseaseIdsString.length - 1);
      

      // Form data object expected from the backend
      const body = new FormData();
      body.set("diseaseIds", diseases);
      body.set("drugIngredients", JSON.stringify(drugIngredients));
      body.set("name", name);
      body.set("price", price);
      body.set("dosage", dosage);
      body.append("picture", this.state.image);

      // Post drug and wait for respons
      const result = await postDrug(body, token);

      // Call the callback function to post the campaing. Drug id is saved in result if postDrug succedded
      const callbackResult = await callback(result, token, campaign);
      if (callbackResult.success) {
        // If everything succeded, we save the objects in the state and change the property completed to true
        // Shows the confirmation component
        this.setState({
          drug: callbackResult.drug,
          campaign: callbackResult.campaign
        });
        this.setState({ completed: true });
        setSessionExtra("completed", this.state.completed);
      } else {
        this.displayAlert("error", "An error occured. Please try again");
      }
    } else {
      this.displayAlert(
        "error",
        "Please make sure you have saved all the required information for your new drug in the previous pages!"
      );
    }
  }

  // Handles the picture object obtained from Upload Picture page. Saves it in the state in two different forms and in the localStorage
  handlePicture = (file, base64) => {
    this.setState({ image: file });
    this.setState({ base64Image: base64 });
    const drug = this.state.drug;
    drug.picture = base64;
    setSessionExtra("drug", drug);
    setSessionExtra("drugImage", file);
  };

  // Gets loggedInUser and saves it in the state
  async getUser() {
    const user = await getLoggedInUser();

    // Fail silently and go to login.
    if (!user.success) {
      this.setState({
        user: null,
        isLoading: false
      });
      return;
    }

    this.setState({
      user: user.result,
      isLoading: false
    });
  }

  componentWillReceiveProps(props) {
    if (props.pageId !== this.state.currentPage) {
      this.setState({
        currentPage: props.pageId
      });
    }
  }

  onLogoutButtonPress() {
    stopSession();
    navigate("/login");
  }

  render() {
    if (this.state.user) {
      return (
        <div style={Styles.container}>
          {this.renderNavbar()}
          <div style={Styles.contentContainer}>
            <div style={Styles.leftContainer}>
              {this.renderProgressStepper()}
            </div>
            <div style={Styles.rightContainer}>{this.renderPage()}</div>
          </div>
          {this.renderAlert()};
        </div>
      );
    }

    return <Redirect to={"/login"} noThrow />;
  }

  // Saves the base64String of image file in state
  base64Image() {
    if (this.state.image) {
      var reader = new FileReader();

      reader.onloadend = event => {
        this.setState({
          base64Image: reader.result
        });
      };
      reader.readAsDataURL(this.state.image);
    }
  }

  // Handles restarting to add a new drug. Removes all the saved information from localStorage and navigates the user in the first subpage of the workflow
  addNewDrug = () => {
    removeSessionExtra("drug");
    removeSessionExtra("drugImage");
    removeSessionExtra("completed");
    removeSessionExtra("campaign");
    navigate("/");
  };

  renderPage() {
    if (this.state.completed && this.state.currentPage !== 2) {
      return MarketerRoutes()[2].component({
        user: this.state.user,
        drug: this.state.drug ? this.state.drug : null,
        campaign: this.state.campaign ? this.state.campaign : null,
        handleDrug: this.handleDrug,
        handleCampaign: this.handleCampaign.bind(this),
        handlePicture: this.handlePicture.bind(this),
        image: this.state.drug ? this.state.drug.picture : "",
        completed: this.state.completed,
        addNewDrug: this.addNewDrug
      });
    } else {
      return MarketerRoutes()[this.state.currentPage].component({
        user: this.state.user,
        drug: this.state.drug ? this.state.drug : null,
        campaign: this.state.campaign ? this.state.campaign : null,
        handleDrug: this.handleDrug,
        handleCampaign: this.handleCampaign.bind(this),
        handlePicture: this.handlePicture.bind(this),
        image: this.state.drug ? this.state.drug.picture : "",
        completed: this.state.completed,
        addNewDrug: this.addNewDrug
      });
    }
  }

  renderProgressStepper() {
    return (
      <ProgressStepper
        currentStep={parseInt(this.state.currentPage)}
        steps={MarketerRoutes().map(d => d.title)}
      />
    );
  }

  renderNavbar() {
    const profile = this.state.user.profile;
    const displayName = `${profile.firstName} ${profile.lastName}`;
    return (
      <Navbar
        displayName={displayName}
        rightButtons={[
          {
            key: "btn-about",
            title: "About Us",
            linkTo: "/about-us",
            onClick: this.onAboutButtonPress
          }
        ]}
        rightMenuButtons={[
          {
            key: "btn-logout",
            title: "Logout",
            onClick: this.onLogoutButtonPress
          }
        ]}
      />
    );
  }

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

export default MarketerPage;
