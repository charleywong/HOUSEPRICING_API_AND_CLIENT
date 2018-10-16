import React, { Component } from 'react';
import { Router, BrowserRouter, Route, Link } from 'react-router-dom';

import './App.css';

import ActualApp from './ActualApp.js';
import Nav from './Nav.js';
import HomeBody from './HomeBody.js';
import Docs from './Docs.js';
import Footer from './Footer.js';

import Result from './Result.js';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Nav />
        <Route exact path='/' component={HomeBody} />
        <Route path='/api' component={ActualApp} />
        <Route path='/docs' component={Docs} />
        <Route path='/result' component={Result} />
        <Footer />
      </div>
      </BrowserRouter>
    );
  }
}
export default App;
