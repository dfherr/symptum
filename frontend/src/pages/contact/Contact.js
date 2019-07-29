import React from "react";
import Box from "@material-ui/core/Box";
import Navbar from "../../components/navbar/Navbar";
import "./Contact.css";

export default class Contact extends React.Component {
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
        <Box className="Contact-container" justify="center">
          <h1 className="Title">Contact</h1>
          <p>This is a university project for the Technical University of Munich</p>
          <p>For any questions regarind this prototype reach out to info@dfherr.com</p>
        </Box>
      </div>
    );
  }
}
