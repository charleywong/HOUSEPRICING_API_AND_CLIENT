import React, { Component } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import './ActualApp.css';

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
    this.state = { 'data': {address: '', city: '' }, loggedIn: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log(localStorage.getItem('session'));
    if (localStorage.getItem('session') === null) {
      alert("You are unable to use this API without signing in!");
      this.setState({loggedIn: false});
    }
  }



  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ 'data': { [name]: value }});
  }
  handleSubmit(event) {
    event.preventDefault();
    //const data = new FormData(document.getElementById('apiform'));

    // note that because this request is async, when handling response, we should try to use callback functions such as console.log
    // rather than functions like alert() which is also async
    // there is also a bug with this where if your resulting data is too large, it'll throw an except.
    // googling, it says a way around this is to not use the history thing and use
    // sessionStorage and/or localStorage:
    // https://stackoverflow.com/questions/24425885/failed-to-execute-pushstate-on-history-error-when-using-window-history-pushs
    // please also note that we need to replace the current link with localhost:3001/....
    // axios.post('http://localhost:5000/test/predict', this.state.data).then(function(response) {
    //   // console.log(response)
    //   history.push('/result', response.data)
    //   // console.log(response)
    // });
    history.push('/result', this.state.data)

  }
  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to='/' />
    }
    return(
      <div>
      <Title3 text='Start Valuation' />
      <Form name='apiform' id='apiform'
        onSubmit={this.handleSubmit}
        class='ui form'
        style={{marginBottom:60}}>
        <div class='field'>
          <label>Street Address</label>
            <Input
              onChange={this.handleChange}
              name='address' id='address'
              value={this.state.address}
              placeholder='e.g. 1 Two Street'/>
        </div>
        <div class='field'>
          <label>City/Town/Suburb</label>
            <Input
              onChange={this.handleChange}
              name='city' id='city'
              value={this.state.city}
              placeholder='e.g. New York City'/>
        </div>
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
};

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
          <Link to='/docs'><button class='ui button'>View detailed usage instructions</button></Link><br /><br />
          <div style={{paddingBottom:20}} class='ui divider' />
          <ApiForm location={this.props.location}/>

        </div>
      </div>
    );
  }
};

export default ActualApp;
