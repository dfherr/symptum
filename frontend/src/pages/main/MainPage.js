import React from "react";
import { Redirect } from "@reach/router";
import { getLoggedInUser } from "../../services/user";
import Navbar from "../../components/navbar/Navbar";
import Gears from "../../components/gears/Gears";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      error: "",
      isLoading: true,
      user: null,
    };
  }

  renderNavbar() {
    return (
      <Navbar
        rightButtons={[
          {
            key: "btn-about-us",
            title: "About Us",
            linkTo: "/about-us",
            onClick: () => console.log("about us clicked"),
          },
        ]}
      />
    );
  }


  componentDidMount () {
    this.getUser();
  } 

  componentWillUnmount () {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
  }
  /**
   * Tries to retrieve the currently logged
   * in user including his/her data.
   */
  async getUser() {
    const user = await getLoggedInUser();

    if (!user.success) {
      this.renderError(user.result);
      return;
    }
    this.timeoutId = setTimeout(function () {
      this.setState({ isLoading: false, user: user.result });
    }.bind(this), 400);
  }

  render() {
    if (this.state.isError) {
      return <Redirect to={"/500"} noThrow />;
    }

    if( this.state.isLoading ){
      return (
        <div>
          {this.renderNavbar()}
          <div className="loading" style={{marginTop: "35vh"}}>
            <Gears rotating={true} backgroundColor={"#fff"}/>
          </div>
        </div>
      );
    }
    if (this.state.user === null ) {
      return <Redirect to={"/login"} noThrow />;
    }
    return <Redirect to={`/${this.state.user.profile.type}/0`} noThrow />;
  }

  renderError(error) {
    this.setState({
      isLoading: false,
      isError: true,
      error,
    });
  }
}
