import React, { Component } from 'react';
import '../css/NotFound.css';

class NotFound extends Component{

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
    );
  }
}

export default NotFound;