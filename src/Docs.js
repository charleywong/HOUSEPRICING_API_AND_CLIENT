import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import bannerimg from './img/banner2.jpg';


const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );

const bannerStyle = {
  height:300,
  backgroundImage: 'url(' + bannerimg + ')',
  backgroundSize: 'cover'
};

const Banner = ({ img, text }) => (
  <div style={bannerStyle}>
  </div>
);

const Docs = () => (
  <div style={{height:800}}>
    <Banner />
    <div class='ui main text container'>
      <Title2 text='DOCUMENTATION'/>
      <Title3 text='Git Repository' />
      <a href="https://github.com/crisb0/CS9321_ass03/">https://github.com/crisb0/CS9321_ass03/</a>
      <p>Please contact us for access to the repository.</p>
    </div>
  </div>
);

export default Docs;
