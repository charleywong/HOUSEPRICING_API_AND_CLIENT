import React from 'react';
import { Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import axios from 'axios';

import bannerimg from './img/bg4.jpg';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
 accessToken: "pk.eyJ1IjoiY3Jpc2IwIiwiYSI6ImNqbmVpcTFjNjA0YmUzd25iMnY4azhsNncifQ.XYPtG_NSEodlfarmqpatrQ"
});

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


class BuyResult extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.location.state
    this.state = {
      suburb: data.suburb,
      min: data.priceRange.min,
      max: data.priceRange.max,
      Bedroom: data.bedrooms,
      Bathroom: data.bathrooms,
      result: []
    };
    console.log(this.state);
  };

  componentWillMount() {
    axios.post('http://127.0.0.1:5000/test/search', this.state).then(
      response => {
        this.setState({ result: response.data.results });
        // result = response.data;
        console.log(this.state.result);
      }
    ).catch(error => console.log(error));
  }

/******************************************************************************/


  /*** CHARTS AND DISPLAY DATA STUFF ***/


  render() {
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
    return(
      <div>
      <Banner />
      <div class='ui main text container' style={{marginBottom:60}}>
        <Title2 text='Browsing Properties'/>
        <ModalJSON />
        <Segment raised>
        <Label as='a' color='black' ribbon className='label'>Map</Label><br /><br />
        <p className='grey-text'>Viewing results for a _ bedroom, _ bathroom property located in ______. You have set a price range of __ to __ AUD.</p>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "60vh",
            width: "100"
          }}>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>

          </Layer>
        </Map>
        </Segment>
      </div>
      </div>
    );
  }
}

export default BuyResult;
