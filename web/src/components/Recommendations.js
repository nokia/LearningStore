/**
 * Created by lambeth on 1/10/2018.
 * Copyright Nokia 2017. All rights reserved.
 */
import React, { Component } from 'react';
import '../css/Item.css';
import Source from './data';
import Thumbnail from './Thumbnail';

export default class Recommendations extends Component{

  render() {
    let name = this.props.props.match.params.name;
    let store = Source.get(name);
    let storeDef = Source.getDef(name);
    var counter = 0;
    let items = this.props.item.Recommendations.length ? this.props.item.Recommendations.map( (itemID, index2) => {
      let item = store.getByID(itemID);
      if (!item) return null;

      return ++counter % 5 === 0 ?
        (
          <Thumbnail  key={index2} noMargin="yes" props={this.props} data={item} store={storeDef} />
        )
        : (
        <Thumbnail  key={index2} props={this.props} data={item} store={storeDef} />
      );
    }) : [];

    return (
      <div className="itemField">
        <div className="itemFieldTitle">
        You might also be interested by the following
        </div>
        <div className="itemFieldBody">
          { items }
        </div>
      </div>
    )
  }
}