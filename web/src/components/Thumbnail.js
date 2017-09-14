import React, { Component } from 'react';
import '../css/Thumbnail.css';

var data;
var properties;
var url;
class Thumbnail extends React.Component{

  constructor(props) {
    super(props);
    properties = props.props;
    data = props.data;
    url = props.url;
    console.log(properties);
  }


  render() {
    console.log('thumn', data);

    

    return (
      <div className="thumbnail" title={data.Title}>
        <div className="thumbnailLogo">
          <img src={url + "/" + data.Icon} />
        </div>
        <div className="thumbnailTitle">
          {data.Title}
        </div> 
      </div>
    );
  }
};
export default Thumbnail;