import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import { Form, Modal, Button } from 'semantic-ui-react';

import logo from './img/logo.svg';

const LoginModal = () => (
  <Modal size='tiny' trigger={<div class='item'>Login</div>} closeIcon>
  <Modal.Header>Login</Modal.Header>
  <Modal.Content>
    <Modal.Description>
      <div>
      <Form name='login' id='login' class='ui form'>
        <Form.Field>
          <label>Email</label>
          <input
            name='email'
            placeholder='johnsmith@example.com'
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type='password'
          />
        </Form.Field>
        <Button type='submit'>Login</Button>
      </Form><br />
      </div>
    </Modal.Description>
  </Modal.Content>
  </Modal>
);
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
          </div>
        </div>
      </div>
);

export default Nav;
