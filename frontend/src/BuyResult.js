import React from 'react';
import { Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import axios from 'axios';

import bannerimg from './img/bg4.jpg';
import homeIcon from './img/home0.png';
import ReactMapboxGl, { Layer, Feature, Source, GeoJSONLayer } from "react-mapbox-gl";
import * as MapboxGL from 'mapbox-gl';


const Map = ReactMapboxGl({
 accessToken: "pk.eyJ1IjoiY3Jpc2IwIiwiYSI6ImNqbmVpcTFjNjA0YmUzd25iMnY4azhsNncifQ.XYPtG_NSEodlfarmqpatrQ",
 minZoom: 12,
 maxZoom: 14
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
    this.data = this.props.location.state;
    this.state = {
      suburb: this.data.suburb,
      min: this.data.priceRange.min,
      max: this.data.priceRange.max,
      Bedroom: this.data.bedrooms,
      Bathroom: this.data.bathrooms,
      result: [],
      initlat: 0,
      initlng: 0,
      schools: [],
      crimes: []
    };
  };

  componentWillMount() {
    console.log(this.data)
    axios.post('http://127.0.0.1:5000/test/search', this.state).then(
      response => {
        console.log(response.data)
        this.setState({ result: response.data.results });
        this.setState({ initlat: response.data.results[0].Latitude, initlng: response.data.results[0].Longitude });
        console.log(this.state)
      }
    ).catch(error => alert('/search: ' + error.message));
    axios.get('http://127.0.0.1:5000/test/school/' + this.state.suburb + '?ascending=' + this.data.ascending + '&sort_by=' + this.data.sort_by ).then(
      response => {
        console.log(response.data)
        this.setState({ schools: response.data.schools  })
      }
    ).catch(error => alert('/school: ' + error));

    axios.get('http://127.0.01:5000/test/crimes/' + this.state.suburb + '?group_by=' + this.data.group_by).then(
      response => {
        console.log(response.data)
        this.setState({ crimes: response.data.results });
      }
    ).catch(error => alert('/crimes: ' + error));
  }


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/


  render() {
    const layerPaint = {
      'heatmap-weight': {
        property: 'Price',
        type: 'exponential',
        stops: [[0, 0], [5, 2]]
      },
      // Increase the heatmap color weight weight by zoom level
      // heatmap-ntensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': {
        stops: [[0, 0], [5, 1.2]]
      },
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.25,
        'rgb(103,169,207)',
        0.5,
        'rgb(209,229,240)',
        0.8,
        'rgb(253,219,199)',
        1,
        'rgb(239,138,98)',
        2,
        'rgb(178,24,43)'
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': {
        stops: [[0, 1], [5, 50]]
      },
      'heatmap-opacity': 0.7
    };
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
    const mapData = this.state.result;
    return(
      <div>
        <Banner />
        <div class='ui main container' style={{marginBottom:60}}>
          <Title2 text='Browsing Properties'/>
          <ModalJSON />
          <Segment raised>
            <Label as='a' color='black' ribbon className='label'>Map</Label><br /><br />
            <p className='grey-text'>Viewing results for a <Label horizontal>{this.state.Bedroom}</Label> bedroom, <Label horizontal>{this.state.Bathroom}</Label> bathroom property located in <Label horizontal>{this.state.suburb}</Label>. You have set a price range of <Label horizontal>${this.state.min}</Label> to <Label horizontal>${this.state.max}</Label> AUD.</p>
            <Map
              style="mapbox://styles/mapbox/light-v9"
              containerStyle={{
                height: "60vh",
                width: "100"
              }}
              zoom={[13]}
              center={[144.9631, -37.8136]}>
              <Layer type="heatmap" paint={layerPaint}>
              {/* {testdata.map((el: any, index: number) => (
                <Feature key={index} coordinates={[el.Latitude, el.Longitude]} properties={el} />
              ))} */}
              {mapData.map((el: any, index: number) => (
                <Feature key={index} coordinates={[el.Longitude, el.Latitude]} properties={el} />
              ))}
            </Layer>
            </Map>
          {/* SCHOOL AND CRIME DATA IN THIS SEGMENT */}
          </Segment>
          <Segment>
          <Label as='a' ribbon color='black'>Locality Data</Label>
          </Segment>
        </div>
      </div>
    );
  }
}

export default BuyResult;
