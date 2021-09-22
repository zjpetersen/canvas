import React from 'react';
import './style/Navigation.css';
import './style/Home.css';
// import logo from './media/MosaicLogo5.png';
import logo from './media/MosaicLogo48px.png';
import {
  NavLink
} from "react-router-dom";

class Navigation extends React.Component {

faqLink = () => {
    return <li id="navli">
      <NavLink id="nav" exact activeClassName="current" to="/faq">FAQ</NavLink>
    </li>;
  }

uploadLink = () => {
    return <li id="navli">
      <NavLink id="nav" exact activeClassName="current" to="/upload">Adding Art</NavLink>
    </li>;
  }

  render() {
    return (
      <div className="row padBottom">
        <div className="column left" />
        <div className="column middle">
          <div className="row">
            <div className="column leftInner" >
              <span className="helper"></span>
              <img id="logo" src={logo} alt="EtherCanvas logo" />
              <p id="logoText">EtherCanvas</p>
            </div>
            <div className="column rightInner" >
              <span className="helper"></span>
              <ul id="navul">
                <li id="navli">
                  {/* <NavLink id="nav" activeClassName="current" to="/">Canvas</NavLink> */}
                  <NavLink 
                    id="nav"
                    to="/"
                    activeClassName="current"
                    isActive={(match, location) => {
                      if (!match) {
                        return false;
                      }
                      return (match.isExact || location.pathname.includes('tile'));
                    }}
                    >Canvas</NavLink>
                </li>
                {this.faqLink()}
                {this.uploadLink()}
              </ul>
            </div>
          </div>
        </div>
        <div className="column right" />
      </div>

    );
  }
}

export default Navigation;
