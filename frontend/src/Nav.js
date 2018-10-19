import React from 'react';
import { Link } from 'react-router-dom';

import { Form, Modal, Button, Rail, Icon } from 'semantic-ui-react';

import logo from './img/logo.svg';

import axios from 'axios'

class LoginModal extends React.Component {
  constructor(props) {
    super (props);
    this.state = {modalOpen: false, loggedIn: false, email:'', password:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);


  }
  // close the modal
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    //bug we should be using this

    //const data = new FormData(document.getElementById('login'));

    //post req so it's sent in the body rather than url
    //placeholder, trying to see if login button actually submits
    // console.log(this.state.email)
    // console.log(this.state.password)
    const url = 'http://localhost:5000/test/login';
    const payload = {
      name:this.state.email,
      password:this.state.password
    };

    /***
    POST REQ, set session in local storage as token-username
    ***/
    axios.post(url, payload)
    .then(function(response) {
      localStorage.setItem('session', response.data['message']);
    })
    this.setState({modalOpen: false});
    alert('You are now logged in!');

  }

  render() {
    return(
      <Modal size='tiny'
        trigger={<div class='item' onClick={this.handleOpen}>Login</div>}
        open={this.state.modalOpen}
        onClose={this.handleClose}>
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
          <Form name='login' onSubmit={this.handleSubmit} id='login' class='ui form'>
            <Form.Field>
              <label>Email</label>
              <input
                onChange={this.handleChange}
                name='email'
                placeholder='johnsmith@example.com'
                value={this.state.email}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                onChange={this.handleChange}
                type='password'
                name='password'
                value={this.state.password}
              />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Login</Button>
          </Form><br />
          <Rail attached position='right'><Icon onClick={this.handleClose} style={{padding:10}} fitted name='close' color='red' /></Rail>
          </div>
        </Modal.Description>
      </Modal.Content>
      </Modal>
      );
  }
}

/*** navbar ***/

class Nav extends React.Component {

  handleLogout = () => {
    localStorage.removeItem('session', null)
    console.log('logged out ' + localStorage.getItem('session'))
  }
  render() {
    let logio;
    if (localStorage.getItem('session') === null) {
      logio = <LoginModal />;
    } else {
      logio = <div class='item' onClick={this.handleLogout}><Link to='/'>Logout</Link></div>;
    }
    return(
      <div class='inverted ui menu borderless fixed'>
        <div id='top'></div>
        <div class='yellow ui container'>
          <Link to='/' class='yellow header item'><img src={logo} alt='logo' style={{marginRight: 15,}}/>HOUSOS</Link>
          <Link to='/'class='item'>Home</Link>
          <Link to="/api" class='item'>Explore the API</Link>
          <Link to='/docs'class='item'>Docs</Link>
          <div class='right menu'>
            {logio}
          </div>
        </div>
      </div>
)}
}

export default Nav;
