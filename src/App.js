import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import './App.css';

import ActualApp from './ActualApp.js';
import Nav from './Nav.js';
import HomeBody from './HomeBody.js';
import Docs from './Docs.js';
import Footer from './Footer.js';


class App extends Component {
  render() {
    return (
      <HashRouter>
      <div className="App">
        <Nav />
        <Route exact path='/' component={HomeBody} />
        <Route path='/api' component={ActualApp} />
        <Route path='/docs' component={Docs} />
        <Footer />
      </div>
      </HashRouter>
    );
  }
}
export default App;
