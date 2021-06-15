import React from 'react';
import './style/Navigation.css';
import {
  NavLink
} from "react-router-dom";

const Navigation = () => {
  return (
        <ul>
          <li>
            <NavLink id="nav" exact activeClassName="current" to="/">Home</NavLink>
          </li>
          <li>
            <NavLink id="nav" exact activeClassName="current" to="/canvas">Canvas</NavLink>
          </li>
        </ul>
  );
}

export default Navigation;