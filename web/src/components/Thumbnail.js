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
    let noMargin = this.props.noMargin;
    let store = this.props.store;
    let thisClass = "thumbnail";

    let title = Source.format(data.Title);
    if(title.length > lim){
      title = title.substr(0, lim) + "...";
    }
    if (noMargin === "yes"){
      thisClass += " noMarginRight"
    }
    
    // console.log(data)
    if(data.Solutions){
      return (
        <Link
          className={thisClass}
          to={{
            pathname: `/${store.id}/item/${data.ID}`
          }}
        >
          <div className="collection"></div>
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
    return (
      <Link
        className={thisClass}
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
