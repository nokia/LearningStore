/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import '../css/Header.css';
import FaSearch from 'react-icons/lib/fa/search';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="wrapper">
          <Link to="/employee/" replace>
            <div className="header-name" title="Home">
              { this.props.data.title }
            </div>
          </Link>
          <div className="header-input">
            <input type="text" placeholder="Search in the store..." />
            <div className="header-search">
              <FaSearch color='#ffffff'  style={{ marginTop: '-5px' }}/>
            </div>
          </div>
        </div>
      </div>     
    );
  }
}
