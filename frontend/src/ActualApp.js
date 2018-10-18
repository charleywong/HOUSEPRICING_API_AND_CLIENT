import React, { Component } from 'react';
import { Button, Form, Divider, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateInput } from 'semantic-ui-calendar-react';
import createHistory from "history/createBrowserHistory";

import './ActualApp.css';
import bannerimg from './img/bg2.jpg';

const history = createHistory({forceRefresh:true})
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
class Sell extends Component {
  constructor(props) {
    super(props);
    this.location = this.props.location;
    this.state = {
        address: '',
        suburb: '',
        postcode: '',
        date: '',
        year: '',
        month: '',
        day: '',
        type: '',
        bedrooms: '',
        bathrooms: '',
        carslots: '',
        landsize: '',
        buildingarea: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  componentDidMount() {
    console.log(localStorage.getItem('session'));
    if (localStorage.getItem('session') === null) {
      alert("You are unable to use this API without signing in!");
      this.setState({loggedIn: false});
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeSelect(event, data) {
    const { name, value } = data;
    this.setState({ [name]: value });
  }

  handleChangeDate = (event, {name, value}) => {
      if (this.state.hasOwnProperty(name)) {
        const day = value.split("-")[0].toString()
        const mon = value.split("-")[1].toString()
        const year = value.split("-")[2].toString()
        this.setState({ 'day': day, 'month': mon, 'year': year, [name]: value});
      }
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
    // console.log(this.state)
    history.push('/result', this.state)

  }
  render () {
    return (
      <div>
      <Form name='apiform' id='apiform'
        onSubmit={this.handleSubmit}
        class='ui form'>
      <Title3 text='Location & Date' />
        <Form.Group widths='equal'>
          <Form.Input required fluid width={9}
            name='address'
            value={this.state.address}
            onChange={this.handleChange}
            label='Address'
            placeholder='Sydney' />
          <Form.Input fluid width={4}
            name='suburb'
            value={this.state.suburb}
            onChange={this.handleChange}
            label='Suburb'
            placeholder='Sydney' />
          <Form.Input fluid width={3}
            name='postcode'
            value={this.state.postcode}
            onChange={this.handleChange}
            label='Postcode'
            placeholder='2000' />
        </Form.Group>
          <DateInput
          label='Date'
          name="date"
          placeholder="Date"
          value={this.state.date}
          onChange={this.handleChangeDate} />

        <Divider />
        <Title3 text='Property Features' />
        <Form.Select label='Type'
          name='type'
          options={optionsType}
          value={this.state.type}
          onChange={this.handleChangeSelect}
          placeholder='Type of Property' />
        <Form.Group widths='equal'>
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
          <Form.Select label='Car Spaces'
            name='carslots'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Car Spaces'/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid
            name='landsize'
            onChange={this.handleChange}
            value={this.state.landsize}
            label='Landsize (m^2)'
            placeholder='399'/>
          <Form.Input fluid
            name='buildingarea'
            onChange={this.handleChange}
            value={this.state.buildingarea}
            label='Building Area (m^2)'
            placeholder='399' />
        </Form.Group>
      <Divider />

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
class Buy extends Component {
  render() {
    return (
      <div>
      Buy
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
