/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

import {Config} from './../config.js';
import '../css/Store.css';
import SliderHome from './SliderHome';
import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Store extends Component {
  
  state = { isLoading:true }

  componentWillMount() {
    const {name} = this.props.match.params;    
    Source.fetch(name, Config.Source + name + '.json').then( () => this.setState({isLoading:false}) );
    B.back = true;
  }

  render() {
    B.set(this);
    
    const {name} = this.props.match.params;    
    let storeDef = Source.getDef(name);
    if (this.state.isLoading) {
      return (
        <div>
          <div className="head">
            <HeaderComponent props={this.props} data={storeDef}/>
          </div>
          <div className="store">
            <div className="loading">
              <Loader color="#FFA500" size="16px" margin="4px"/>
            </div>
          </div>
        </div>
      );
    }

    let store = Source.get(name);   
    var counter = 0; 
    let thumbnails = storeDef.homepage.map( (thumbnail, index) => {
      let items = thumbnail.items.length ? thumbnail.items.map( (itemID, index2) => {
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
        <div key={index} className="thumbnails">
          <div className="catTitle">
            {thumbnail.title}
          </div>
          {items}
        </div>
      );
    });

    return (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            <SliderHome props={this.props} data={storeDef}/>
            { thumbnails }
          </div>
        </div>
      </div>
    );
  }
}
