import React from 'react';
import './style/Navigation.css';
import './style/Home.css';
import logo from './media/MosaicLogo5.png';
import {
  NavLink
} from "react-router-dom";

const Navigation = () => {
  return (
    <div className="row">
      <div className="column left" />
      <div className="column middle">
        <div className="row">
          <div className="column leftInner" >
            <span className="helper"></span>
            <img id="logo" src={logo} alt="Mosaic logo" />
            <p id="logoText">Mosaic</p>
          </div>
          <div className="column rightInner" >
            <span className="helper"></span>
            <ul id="navul">
              <li id="navli">
                <NavLink id="nav" exact activeClassName="current" to="/">Home</NavLink>
              </li>
              <li id="navli">
                <NavLink id="nav" exact activeClassName="current" to="/canvas">Canvas</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="column right" />
    </div>

  );
}

export default Navigation;