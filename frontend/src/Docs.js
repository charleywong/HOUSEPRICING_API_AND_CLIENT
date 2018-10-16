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
  <div>
    <Banner />
    <div class='ui main text container'>
      <Title2 text='DOCUMENTATION'/>
      <Title3 text='Usage' />
      <Title3 text='Example Use Cases' />
      <Title3 text='Versioning' />
      <Title3 text='Git Repository' />
      <p>Please contact us for access to the repository.</p>
      <a href="https://github.com/crisb0/CS9321_ass03/" target="_blank"><button class='ui animated button'>
        <div class='visible content'>Github Link</div>
        <div class='hidden content'><i class='external alternate icon'/></div>
      </button></a>

      <Title3 text='Google Drive' />
      <p>For our meeting deliverable documents and project plan.</p>
      <a  href='https://drive.google.com/drive/folders/14iEiMHsPoinbkgTtaa5QAgRR_WCscU4M?usp=sharing' target="_blank"><button class='ui button animated' role='button'>
        <div class='visible content'>G Drive Link</div>
        <div class='hidden content'><i class='external alternate icon'/></div>
      </button></a>
    </div>
  </div>
);

export default Docs;
