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
    let lim = 45;
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
    store.url = store.url || '.';
    
    // console.log(data)

  


    let src;
    if(data.Icon.constructor === Array){
      src = data.Icon[1];
      if(data.Icon[1].split('/')[0] == "img"){
        src = store.url + "/" + data.Icon[1];
      }
    }else{
      src = store.url + "/" + data.Icon;
    }
    if(data.Solutions){
      return (
        <Link
          className={thisClass}
          to={{
            pathname: `/${store.id}/item/${data.ID}`
          }}
        >
          <div className="collec"></div>
          <div title={data.Title}>
            <div className="thumbnailLogo">
              <img src={src} alt=''/>
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
            <img src={src} alt=''/>
          </div>
          <div className="thumbnailTitle">
            { title }
          </div> 
        </div>
      </Link>
    );
  }
}
