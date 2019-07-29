import React from "react";

import Navbar from "../../components/navbar/Navbar";
import "./ErrorPage.css";
import Gears from "../../components/gears/Gears";

export default class ErrorPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showLoading: true,
      pageX: window.innerWidth,
      pageY: window.innerHeight,
      ghostEyeStyle: { margin: 50} 
    };
  }

  componentDidMount () {
    this.timeoutId = setTimeout(function () {
        this.setState({showLoading: false});
    }.bind(this), 1200);
  } 

  componentWillUnmount () {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
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

  render() {
    return (
      <div>
        {this.renderNavbar()}
        <div>
          <div className={this.state.showLoading ? 'loading' : null}>
          <h1 className="messageTop">500</h1>
          <h2 className="messageBottom">
            <p>We got stuck :(</p>
            <p>It's not you, it's us!</p>
          </h2>
          </div>
          <Gears rotating={this.state.showLoading} backgroundColor={"#fff"}/>
        </div>
      </div>
    );
  }
}
