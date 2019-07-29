import React from "react";
import { Styles } from "./styles";
import { DoctorRoutes } from "../../routes";
import ProgressStepper from "../../components/progress_stepper/ProgressStepper";
import Navbar from "../../components/navbar/Navbar";
import { Redirect, navigate } from "@reach/router";
import { stopSession, getSessionUser } from "../../services/session";

export default class DoctorPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: parseInt(this.props.pageId) || 0,

      // Currently logged-in user (doctor)
      user: getSessionUser(),
    };
  }

  componentWillReceiveProps(props) {
    if (props.pageId !== this.state.currentPage) {
      this.setState({ currentPage: parseInt(props.pageId) || 0 });
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
        </div>
      );
    }

    return <Redirect to={"/login"} noThrow />;
  }

  renderPage() {
    // Note that we pass the currently-logged in user as props
    return DoctorRoutes()[this.state.currentPage].component({
      user: this.state.user,
    });
  }

  renderProgressStepper() {
    return (
      <ProgressStepper
        currentStep={this.state.currentPage}
        steps={DoctorRoutes().map(d => d.title)}
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
            key: "btn-about-us",
            title: "About Us",
            linkTo: "/about-us",
            onClick: this.onAboutButtonPress,
          },
        ]}
        rightMenuButtons={[
          {
            key: "btn-logout",
            title: "Logout",
            onClick: this.onLogoutButtonPress,
          },
        ]}
      />
    );
  }
}
