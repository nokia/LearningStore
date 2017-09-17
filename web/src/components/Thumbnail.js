/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Source from './data';

import '../css/Thumbnail.css';

export default class Thumbnail extends Component {

  render() {
    let lim = 38;
    let data = this.props.data;
    let store = this.props.store;

    let title = Source.format(data.Title);
    if(title.length > lim){
      title = title.substr(0, lim) + "...";
    }

    return (
      <Link
        className="thumbnail"
        to={{
          pathname: `/${store.id}/item/${data.ID}`
        }}
      >
        <div title={data.Title}>
          <div className="thumbnailLogo">
            <img src={store.url + "/" + data.Icon} alt=''/>
          </div>
          <div className="thumbnailTitle">
            { title }
          </div> 
        </div>
      </Link>
    );
  }
}
