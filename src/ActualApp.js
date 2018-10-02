import React, { Component } from 'react';
import { Button, Form, TextArea, Input, Radio, Select } from 'semantic-ui-react';

import './ActualApp.css';

import bannerimg from './img/bg2.jpg';

const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );

const bannerStyle = {
  height:300,
  backgroundImage: 'url(' + bannerimg + ')',
  backgroundSize: 'cover'
};

const Banner = ({ img, text }) => (
  <div style={bannerStyle}>
  </div>
);

const ApiForm = () => (
  <form class='ui form' style={{marginBottom:60}}>
    <div class='field'>
      <label>Street Address</label>
        <input placeholder='e.g. 1 Two Street'/>
    </div>
    <div class='field'>
      <label>City/Town/Suburb</label>
        <input placeholder='e.g. New York City'/>
    </div>
    <button type='submit' class='ui button' role='button'>Submit</button>
  </form>
);

class ActualApp extends Component {
  render() {
    return (
      <div>
        <Banner />
        <div class='ui main text container'>
          <Title2 text='PROPERTY VALUATION API'/>
          <Title3 text='Overview' />
          <p>Read more about our service here</p>
          <p>User inputs</p>
          <Title3 text='Start Valuation' />
          <ApiForm />
        </div>
      </div>
    );
  }
};

export default ActualApp;
