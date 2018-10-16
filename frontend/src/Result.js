import React, { Component } from 'react';
import { Button, Form, TextArea, Input, Radio, Select, Modal } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';

import ActualApp from './ActualApp.js';

import bannerimg from './img/bg2.jpg';

const bannerStyle = {
  height:300,
  backgroundImage: 'url(' + bannerimg + ')',
  backgroundSize: 'cover'
};

const Banner = ({ img, text }) => (
  <div style={bannerStyle}>
  </div>
);
const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );


class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.state;
    console.log(localStorage.getItem('test'))
  }

  /*** CHARTS AND DISPLAY DATA STUFF ***/


  render() {
    const ModalJSON = () => (
      <Modal trigger={<button class='ui animated button' role='button'>
        <div class='visible content'>View JSON</div>
        <div class='hidden content'>
          <i aria-hidden='true' class='external alternate icon' />
        </div></button>}>
        <Modal.Header>JSON Result</Modal.Header>
        <Modal.Content>
          <Modal.Description>
          <ReactJson src={this.state} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
    return(
      <div>
      <Banner />
      <div class='ui main text container' style={{marginBottom:60}}>
        <Title2 text='Showing Results'/>
        <ModalJSON />
        <p>Charts here...</p>
        <p>Other information here...</p>
        <Link to='/api'><button class='ui icon left labeled button' role='button'>
          <i aria-hidden='true' class='left arrow icon' />
          Back
        </button></Link>
      </div>
      </div>
    );
  }
}

export default Result;
