import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import logo from './img/logo.svg';

/*** navbar ***/
const Nav = props => (
      <div class='inverted ui menu borderless fixed'>
        <div id='top'></div>
        <div class='yellow ui container'>
          <Link to='/' class='yellow header item'><img src={logo} style={{marginRight: 15,}}/>HOUSOS</Link>
          <Link to='/'class='item'>Home</Link>
          <Link to="/api" class='item'>Explore the API</Link>
          <Link to='/docs'class='item'>Docs</Link>
        </div>
      </div>
);

export default Nav;
