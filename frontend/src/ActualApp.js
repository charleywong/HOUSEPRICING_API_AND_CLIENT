import React, { Component } from 'react';
import { Button, Form, TextArea, Input, Radio, Select, Divider } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios'

import './ActualApp.css';
import Result from './Result.js';

import bannerimg from './img/bg2.jpg';

import createHistory from "history/createBrowserHistory";

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

const history = createHistory({forceRefresh:true})

class ApiForm extends React.Component {
  constructor(props) {
    super(props);
    this.location = this.props.location;
    this.state = { address: '', city: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(document.getElementById('apiform'));
    // history.push('/result',
    //   { address: data.get('address'),
    //   city: data.get('city')
    // });
    // note that because this request is async, when handling response, we should try to use callback functions such as console.log
    // rather than functions like alert() which is also async
    // there is also a bug with this where if your resulting data is too large, it'll throw an except.
    // googling, it says a way around this is to not use the history thing and use
    // sessionStorage and/or localStorage:
    // https://stackoverflow.com/questions/24425885/failed-to-execute-pushstate-on-history-error-when-using-window-history-pushs
    // please also note that we need to replace the current link with localhost:3001/.... 
    axios.get('https://api.github.com/users/charleywong').then(function(response) {
      // console.log(response.data);
      history.push('/result',response.data)
    });

  }
  render() {
    return(
      <div>
      <Title3 text='Start Valuation' />
      <form name='apiform' id='apiform'
        onSubmit={this.handleSubmit}
        class='ui form'
        style={{marginBottom:60}}>
        <div class='field'>
          <label>Street Address</label>
            <input
              onChange={this.handleChange}
              name='address' id='address'
              value={this.state.address}
              placeholder='e.g. 1 Two Street'/>
        </div>
        <div class='field'>
          <label>City/Town/Suburb</label>
            <input
              onChange={this.handleChange}
              name='city' id='city'
              value={this.state.city}
              placeholder='e.g. New York City'/>
        </div>
        <button
          type='submit'
          class='ui icon right labeled button'
          role='button'><i aria-hidden='true' class='right arrow icon' />Submit
        </button>
      </form>
      </div>
    );
  }
};

class ActualApp extends Component {
  render() {
    return (
      <div>
        <Banner />
        <div class='ui main text container'>
          <Title2 text='PROPERTY VALUATION API'/>
          <Title3 text='Overview' />

          <h4>User inputs</h4>
          <p>Users are required to enter as much information about the target property as possible in order to produce accurate predictions about the housing market. Fields are as follows:</p>
          <h4>Output</h4>
          <p>The service will run your data through our machine learning model to give an accurate property valuation.</p>
          <Link to='/docs'><button class='ui button'>View detailed usage instructions</button></Link><br /><br />
          <div style={{paddingBottom:20}} class='ui divider' />
          <ApiForm location={this.props.location}/>

        </div>
      </div>
    );
  }
};

export default ActualApp;
