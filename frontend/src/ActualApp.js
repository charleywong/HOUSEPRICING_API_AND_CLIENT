import React, { Component } from 'react';
import { Button, Form, Divider, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateInput } from 'semantic-ui-calendar-react';
import createHistory from "history/createBrowserHistory";
import axios from 'axios';


import './ActualApp.css';
import bannerimg from './img/bg2.jpg';
import Sell from './Sell.js';

const history = createHistory({forceRefresh:true})
const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );
const Title4 = ({ text }) => ( <h3 class='App-title3'>{text}</h3> );
const bannerStyle = {
  height:300,
  backgroundImage: 'url(' + bannerimg + ')',
  backgroundSize: 'cover'
};
const Banner = ({ img, text }) => (
  <div style={bannerStyle}>
  </div>
);

const optionsType = [
  { key: 'H', text: 'House', value:'h'},
  { key: 'U', text: 'Unit', value:'u'},
  { key: 'T', text: 'Townhouse', value:'t'}
]

const optionsNums = [
  {key: '1', text: '1', value:'1'},
  {key: '2', text: '2', value:'2'},
  {key: '3', text: '3', value:'3'},
  {key: '4', text: '4', value:'4'},
  {key: '5', text: '5', value:'5'},
  {key: '6', text: '6', value:'6'},
  {key: '7', text: '7', value:'7'},
  {key: '8', text: '8', value:'8'},
  {key: '9', text: '9', value:'9'},
  {key: '10', text: '10', value:'10'},
]

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
class ActualApp extends Component {
  render() {
    return (
      <div>
        <Banner />
        <div class='ui main text container'>
          <Title2 text='PROPERTY VALUATION API'/>
          <Title3 text='Overview' />
          <h4>User Inputs</h4>
          <p>Users are required to enter as much information about the target property as possible in order to produce accurate predictions about the housing market. Fields are as follows:</p>
          <h4>Output</h4>
          <p>The service will run your data through our machine learning model to give an accurate property valuation.</p>
          <Link to='/docs'><button class='ui button'>View detailed usage instructions</button></Link><br /><br /><br />
          <ApiForm location={this.props.location}/>

        </div>
      </div>
    );
  }
};
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
class ApiForm extends React.Component {

  render() {

    const panes = [
      {menuItem: 'Buy Property', render: () => <Tab.Pane><Buy /></Tab.Pane>},
      {menuItem: 'Sell Property', render: () => <Tab.Pane><Sell />
      </Tab.Pane>},
      {menuItem: 'Renovate Property', render: () => <Tab.Pane><Renovate /></Tab.Pane>},
    ]

    return(
      <div style={{marginBottom:50}}>
        <Tab menu={{ secondary: true, pointing: true, attached:true }} panes={panes} />
      </div>
    );
  }
};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
class Buy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      suburb: '',
      bedrooms: '',
      bathrooms: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeSelect = this.handleChangeSelect.bind(this)
  }
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeSelect(event, data) {
    const { name, value } = data;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    history.push('/buy-result', this.state)
  }
  render() {
    return (
      <div>
      <Title3 text='Browse Properties' />
      <p class='grey-text'>View a map displaying properties with the following attributes</p>
      <Form name='sellform' id='sellform'
        onSubmit={this.handleSubmit}
        class='ui form'>
        <Form.Input
          label='Suburb'
          name='suburb'
          value={this.state.suburb}
          onChange={this.handleChange}
          placeholder='Name of suburb'/>
        <Form.Group>
        <Form.Select label='Bedrooms'
          name='bedrooms'
          onChange={this.handleChangeSelect}
          options={optionsNums}
          placeholder='Number of Bedrooms'/>
        <Form.Select label='Bathrooms'
          name='bathrooms'
          onChange={this.handleChangeSelect}
          options={optionsNums}
          placeholder='Number of Bathrooms'/>
        </Form.Group>
        <Button
          type='submit'
          content='Submit'
          icon='right arrow'
          labelPosition='left'
          role='button'>
        </Button>
      </Form>
      </div>
    );
  }
}
/******************************************************************************/
class Renovate extends Component {
  render() {
    return (
      <div>
      Renovate
      </div>
    );
  }
}

export default ActualApp;
