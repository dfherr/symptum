import React, {Component} from 'react'
import "./Gears.css";
import PropTypes from "prop-types";

export default class Gears extends Component {

  render() {
      return (
        <div className={this.props.rotating ? "rotating" : null}
            style={{"--background-color": this.props.backgroundColor}}>
          <div className="gears">
            <div className="gear one">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <div className="gear two">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <div className="gear three">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
        </div>
        </div>
        
      );
  }
}

Gears.propTypes = {
  rotating: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};