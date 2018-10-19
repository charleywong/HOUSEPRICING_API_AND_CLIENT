import React, { Component } from 'react';
import { Button, Form, Divider, Tab, Segment, Label } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { DateInput } from 'semantic-ui-calendar-react';
import createHistory from "history/createBrowserHistory";
import axios from 'axios';


import './ActualApp.css';
import bannerimg from './img/bg2.jpg';
import Sell from './Sell.js';
import Buy from './Buy.js';
import Renovate from './Renovate.js'

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
        <div class='ui main container'>
          <Title2 text='Property Valuation API'/>
          <Link to='/docs'><button class='ui button'>View Documentation</button></Link>
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
      <Segment raised style={{marginBottom:50}}>
        <Label as='a' color='black' ribbon>Client</Label><br /><br />
        <p className='grey-text'>Select <Label horizontal>Buy Property</Label> to browse homes within an area and budget, <Label horizontal>Sell Property</Label> for an accurate valuation of property or <Label horizontal>Renovate Property</Label> to see how much value there is in renovating your home!  </p>
        <Tab menu={{ secondary: true, pointing: true, attached:true }} panes={panes} />
      </Segment>
    );
  }
};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
export default ActualApp;
