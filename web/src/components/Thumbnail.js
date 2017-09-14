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
    // console.log(properties);
  }

  onClick(){
    properties.history.push(properties.history.location.pathname + "item/" + data.ID);
  }

  render() {
    // console.log('thumn', data);

    var lim = 38;
    var title = data.Title;
    if(title.length > lim){
      title = title.substr(0, lim) + "...";
    }
    data.Title = title;

    return (
      <div className="thumbnail" title={data.Title} onClick={this.onClick}>
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