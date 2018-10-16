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


class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, data: this.props.location.state };
    console.log(this.state);

    axios.post('http://localhost:5000/test/predict', this.state.data).then(function(response) {
      // console.log(response)
       console.log(response.data)
    });
  }

  /*** loader ***/
  componentDidMount() {
    this.setState({loading:false});
  }
  /*** CHARTS AND DISPLAY DATA STUFF ***/


  render() {
    if (this.state.loading) {
      return <div><Icon loading name='certificate' /></div>;
    }
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
        <ModalJSON />
        <p>Charts here...</p>
        <p>Other information here...</p>
        <Link to='/api'><button class='ui icon left labeled button'>
          <i aria-hidden='true' class='left arrow icon' />
          Back
        </button></Link>
      </div>
      </div>
    );
  }
}

export default Result;
