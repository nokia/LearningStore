/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import '../css/NotFound.css';

export default class NotFound extends Component {
  render() {
    return (
      <div className="notFound wrapper">
        <div className="notFound404">
          404 error
        </div>
        <div className="notFoundText">
          Page not found...
        </div>
      </div>            
    )
  }
}