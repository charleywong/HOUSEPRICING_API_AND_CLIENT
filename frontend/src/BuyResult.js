import React from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import axios from 'axios';


import bannerimg from './img/bg2.jpg';

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
    this.state = {
      data: this.props.location.state,
    };
    let predict;
    console.log(this.state);
  };

  componentWillMount() {
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // CALLS TO API HERE
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    console.log('hello');
    axios.post('http://127.0.0.1:5000/test/predict_price', {'Address': '44 Abbotsford St, Abbotsford'}).then(
      response => {
        // this.setState({ predict: response.data });
        console.log(response);
      }
    ).catch(error => console.log(error));
  }

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
        <Title2 text='Showing Results'/>
        Buy result
      </div>
      </div>
    );
  }
}

export default BuyResult;
