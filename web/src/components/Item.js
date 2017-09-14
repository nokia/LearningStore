import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class Item extends Component {
  constructor(props){
    super()
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">

          <h2>I am an item!! - {this.props.match.params.id}</h2>
        </div>
        <p className="App-intro">
          <br/>
          Click to go to the store <Link to="/">here</Link>
        </p>
      </div>
    );
  }
}


export default Item;