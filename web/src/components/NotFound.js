import React, { Component } from 'react';
import '../css/NotFound.css';

var data;
var properties;
class NotFound extends React.Component{

  constructor(props) {
    super(props);
    properties = props.props;
    data = props.data;
  }

  
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
};
export default NotFound;