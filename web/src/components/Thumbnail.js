import React, { Component } from 'react';
import '../css/Thumbnail.css';

import { Link } from 'react-router-dom';

class Thumbnail extends React.Component{

  constructor(props) {
    super(props);
  }

  // onClick(){
  //   properties.history.push(properties.history.location.pathname + "item/" + data.ID);
  // }

  render() {
    let lim = 38;
    let data = this.props.data;
    let myStore = this.props.store;

    let title = data.Title;
    if(title.length > lim){
      title = title.substr(0, lim) + "...";
    }

    return (
      <Link
        className="thumbnail"
        to={{
          pathname: `/${myStore.id}/item/${data.ID}`
        }}
      >
        <div title={data.Title}>
          <div className="thumbnailLogo">
            <img src={myStore.url + "/" + data.Icon} />
          </div>
          <div className="thumbnailTitle">
            {title}
          </div> 
        </div>
      </Link>
    );
  }
};
export default Thumbnail;