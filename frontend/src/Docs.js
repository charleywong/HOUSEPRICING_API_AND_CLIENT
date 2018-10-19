import React from 'react';
import { Table, Label, Segment, List } from 'semantic-ui-react';
import bannerimg from './img/banner2.jpg';


const Title2 = ({ text }) => ( <h1 class='App-title2'>{text}</h1> );
const Title3 = ({ text }) => ( <h2 class='App-title3'>{text}</h2> );
const Title4 = ({ text }) => ( <h3 >{text}</h3> );

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
    <div class='ui main container' style={{marginBottom:30}}>
      <Title2 text='Documentation'/>
      <Segment raised>
      <Label as='a' ribbon color='black'>Usage</Label>
      <Title4 text='Scenarios' />
      <List celled>
        <List.Item>
          <List.Content style={{margin:20}}>
            <List.Header style={{marginBottom:10}}>Users are able to view properties that are predicted to be within a supplied price range on a map. School and crime data is also displayed</List.Header>
             First home buyers looking for a property are able to view places within their budget.
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content style={{margin:20}}>
            <List.Header style={{marginBottom:10}}>Given information about the house, it will spit out a evaluation prediction on what the house is worth based on current market information.</List.Header>
            Used for selling property and bypassing realtor fee.
          </List.Content>
        </List.Item>
        <List.Item >
          <List.Content style={{margin:20}}>
            <List.Header style={{marginBottom:10}}>View attributes that may affect property desirability.</List.Header>
            View school and crime data within a suburb.
          </List.Content>
        </List.Item>
        <List.Item >
          <List.Content style={{margin:20}}>
            <List.Header style={{marginBottom:10}}>Decide whether to renovate your property.</List.Header>
            Gain insight into increasing your property value.
          </List.Content>
        </List.Item>
      </List>
      <Title4 text='Endpoints' />
      <Table color='orange'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>URL</Table.HeaderCell>
          <Table.HeaderCell>HTTP Request</Table.HeaderCell>
          <Table.HeaderCell>Payload</Table.HeaderCell>
          <Table.HeaderCell>Return Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell><Label horizontal>/search</Label></Table.Cell>
          <Table.Cell>POST</Table.Cell>
          <Table.Cell>suburb:string, max:integer, min:integer</Table.Cell>
          <Table.Cell>JSON Object of homes within the price range located in the suburb</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><Label horizontal>/predict_price</Label></Table.Cell>
          <Table.Cell>POST</Table.Cell>
          <Table.Cell>Address:string, Bedroom:integer, Bathroom:integer, Car:integer, day:integer, month:integer, year:integer</Table.Cell>
          <Table.Cell>Returns a float of predicted sale price</Table.Cell>
        </Table.Row>
        <Table.Row>
        <Table.Cell><Label horizontal>/school/&lt;SUBURB&gt;</Label></Table.Cell>
          <Table.Cell>GET</Table.Cell>
          <Table.Cell>group_by:enum, suburb:string</Table.Cell>
          <Table.Cell>Returns JSON object of incidents within suburb grouped by category.</Table.Cell>
        </Table.Row>
        <Table.Row>
        <Table.Cell><Label horizontal>/crimes/&lt;SUBURB&gt;</Label></Table.Cell>
          <Table.Cell>GET</Table.Cell>
          <Table.Cell>ascending:boolean, sort_by:string, suburb:string</Table.Cell>
          <Table.Cell>Returns a sorted JSON object of schools and their VCE Statistics</Table.Cell>
        </Table.Row>
      </Table.Body>
      </Table>
      </Segment>
      <Segment raised>
      <Label as='a' ribbon color='black'>Links</Label>
      <Title4 text='Git Repository' />
      <p>Please contact us for access to the repository.</p>
      <a href="https://github.com/crisb0/CS9321_ass03/" target="_blank" rel="noopener noreferrer"><button class='ui animated button'>
        <div class='visible content'>Github Link</div>
        <div class='hidden content'><i class='external alternate icon'/></div>
      </button></a>

      <Title4 text='Google Drive' />
      <p>For our meeting deliverable documents and project plan.</p>
      <a  href='https://drive.google.com/drive/folders/14iEiMHsPoinbkgTtaa5QAgRR_WCscU4M?usp=sharing' target="_blank" rel="noopener noreferrer"><button class='ui button animated'>
        <div class='visible content'>G Drive Link</div>
        <div class='hidden content'><i class='external alternate icon'/></div>
      </button></a>
      </Segment>
    </div>
  </div>
);

export default Docs;
