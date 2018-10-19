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
 accessToken: "pk.eyJ1IjoiY3Jpc2IwIiwiYSI6ImNqbmVpcTFjNjA0YmUzd25iMnY4azhsNncifQ.XYPtG_NSEodlfarmqpatrQ"
});
const symbolLayout: MapboxGL.SymbolLayout = {
  'text-field': '{place}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top'
};
const symbolPaint: MapboxGL.SymbolPaint = {
  'text-color': 'white'
};

const circleLayout: MapboxGL.CircleLayout = { visibility: 'visible' };
const circlePaint: MapboxGL.CirclePaint = {
  'circle-color': 'black',
  'circle-blur': 0.4
};
const geojson = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [144.9631, -37.8136]
      },
      'properties': {
        'title': 'Test'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [142.000, -36.000]
      },
      'properties': {
        'title': 'Test2'
      }
    }
  ]
}

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
      result: [],
      initlat: 0,
      initlng: 0,
      schools: [],
      crimes: []
    };
  };

  componentWillMount() {
    axios.post('http://127.0.0.1:5000/test/search', this.state).then(
      response => {
        console.log(response.data)
        this.setState({ result: response.data.results });
        this.setState({ initlat: response.data.results[0].Latitude, initlng: response.data.results[0].Longitude });
        console.log(this.state)
      }
    ).catch(error => alert('/search: ' + error.message));
    axios.get('http://127.0.0.1:5000/test/school/' + this.state.suburb + '?ascending=true&sort_by=1').then(
      response => {
        console.log(response.data)
        this.setState({ schools: response.data.schools  })
      }
    ).catch(error => alert('/school: ' + error));

    axios.get('http://127.0.01:5000/test/crimes/' + this.state.suburb + '?group_by=0').then(
      response => {
        console.log(response.data)
        this.setState({ crimes: response.data.results });
      }
    ).catch(error => alert('/crimes: ' + error));
  }


/******************************************************************************/


  /*** CHARTS AND DISPLAY DATA STUFF ***/
 onClickCircle = (evt: any) => {
      console.log(evt);
    };
  onMouseEnterCircle = (evt: any) => {
    console.log(evt)
  }




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
    return(
      <div>
      <Banner />
      <div class='ui main text container' style={{marginBottom:60}}>
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
          center={[144.9631, -37.8136]}>
          {/* geojson layer black dots
          <GeoJSONLayer
                    data={geojson}
                    circleLayout={circleLayout}
                    circlePaint={circlePaint}
                    circleOnClick={this.onClickCircle}
                    symbolLayout={symbolLayout}
                    symbolPaint={symbolPaint}
                    circleOnMouseEnter={this.onMouseEnterCircle}
                  /> */}
          <Layer type="heatmap" paint={layerPaint}>
          {testdata.map((el: any, index: number) => (
            <Feature key={index} coordinates={[el.Latitude, el.Longitude]} properties={el} />
          ))}
        </Layer>
        </Map>
        {/* school and crime data */}

        </Segment>
      </div>
      </div>
    );
  }
}

const testdata = [
  {
    'Latitude': 144.9631,
    'Longitude': -37.8136,
    'Suburb': 'Melbourne',
    'Bedroom': 1,
    'Bathroom': 1
  },
  {
    'Latitude': 144.9631,
    'Longitude': -37.8136,
    'Suburb': 'Melbourne',
    'Bedroom': 1,
    'Bathroom': 1
  },
]

export default BuyResult;
