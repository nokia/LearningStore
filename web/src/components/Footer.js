/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import '../css/Footer.css';


export default class Footer extends Component {
  constructor(props) {
    super(props);
     
  }

 
  render() {
    return (
      <div className="footer">
        <div className="wrapper">
          Powered By Nokia
        </div>
      </div>     
    );
  }
}