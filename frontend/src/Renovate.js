import React, { Component } from 'react';
import { Button, Form, Divider, Tab, Modal, Message } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import createHistory from "history/createBrowserHistory";
import axios from 'axios';
import ReactJson from 'react-json-view';

import './ActualApp.css';

const history = createHistory({forceRefresh:true})
const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );
const Title4 = ({ text }) => ( <h3 class='App-title3'>{text}</h3> );

const optionsType = [
  { key: 'H', text: 'House', value:'h'},
  { key: 'U', text: 'Unit', value:'u'},
  { key: 'T', text: 'Townhouse', value:'t'}
]

const optionsNums = [
  {key: '1', text: '1', value:1},
  {key: '2', text: '2', value:2},
  {key: '3', text: '3', value:3},
  {key: '4', text: '4', value:4},
  {key: '5', text: '5', value:5},
  {key: '6', text: '6', value:6},
  {key: '7', text: '7', value:7},
  {key: '8', text: '8', value:8},
  {key: '9', text: '9', value:9},
  {key: '10', text: '10', value:10},
]



class Renovate extends Component {
  constructor(props) {
    super(props);
    this.location = this.props.location;
    this.state = {
        predictCurr: [],
        predictReno: [],
        Address: '',
        Postcode: '',
        date: '',
        year: 0,
        month: 0,
        day: 0,
        Type: '',
        Bedroom: 0,
        Bathroom: 0,
        Car: 0,
        Landsize: '',
        Buildingarea: '',
        RenoBedroom: 0,
        RenoBathroom: 0,
        RenoCar: 0,
        RenoLandsize: '',
        RenoBuildingarea: '',
      };

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
        const day = parseInt(value.split("-")[0].toString(),10)
        const mon = parseInt(value.split("-")[1].toString(), 10)
        const year = parseInt(value.split("-")[2].toString(), 10)

        this.setState({ 'day': day, 'month': mon, 'year': year, [name]: value});
      }
    }

  handleSubmit(event) {

    var current;
    var reno;
    event.preventDefault();
    if (localStorage.getItem('session') === null) {
      alert("You are unable to use this API without signing in!");
      this.setState({loggedIn: false});
    } else {
      axios.post('http://localhost:5000/test/predict_price', this.state).then(
        response => {
          this.setState({ predictCurr: response.data });
          console.log(this.state.predictCurr)
          // SWAP VALUES OF FIELD AND RENOFIELD - Bedroom, Bathroom, Car, Landsize, Buildingarea
          const bd = this.state.Bedroom;
          const bt = this.state.Bathroom;
          const cr = this.state.Car;
          const ls = this.state.Landsize;
          const ba = this.state.Buildingarea;
          this.setState({
            Bedroom: this.state.RenoBedroom,
            RenoBedroom: bd,
            Bathroom: this.state.RenoBathroom,
            RenoBathroom: bt,
            Car: this.state.RenoCar,
            RenoCar: cr,
            Landsize:  this.state.RenoLandsize,
            RenoLandsize: ls,
            Buildingarea: this.state.RenoBuildingarea,
            RenoBuildingarea: ba
          });
        }
      ).then( () => {
        console.log(this.state)
        axios.post('http://localhost:5000/test/predict_price', this.state).then(
          response => {
            this.setState({ predictReno: response.data });
            console.log(this.state.predictReno)
          }
        ).catch(error => console.log(error));
      }).catch(error => console.log(error));
    }

  }

  render () {
    const RenoPrediction = () => (
      <div>
      <Title3 text='We predict an improved property value of ...' />
      <h1>${parseFloat((this.state.predictReno.price - this.state.predictCurr.price).toFixed(2))} AUD</h1>
      <ModalJSON />
      </div>
    );
    const ModalJSON = () => (
      <Modal trigger={<button class='ui animated button'>
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

    return (
      <div>
      <Title3 text='Looking to Renovate?'/>
      <p class='grey-text'>Find out how much value you&#39;ll get back!</p>
      <Form name='sellform' id='sellform'
        onSubmit={this.handleSubmit}
        class='ui form'
        style={{marginBottom: 20}}>
      <Title4 text='Current' />
        <Form.Group widths='equal'>
          <Form.Input required fluid width={9}
            name='Address'
            value={this.state.address}
            onChange={this.handleChange}
            label='Address'
            placeholder='Sydney' />
          <Form.Input fluid width={3}
            name='Postcode'
            value={this.state.postcode}
            onChange={this.handleChange}
            label='Postcode'
            placeholder='2000' />
        </Form.Group>
        <Form.Select required label='Type'
          name='Type'
          options={optionsType}
          value={this.state.type}
          onChange={this.handleChangeSelect}
          placeholder='Type of Property' />
        <Form.Group widths='equal'>
          <Form.Select required label='Bedrooms'
            name='Bedroom'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Bedrooms'/>
          <Form.Select required label='Bathrooms'
            name='Bathroom'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Bathrooms'/>
          <Form.Select required label='Car Spaces'
            name='Car'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Car Spaces'/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid
            name='Landsize'
            onChange={this.handleChange}
            value={this.state.landsize}
            label='Landsize (m^2)'
            placeholder='399'/>
          <Form.Input fluid
            name='Buildingarea'
            onChange={this.handleChange}
            value={this.state.buildingarea}
            label='Building Area (m^2)'
            placeholder='399' />
        </Form.Group>

        <Divider />
        <Title4 text='After Renovations' />
        <Form.Group widths='equal'>
          <Form.Select required label='Bedrooms'
            name='RenoBedroom'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Bedrooms'/>
          <Form.Select required label='Bathrooms'
            name='RenoBathroom'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Bathrooms'/>
          <Form.Select required label='Car Spaces'
            name='RenoCar'
            onChange={this.handleChangeSelect}
            options={optionsNums}
            placeholder='Number of Car Spaces'/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid
            name='RenoLandsize'
            onChange={this.handleChange}
            value={this.state.landsize}
            label='Landsize (m^2)'
            placeholder='399'/>
          <Form.Input fluid
            name='RenoBuildingarea'
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
      {this.state.predictCurr.price && this.state.predictReno.price && <RenoPrediction />}
      </div>
    );
  }
}

export default Renovate;
