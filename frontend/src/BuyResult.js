import React from 'react';
import { Modal, Icon, Label, Segment, List, Item, Divider, Tab} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import axios from 'axios';

import bannerimg from './img/bg4.jpg';
import homeIcon from './img/home0.png';
import ReactMapboxGl, { Layer, Feature, Source, GeoJSONLayer } from "react-mapbox-gl";
import * as MapboxGL from 'mapbox-gl';

const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );
const Title4 = ({ text }) => ( <h3 class='App-title3'>{text}</h3> );

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
// const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );


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
      initlat: -37.8136,
      initlng: 144.9631,
      schools: [],
      crimes: []
    };
  };

  
  componentWillMount() {
    // function getSchool(suburb, ascending, sort) {
    //   return (axios.get('http://127.0.0.1:5000/test/school/' + suburb + '?ascending=' + ascending + '&sort_by=' + sort).then (response => {
    //       console.log(response.data);
    //       this.setState({schools:response.data.schools});
    //     }).catch(function(error) {
    //       alert(error)
    //     }));
    // }
    // function getCrime(suburb, groupBy) {
    //   return (axios.get('http://127.0.01:5000/test/crimes/' + suburb + '?group_by=' + groupBy).then (response => {
    //       console.log(response.data);
    //       this.setState({ crimes: response.data.results });
    //     }).catch(function(error) {
    //       alert(error)
    //     }));
    // }
    console.log(this.data)
    axios.post('http://127.0.0.1:5000/test/search', this.state).then(
      response => {
        console.log(response.data)
        this.setState({ result: response.data.results });
        this.setState({ initlat: response.data.results[0].Latitude, initlng: response.data.results[0].Longitude });
        console.log(this.state)
      }
    // ).catch(error => alert('/search: ' + error.message));
    ).catch(function(error) {
        alert('/search: ' + error.message)
    })
    axios.get('http://127.0.0.1:5000/test/school/' + this.state.suburb + '?ascending=' + this.data.ascending + '&sort_by=' + this.data.sort_by).then(
      response => {
        console.log(response.data)
        this.setState({schools:response.data.schools})
      }).catch(error => {
        if (error.response.status == 400) {
          // invalid field
        }
      })
    const self = this;
    axios.get('http://127.0.01:5000/test/crimes/' + this.state.suburb + '?group_by=' + this.data.group_by).then(
      response => {
        console.log(response.data)
        self.setState({ crimes: response.data.results });
        console.log(self.state.crimes)
      }).catch(error => {
        console.log(error)
      })

    
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
    // i want to make a check so that if d == null or undefined, show appropriate stuff
    function CheckSchoolData (data) {
      console.log(data);

      if (data.data.length == 0) {
        return (
        <Title4 text={'There is no data for this suburb'}/>
        )
      } else {
        return (
          data.data.map(function(d,idx) {
              console.log(d)
              return (
                <div key={idx}>
                  <Item.Group>
                    <Item>
                      <Item.Content>
                        <Item.Description>
                          <Title4 text={d.School_Name}/>
                            <List style={ListStyle}>
                              <List.Item>
                                <List.Header>VCE Completion Percentage</List.Header>
                                {d['VCE_Completion%']}
                              </List.Item>
                              <List.Item>
                                <List.Header>VCE Median</List.Header>
                                {d['VCE_Median']}
                              </List.Item>
                              <List.Item>
                                <List.Header>VCE Over 40%</List.Header>
                                {d['VCE_Over40%']}
                              </List.Item>
                              <List.Item>
                                <List.Header>VCE Students</List.Header>
                                {d['VCE_Students']}
                              </List.Item>
                            </List>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                </div>
              );
            })
          )
      }
    }

    function CheckCrimeData (data) {
      console.log(data);

      if (data.data.length == 0) {
        return (
        <Title4 text={'There is no data for this suburb'}/>
        )
      } else {
        return (
          data.data.map(function(d,idx) {
              console.log(d)
              return (
                <div key={idx}>
                  <Item.Group>
                    <Item>
                      <Item.Content>
                        <Item.Description>
                            <List style={ListStyle}>
                              <List.Item>
                                <List.Header>{d.category}</List.Header>
                                {d.incidents}
                              </List.Item>
                              
                            </List>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                </div>
              );
            })
          )
      }
    }

    const mapData = this.state.result;
    const schoolData = this.state.schools;
    const crimeData = this.state.crimes;
    var schoolHeading = 'Schools and their VCE Stats for the suburb of ' + this.state.suburb;
    var crimeHeading = 'Crime data for the suburb of ' + this.state.suburb;
    // console.log(mapData);
    // console.log(schoolData)
    console.log(crimeData);
    const ListStyle = {
      marginLeft:'3%'
    }

    const panes = [
      {menuItem: 'School Information', render: () => <Tab.Pane><Title3 text={schoolHeading}/><Divider /> <CheckSchoolData data={schoolData}/> </Tab.Pane>},
      {menuItem: 'Crime Information', render: () => <Tab.Pane><Title3 text={crimeHeading}/><Divider/>{crimeData && <CheckCrimeData data={crimeData}/>}</Tab.Pane>},
    ]
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
              center={[this.state.initlng,this.state.initlat]}>
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
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          </Segment>

        </div>
      </div>
    );
  }
}

export default BuyResult;
