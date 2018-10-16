import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import { Form, Modal, Button } from 'semantic-ui-react';

import logo from './img/logo.svg';

import axios from 'axios'

var user = '';


class LoginModal extends React.Component {
  constructor(props) {
    super (props);
    this.state = {modalOpen: false, email:'', password:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

    localStorage.setItem('test', 'hello');

  }
  // close the modal
  handleOpen = () => this.setState({ modalOpen: true })

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    //bug we should be using this

    const data = new FormData(document.getElementById('login'));

    //post req so it's sent in the body rather than url
    //placeholder, trying to see if login button actually submits
    // console.log(this.state.email)
    // console.log(this.state.password)
    const url = 'http://localhost:5000/test/login';
    const payload = {
      name:this.state.email,
      password:this.state.password
    };
    const config = {
      headers: {'Access-Control-Allow-Origin': '*'}
    };

    /***
    POST REQ, set session in local storage as token-username
    ***/
    axios.post(url, payload)
    .then(function(response) {
      console.log(response.data);
      localStorage.setItem('session', response.data);
    })
    // .then(response => localStorage.setItem('session', response.data));
    // localStorage.setItem('test', '1');

    this.setState({modalOpen: false});

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
            <Button type='submit' onClick={this.handleClose}>Login</Button>
          </Form><br />
          </div>
        </Modal.Description>
      </Modal.Content>
      </Modal>
      );
  }
}

class RegistrationModal extends React.Component {
  constructor(props) {
    super (props);
    this.state = {modalOpen: false, email:'', password:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    //bug we should be using this

    const data = new FormData(document.getElementById('register'));

    //post req so it's sent in the body rather than url
    //placeholder, trying to see if login button actually submits
    // console.log(this.state.email)
    // console.log(this.state.password)
    const url = 'http://localhost:5000/test/register';
    const payload = {
      name:this.state.email,
      password:this.state.password
    };
    const config = {
      headers: {'Access-Control-Allow-Origin': '*'}
    };

    /***
    POST REQ, set session in local storage as token-username
    ***/
    axios.post(url, payload)
    .then(function(response) {
      console.log(response.data);
    })
    // .then(response => localStorage.setItem('session', response.data));
    // localStorage.setItem('test', '1');

    this.setState({modalOpen: false});
  }

  render() {
    return(
      <Modal size='tiny'
        trigger={<div class='item' onClick={this.handleOpen}>Register</div>}
        open={this.state.modalOpen}
        onClose={this.handleClose}>
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
          <Form name='register' onSubmit={this.handleSubmit} id='register' class='ui form'>
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
            <Button type='submit' onClick={this.handleClose}>Register</Button>
          </Form><br />
          </div>
        </Modal.Description>
      </Modal.Content>
      </Modal>
      );
  }
}
/*** navbar ***/
const Nav = props => (
      <div class='inverted ui menu borderless fixed'>
        <div id='top'></div>
        <div class='yellow ui container'>
          <Link to='/' class='yellow header item'><img src={logo} style={{marginRight: 15,}}/>HOUSOS</Link>
          <Link to='/'class='item'>Home</Link>
          <Link to="/api" class='item'>Explore the API</Link>
          <Link to='/docs'class='item'>Docs</Link>
          <div class='right menu'>
            <LoginModal />
            <RegistrationModal/>
          </div>
        </div>
      </div>
);

export default Nav;
